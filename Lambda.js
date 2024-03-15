import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "us-east-2",
  apiVersion: "2012-08-10",
});

export const handler = async (event) => {
  const { Records } = event;

  const body = JSON.parse(Records[0].body);

  try {
    const data = await dynamoDB
      .get({
        TableName: "idempotencyKey",
        Key: {
          idempotencyKey: body.idempotencyKey,
        },
      })
      .promise();

    if (data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Duplicated transaction",
        }),
      };
    } else {
      await dynamoDB
        .put({
          TableName: "payments",
          Item: {
            id: Date.now().toString(),
            amount: body.amount,
            type: body.type,
          },
        })
        .promise();

      await dynamoDB
        .put({
          TableName: "idempotencyKey",
          Item: {
            idempotencyKey: body.idempotencyKey,
          },
        })
        .promise();
      return { statusCode: 200, "message:": "Successful transiction" };
    }
  } catch (error) {
    console.error("Error in executing lambda: ", error);
    return { statusCode: 500, "message:": "Error on execution" };
  }
};
