import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { config } from "./credentials";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import fastify from "fastify";
import { z } from "zod";

const queueUrl =
  "https://sqs.us-east-2.amazonaws.com/590184061505/PaymentsQueue";

const app = fastify();

app.post("/payment", async (request, reply) => {
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

    return reply.status(201).send({ message: "Payment requested" });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
});

app.get("/payments", async (_, reply) => {
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

    return reply.status(201).send({ data: formattedItems });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { success: false, data: null };
  }
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
