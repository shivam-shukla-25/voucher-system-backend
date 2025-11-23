import request from "supertest";
import app from "../src/app";

jest.setTimeout(30000);

describe("Apply Service Logic - business rules", () => {
  it("rejects expired voucher", async () => {
    // create expired voucher
    await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 10,
      expiresAt: "2000-01-01",
    });

    const res = await request(app)
      .post("/api/v1/apply")
      .send({
        code: "ANY",
        items: [{ productId: "X", quantity: 1, unitPrice: 100 }],
      });

    expect(res.status).toBe(400);
  });

  it("enforces usage limit", async () => {
    // create voucher with totalUsesAllowed = 1
    const v = await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 10,
      expiresAt: "2026-01-01",
      totalUsesAllowed: 1,
    });

    const code = v.body.code;

    // first apply should succeed
    const first = await request(app)
      .post("/api/v1/orders")
      .send({
        userId: "U1",
        items: [{ productId: "101", quantity: 1, unitPrice: 100 }],
        code,
      });
    expect(first.status).toBe(201);

    // second apply should fail
    const second = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [{ productId: "101", quantity: 1, unitPrice: 100 }],
      });
    expect(second.status).toBe(400);
  });

  it("rejects when minOrderValue not met", async () => {
    const v = await request(app).post("/api/v1/vouchers").send({
      discountType: "fixed",
      discountValue: 10,
      expiresAt: "2026-01-01",
      minOrderValue: 500,
    });

    const code = v.body.code;

    const res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [{ productId: "A", quantity: 1, unitPrice: 100 }],
      });

    expect(res.status).toBe(400);
  });

  it("handles promotion eligibility by product AND category", async () => {
    const p = await request(app)
      .post("/api/v1/promotions")
      .send({
        discountType: "fixed",
        discountValue: 30,
        expiresAt: "2026-01-01",
        eligibleProductIds: ["PROD-1"],
        eligibleCategoryIds: ["CAT-1"],
      });

    const code = p.body.code;

    // Case 1 - Neither matches -> FAIL
    let res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [
          {
            productId: "OTHER",
            categoryId: "OTHER",
            quantity: 1,
            unitPrice: 100,
          },
        ],
      });
    expect(res.status).toBe(400);

    // Case 2 - Only product matches -> FAIL
    res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [
          {
            productId: "PROD-1",
            categoryId: "OTHER",
            quantity: 1,
            unitPrice: 100,
          },
        ],
      });
    expect(res.status).toBe(400);

    // Case 3 - Only category matches -> FAIL
    res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [
          {
            productId: "OTHER",
            categoryId: "CAT-1",
            quantity: 1,
            unitPrice: 100,
          },
        ],
      });
    expect(res.status).toBe(400);

    // Case 4 - BOTH match -> SUCCESS
    res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [
          {
            productId: "PROD-1",
            categoryId: "CAT-1",
            quantity: 1,
            unitPrice: 100,
          },
        ],
      });
    expect(res.status).toBe(200);
  });

  it("applies 50% discount cap", async () => {
    const v = await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 90,
      expiresAt: "2026-01-01",
    });

    const code = v.body.code;

    const res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [{ productId: "1", quantity: 1, unitPrice: 100 }],
      });

    expect(res.status).toBe(200);
    expect(res.body.discount).toBeLessThanOrEqual(50);
  });

  it("applies fixed discount correctly", async () => {
    const p = await request(app)
      .post("/api/v1/promotions")
      .send({
        discountType: "fixed",
        discountValue: 40,
        expiresAt: "2026-01-01",
        eligibleProductIds: ["P1"],
        eligibleCategoryIds: ["C1"],
      });

    const code = p.body.code;

    const res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [
          { productId: "P1", categoryId: "C1", quantity: 1, unitPrice: 100 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.discount).toBe(40);
  });

  it("handles missing maxDiscountAmount safely", async () => {
    const v = await request(app).post("/api/v1/vouchers").send({
      discountType: "percentage",
      discountValue: 20,
      expiresAt: "2026-01-01",
    });

    const code = v.body.code;

    const res = await request(app)
      .post("/api/v1/apply")
      .send({
        code,
        items: [
          { productId: "1", categoryId: "C", quantity: 2, unitPrice: 50 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(80);
  });
});
