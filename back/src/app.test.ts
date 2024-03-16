import request from "supertest";
import app from "./app";

describe("POST /payments", () => {
  const testData: {
    idempotencyKey: string;
    amount: number;
    type: string;
  }[] = [];

  for (let i = 1; i <= 100; i++) {
    const idempotencyKey = i.toString();
    const amount = parseFloat((Math.random() * 1000).toFixed(2));
    const type = Math.random() < 0.5 ? "credit" : "debit";

    testData.push({ idempotencyKey, amount, type });
  }

  test("should respond with 200 code", async () => {
    const response = await request(app).post("/payments").send(testData);
    expect(response.statusCode).toBe(200);
  }, 500000);
});
