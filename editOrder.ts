import { Request, Response } from "express";
import { z } from "zod";

import { OrderStatusEnum } from "../../database/database";
import { isId } from "../ensureLoggedIn";

export const zEditOrder = z.object({
  status: z.nativeEnum(OrderStatusEnum).optional(),
  notes: z.string().optional(),
});

export async function editOrder(request: Request, response: Response) {
  const { id } = request.params;

  const isIdValid = isId.safeParse(id);

  if (!isIdValid.success) {
    return response.status(400).json({
      reason: "invalidParams",
      message: `Invalid ID, got ${id}`,
    });
  }

  const parseBodyResult = zEditOrder.safeParse(request.body);

  if (!parseBodyResult.success) {
    for (const [k, v] of Object.entries(zEditOrder.shape)) {
      if (!v.safeParse(request.body[k]).success) {
        return response.status(400).json({
          reason: "invalidParams",
          message: `Invalid field ${k} in body`,
        });
      }
    }
    return response.status(400).json({
      reason: "invalidParams",
    });
  }

  if (Object.keys(parseBodyResult.data ?? {}).length === 0) {
    return response.status(400).json({
      reason: "invalidParams",
      message: "Body contained no items to update",
    });
  }

  const { status, notes } = parseBodyResult.data;

  await response.locals.db
    .updateTable("orders")
    .set({ status, notes })
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  return response.sendStatus(200);
}
