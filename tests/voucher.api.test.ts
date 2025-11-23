import request from "supertest";
import app from "../src/app";

jest.setTimeout(30000);

describe("Voucher API - CRUD", () => {
  it("creates a voucher (auto-generated code)", async () => {
    const res = await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 10,
      expiresAt: "2026-01-01",
      totalUsesAllowed: 5,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("code");
    expect(res.body.isActive).toBe(true);
  });

  it("updates a voucher (isActive and discountValue)", async () => {
    const create = await request(app).post("/api/v1/vouchers").send({
      discountType: "fixed",
      discountValue: 50,
      expiresAt: "2026-01-01",
    });
    const code = create.body.code;

    const res = await request(app).put(`/api/v1/vouchers/${code}`).send({
      discountValue: 75,
      isActive: true,
    });
    expect(res.status).toBe(200);
    expect(res.body.discountValue).toBe(75);
  });

  it("soft-deletes a voucher", async () => {
    const create = await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 5,
      expiresAt: "2026-01-01",
    });
    const code = create.body.code;

    const del = await request(app).delete(`/api/v1/vouchers/${code}`);
    expect(del.status).toBe(200);

    const get = await request(app).get(`/api/v1/vouchers/${code}`);
    expect(get.status).toBe(404);
  });
});
