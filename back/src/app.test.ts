import request from "supertest";
import app from "./app";

describe("POST /payment", () => {
  const runTest = async (
    idempotencyKey: string,
    amount: number,
    type: string
  ) => {
    const response = await request(app).post("/payment").send({
      idempotencyKey,
      amount,
      type,
    });
    expect(response.statusCode).toBe(202);
  };

  test("Sending 100 Transactions with Expected 202 Response Codes", async () => {
    for (let i = 1; i <= 100; i++) {
      const idempotencyKey = i.toString();
      const amount = parseFloat((Math.random() * 1000).toFixed(2));
      const type = Math.random() < 0.5 ? "credit" : "debit";

      await runTest(idempotencyKey, amount, type);
    }
  }, 500000);
});
