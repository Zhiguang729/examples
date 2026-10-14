import { Request, Response } from "express";
import { z } from "zod";
import { NotNull } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { OrderStatusEnum } from "../../database/database";
import { isId } from "../ensureLoggedIn";
import { sendEmail } from "../../emails";

export const zCreateOrder = z.object({
  reagentId: isId,
  notes: z.string().optional(),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "The quantity of order should be at least 1."),
});

export type CreateOrderBody = z.infer<typeof zCreateOrder>;

export async function createOrder(request: Request, response: Response) {
  //console.log("Request Body:", request.body);

  // check if user is valid and has a valid id
  if (!request.user || !request.user.user_id) {
    return response.status(400).json({
      reason: "invalidUser",
      message: `User must be logged in to create orders`,
    });
  }

  const parseBodyResult = zCreateOrder.safeParse(request.body);
  if (!parseBodyResult.success) {
    for (const [k, v] of Object.entries(zCreateOrder.shape)) {
      // if field is compulsory but missing
      if (!v.isOptional() && request.body[k] === undefined) {
        return response.status(400).json({
          reason: "invalidParams",
          message: `Missing field '${k}' in body`,
        });
      }
      if (!v.safeParse(request.body[k]).success) {
        return response.status(400).json({
          reason: "invalidParams",
          message: `Invalid field '${k}' in body`,
        });
      }
    }

    return response.status(400).json({
      reason: "invalidParams",
    });
  }

  const { reagentId, notes, quantity } = parseBodyResult.data;

  const requester_id_fk = request.user.user_id;

  const newOrderId = await response.locals.db
    .insertInto("orders")
    .values({
      reagent_id_fk: reagentId,
      requester_id_fk,
      status: OrderStatusEnum.Requested,
      notes,
      quantity,
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  const emailDetails = await response.locals.db
    .with("requester_details", (eb) =>
      eb
        .selectFrom("users")
        .where("users.id", "=", requester_id_fk)
        .select(["users.first_name", "users.last_name", "users.email"]),
    )
    .with("admin_emails", (eb) =>
      eb
        .selectFrom("reagents")
        .innerJoin(
          "reagent_groups",
          "reagent_groups.reagent_id_fk",
          "reagents.id",
        )
        .innerJoin("groups", "groups.id", "reagent_groups.group_id_fk")
        .innerJoin("users", "users.id", "groups.group_leader_user_id_fk")
        .select((eb) =>
          eb.fn
            .agg<Array<string>>("array_agg", ["users.email"])
            .as("leader_emails"),
        )
        .where("reagents.id", "=", reagentId),
    )
    .selectFrom(["requester_details", "admin_emails"])
    .select((eb) => eb.fn.toJson("requester_details").as("requester_details"))
    .select("admin_emails.leader_emails")
    .select((eb) =>
      jsonObjectFrom(
        eb
          .selectFrom("reagents")
          .select([
            "antigen",
            "reagents.host",
            "reagents.igG_class",
            "reagents.supplier",
            "reagents.url",
            "reagents.product_number",
          ])
          .where("reagents.id", "=", reagentId),
      ).as("reagent_details"),
    )
    // we safely assert this as we otherwise would not have been able to insert
    .$narrowType<{ reagent_details: NotNull }>()
    .executeTakeFirstOrThrow();

  try {
    await sendEmail({
      type: "orderCreated",
      parameters: {
        requesterName: `${emailDetails.requester_details.first_name} ${emailDetails.requester_details.last_name}`,
        requesterEmail: emailDetails.requester_details.email,

        groupLeaderEmails: emailDetails.leader_emails,

        reagentDetails: {
          antigen: emailDetails.reagent_details.antigen,
          host: emailDetails.reagent_details.host,
          igGClass: emailDetails.reagent_details.igG_class,
          productNumber: emailDetails.reagent_details.product_number,
          supplier: emailDetails.reagent_details.supplier,
          productUrl: emailDetails.reagent_details.url,
        },
        quantity,
        notes,
      },
    });
  } catch (error) {
    console.error(
      "Error sending email:",
      (error as { message: string }).message,
    );
  }

  return response.status(200).json({ id: newOrderId.id });
}

export type CreateOrderResponse =
  Parameters<typeof createOrder>[1] extends Response<infer T> ? T : never;
