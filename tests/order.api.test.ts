import request from "supertest";
import app from "../src/app";

jest.setTimeout(30000);

describe("Order API - flow", () => {
  it("creates order with voucher and increments usesCount", async () => {
    // create voucher
    const v = await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 10,
      expiresAt: "2026-01-01",
    });
    const code = v.body.code;

    // initial usesCount
    const before = await request(app).get(`/api/v1/vouchers/${code}`);
    expect(before.status).toBe(200);
    const beforeUses = before.body.usesCount ?? 0;

    // create order using code
    const ord = await request(app)
      .post("/api/v1/orders")
      .send({
        userId: "USERX",
        items: [
          { productId: "101", categoryId: "CAT1", quantity: 1, unitPrice: 200 },
        ],
        code,
      });
    expect(ord.status).toBe(201);

    // voucher usesCount should have incremented
    const after = await request(app).get(`/api/v1/vouchers/${code}`);
    expect(after.status).toBe(200);
    expect(after.body.usesCount).toBe(beforeUses + 1);
  });

  it("prevents same code being applied twice in the same order", async () => {
    // create voucher and order, then attempt to re-apply to same orderId
    const v = await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 10,
      expiresAt: "2026-01-01",
    });
    const code = v.body.code;

    // create order with code
    const ord = await request(app)
      .post("/api/v1/orders")
      .send({
        userId: "U2",
        items: [
          { productId: "201", categoryId: "C1", quantity: 1, unitPrice: 100 },
        ],
        code,
      });
    expect(ord.status).toBe(201);
    const orderId = ord.body._id;

    // attempt to apply same code to same order
    const applyRes = await request(app)
      .post("/api/v1/apply")
      .send({
        orderId,
        code,
        items: [
          { productId: "201", categoryId: "C1", quantity: 1, unitPrice: 100 },
        ],
      });
    expect(applyRes.status).toBe(400);
  });

  it("creates order without discount", async () => {
    const res = await request(app)
      .post("/api/v1/orders")
      .send({
        userId: "USER002",
        items: [
          { productId: "10", categoryId: "C1", quantity: 1, unitPrice: 100 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(100);
    expect(res.body.appliedCodes.length).toBe(0);
  });

  it("returns 400 for invalid order body", async () => {
    const res = await request(app).post("/api/v1/orders").send({
      items: "invalid",
    });

    expect(res.status).toBe(400);
  });
});
