// File: app.ts
import express from "express";
import { z } from "zod";
import config from "./credentials.ts";
import cors from "cors";
import { handlePaymentRequest, handlePaymentRetrieval } from "./handlers.ts";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/payment", handlePaymentRequest);
app.get("/payments", handlePaymentRetrieval);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP Server Running on port ${PORT}`);
});

export default app;
