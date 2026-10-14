import { randomUUID } from "crypto";

import { createTestApp } from "../../appTest";

import { createOrder } from "@test/createOrder";
import { createReagent } from "@test/createReagent";
import { setUserRole } from "@test/setUserRole";
import { signup } from "@test/signup";

describe("/order/create", () => {
  it("should require user auth", async () => {
    const { request, cleanup, dbPool } = await createTestApp();

    const loginResp = await signup(
      dbPool,
      request,
      "joe@aucklanduni.ac.nz",
      "password",
    );

    const res = await createOrder(
      request,
      {
        reagentId: randomUUID(),
        quantity: 1,
      },
      loginResp,
    );
    expect(res.status).toBe(403);
    expect(res.body.reason).toBe("notEnoughPrivilege");

    // try again, this time as a user
    // and on a real reagent
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "user");

    const reagentId = (await createReagent(request, "myReagent", loginResp))
      .body.id as string;

    const orderRes = await createOrder(
      request,
      {
        reagentId: reagentId,
        quantity: 1,
      },
      loginResp,
    );
    expect(orderRes.status).toBe(200);

    await cleanup();
  });

  it("should require fields", async () => {
    const { request, cleanup, dbPool } = await createTestApp();

    const loginRes = await signup(
      dbPool,
      request,
      "joe@aucklanduni.ac.nz",
      "password",
    );
    await setUserRole(dbPool, "joe@aucklanduni.ac.nz", "user");

    const res = await createOrder(
      request,
      undefined as unknown as {
        requester_id_fk: string;
        reagentId: string;
        quantity: number;
      },
      loginRes,
    );
    expect(res.status).toBe(400);
    expect(res.body.reason).toBe("invalidParams");

    await cleanup();
  });
});
