import { Request, Response } from "express";
import { sql } from "kysely";

export async function listOrders(request: Request, response: Response) {
  const orders = await response.locals.db
    .selectFrom("orders")
    .innerJoin("users", "users.id", "orders.requester_id_fk")
    .innerJoin("reagents", "reagents.id", "orders.reagent_id_fk")
    .select([
      "orders.id",
      "orders.date_requested",
      "orders.status",
      "orders.notes",
      "orders.quantity",
      sql<string>`CONCAT(users.first_name, ' ', users.last_name)`.as(
        "requester_name",
      ),
      "reagents.antigen as reagent_name",
      "reagents.url as reagent_url",
      "reagents.id as reagent_id",
    ])
    .orderBy("orders.date_requested", "asc")
    .execute();

  // Implement return group leader later

  return response.status(200).json({
    orders,
  });
}

export type ListOrderResponse =
  Parameters<typeof listOrders>[1] extends Response<infer T> ? T : never;
