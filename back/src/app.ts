import express from "express";
import cors from "cors";
import { handlePaymentRequest, handlePaymentRetrieval } from "./handlers.js";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/payments", handlePaymentRequest);
app.get("/payments", handlePaymentRetrieval);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP Server Running on port ${PORT}`);
});

export default app;
