import request from "supertest";
import app from "./server";

describe("POST /payments", () => {
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
    expect(response.statusCode).toBe(200);
  };

  for (let i = 1; i <= 100; i++) {
    test(`should respond with 200 code - Test ${i}`, async () => {
      const idempotencyKey = i.toString();
      const amount = parseFloat((Math.random() * 1000).toFixed(2));
      const type = Math.random() < 0.5 ? "credit" : "debit";

      await runTest(idempotencyKey, amount, type);
    });
  }
});
