import { createTestApp } from "../../appTest";
import { OrderStatusEnum } from "../../database/database";

import { ListOrderResponse } from "./listOrders";

import { createOrder } from "@test/createOrder";
import { listOrders } from "@test/listOrders";
import { createReagent } from "@test/createReagent";
import { setUserRole } from "@test/setUserRole";
import { signup } from "@test/signup";
import { editOrder } from "@test/editOrder";

describe("/order/edit", () => {
  it("should require user auth", async () => {
    const { request, cleanup, dbPool } = await createTestApp();

    const loginRes = await signup(
      dbPool,
      request,
      "joe@aucklanduni.ac.nz",
      "password",
    );
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "user");

    const reagentId = (await createReagent(request, "myReagent", loginRes)).body
      .id as string;
    const orderId = (
      await createOrder(
        request,
        {
          reagentId,
          quantity: 1,
        },
        loginRes,
      )
    ).body.id;

    // demote the user to unverified
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "unverified");

    const unverifiedRes = await editOrder(
      request,
      orderId,
      {
        status: OrderStatusEnum.Arrived,
        notes: "Test notes",
      },
      loginRes,
    );
    expect(unverifiedRes.status).toBe(403);
    expect(unverifiedRes.body.reason).toBe("notEnoughPrivilege");

    // now try, but authenticated and on a real reagent
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "admin");
    const authRes = await editOrder(
      request,
      orderId,
      {
        status: OrderStatusEnum.Arrived,
        notes: "Test notes",
      },
      loginRes,
    );
    expect(authRes.status).toBe(200);

    await cleanup();
  });

  it("should edit the order", async () => {
    const { request, cleanup, dbPool } = await createTestApp();

    const createResponse = await signup(
      dbPool,
      request,
      "joe@aucklanduni.ac.nz",
      "password",
    );
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "user");

    const reagentId1 = (
      await createReagent(request, "myReagent1", createResponse)
    ).body.id as string;

    const reagentId2 = (
      await createReagent(request, "myReagent2", createResponse)
    ).body.id as string;

    const order1 = await createOrder(
      request,
      {
        reagentId: reagentId1,
        quantity: 1,
      },
      createResponse,
    );
    await createOrder(
      request,
      {
        reagentId: reagentId2,
        quantity: 10,
      },
      createResponse,
    );

    await editOrder(
      request,
      order1.body.id,
      {
        status: OrderStatusEnum.Arrived,
        notes: "Test notes",
      },
      createResponse,
    );

    const editedOrders = await listOrders(request, createResponse);

    expect(editedOrders.body.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining<Partial<ListOrderResponse["reagents"][number]>>(
          {
            status: "Arrived",
            notes: "Test notes",
          },
        ),
        expect.objectContaining<Partial<ListOrderResponse["reagents"][number]>>(
          {
            id: expect.any(String),
            reagent_name: expect.any(String),
            requester_name: expect.any(String),
            reagent_url: null,
            date_requested: expect.any(String),
            status: "Requested",
            quantity: expect.any(Number),
            notes: null,
          },
        ),
      ]),
    );

    await cleanup();
  });

  it("should require at least one field", async () => {
    const { request, cleanup, dbPool } = await createTestApp();

    const createResponse = await signup(
      dbPool,
      request,
      "joe@aucklanduni.ac.nz",
      "password",
    );
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "user");

    const reagentId1 = (
      await createReagent(request, "myReagent1", createResponse)
    ).body.id as string;

    const order1 = await createOrder(
      request,
      {
        reagentId: reagentId1,
        quantity: 1,
      },
      createResponse,
    );

    const res = await editOrder(
      request,
      order1.body.id,
      undefined as unknown as {
        status: OrderStatusEnum;
        notes: string;
      },
      createResponse,
    );

    expect(res.status).toBe(400);
    expect(res.body.reason).toEqual("invalidParams");

    // should not have updated
    const updatedOrder = await listOrders(request, createResponse);
    expect(updatedOrder.body.orders).toMatchObject([
      {
        status: "Requested",
        notes: null,
      },
    ]);

    await cleanup();
  });
});
