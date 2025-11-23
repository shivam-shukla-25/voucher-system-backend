import request from "supertest";
import app from "../src/app";

jest.setTimeout(30000);

describe("Promotion API", () => {
  it("creates a promotion with eligible products and categories", async () => {
    const res = await request(app)
      .post("/api/v1/promotions")
      .send({
        discountType: "fixed",
        discountValue: 100,
        expiresAt: "2026-01-01",
        eligibleProductIds: ["P-1", "P-2"],
        eligibleCategoryIds: ["C-1"],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("code");
    expect(Array.isArray(res.body.eligibleProductIds)).toBe(true);
  });

  it("returns promotions list (array)", async () => {
    const res = await request(app).get("/api/v1/promotions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
