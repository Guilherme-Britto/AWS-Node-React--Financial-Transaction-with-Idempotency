import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { config } from "./credentials";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import fastify from "fastify";
import { z } from "zod";
console.log("aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", config);

const queueUrl =
  "https://sqs.us-east-2.amazonaws.com/590184061505/PaymentsQueue";

const app = fastify();

app.post("/payment", async (request, reply) => {
  const createPayloadSchema = z.object({
    id: z.string(),
    idempotencyKey: z.string(),
    method: z.string(),
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

    return reply.status(201).send({ message: "Payment sent" });
  } catch (error) {
    console.error(error);
  }
});

app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
});

const getzada = async () => {
  const dbClient = new DynamoDBClient(config);

  const params = {
    TableName: "payments",
  };

  try {
    const { Items = [] } = await dbClient.send(new ScanCommand(params));
    return { success: true, data: Items };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { success: false, data: null };
  }
};

getzada();

// sendMessageToQueue({
//   id: "test2",
//   idempotencyKey: "teste2",
//   method: "",
//   amount: 0.5,
// });
// const sendMessageToQueue = async (payload: {
//   id: string;
//   idempotencyKey: string;
//   method: string;
//   amount: number;
// }) => {};
