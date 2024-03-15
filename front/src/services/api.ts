import axios from "axios";

export const api = axios.create({
  baseURL: "https://full-stack-dynamodb-sqs-node-nextjs-1.onrender.com",
  timeout: 10000,
});
