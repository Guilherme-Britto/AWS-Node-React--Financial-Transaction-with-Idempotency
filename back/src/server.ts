import express from "express";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { z } from "zod";
import config from "./credentials.ts";

const queueUrl =
  "https://sqs.us-east-2.amazonaws.com/590184061505/PaymentsQueue";

const app = express();

app.use(express.json());

app.post("/payment", async (request, response) => {
  const createPayloadSchema = z.object({
    idempotencyKey: z.string(),
    type: z.enum(["credit", "debit"]),
    amount: z.number(),
  });

  const sqsClient = new SQSClient(config);

  const payload = createPayloadSchema.parse(request.body);

  try {
    const command = new SendMessageCommand({
      MessageBody: JSON.stringify(payload),
      QueueUrl: queueUrl,
    });
    await sqsClient.send(command);

    return response.status(201).json({ message: "Payment requested" });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/payments", async (_, response) => {
  const dbClient = new DynamoDBClient(config);

  const params = {
    TableName: "payments",
  };

  try {
    const { Items = [] } = await dbClient.send(new ScanCommand(params));
    const formattedItems = Items.map((item) => ({
      id: item.id.S,
      type: item.type.S,
      amount: parseFloat(item.amount.N!),
    }));

    return response.status(200).json({ data: formattedItems });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP Server Running on port ${PORT}`);
});

export default app;
