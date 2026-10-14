import { createTestApp } from "../../appTest";

import { ListOrderResponse } from "./listOrders";

import { createOrder } from "@test/createOrder";
import { listOrders } from "@test/listOrders";
import { createReagent } from "@test/createReagent";
import { setUserRole } from "@test/setUserRole";
import { signup } from "@test/signup";

describe("/order/list", () => {
  it("should require user auth", async () => {
    const { request, cleanup, dbPool } = await createTestApp();

    const loginRes = await signup(
      dbPool,
      request,
      "joe@aucklanduni.ac.nz",
      "password",
    );

    const res = await listOrders(request, loginRes);
    expect(res.status).toBe(403);
    expect(res.body.reason).toBe("notEnoughPrivilege");

    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "user");
    const authRes = await listOrders(request, loginRes);
    expect(authRes.status).toBe(200);

    await cleanup();
  });

  it("should list all orders", async () => {
    const { request, cleanup, dbPool } = await createTestApp();

    const loginRes = await signup(
      dbPool,
      request,
      "joe@aucklanduni.ac.nz",
      "password",
    );
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "user");

    const reagentId1 = (await createReagent(request, "myReagent1", loginRes))
      .body.id as string;

    const reagentId2 = (await createReagent(request, "myReagent2", loginRes))
      .body.id as string;

    const firstOrderId = (
      await createOrder(
        request,
        {
          reagentId: reagentId1,
          quantity: 1,
        },
        loginRes,
      )
    ).body.id;

    const secondOrderId = (
      await createOrder(
        request,
        {
          reagentId: reagentId2,
          quantity: 10,
        },
        loginRes,
      )
    ).body.id;

    const res = await listOrders(request, loginRes);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.orders.length).toBeGreaterThan(0);

    expect(res.body.orders).toEqual(
      expect.arrayContaining<Partial<ListOrderResponse["orders"][number]>>([
        expect.objectContaining({
          id: firstOrderId,
          reagent_name: expect.any(String),
          requester_name: expect.any(String),
          date_requested: expect.any(String),
          reagent_url: null,
          status: expect.any(String),
          quantity: expect.any(Number),
          notes: null,
        }),
        expect.objectContaining({
          id: secondOrderId,
          reagent_name: expect.any(String),
          requester_name: expect.any(String),
          reagent_url: null,
          date_requested: expect.any(String),
          status: expect.any(String),
          quantity: expect.any(Number),
          notes: null,
        }),
      ]),
    );

    await cleanup();
  });
});
