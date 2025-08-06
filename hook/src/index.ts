import express from "express"
import {PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const app = express();
app.use(express.json());

// https://hooks.zapier.com/hooks/catch/17043103/22b8496/

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;

  try {
    await client.$transaction(async tx => {
      const run = await tx.zapRun.create({
        data: {
          zapId,
          metadata: body
        }
      });
      const outbox= await tx.zapRunOutbox.create({
        data: {
          zapRunId: run.id
        }
      });
     
    });
    res.json({ message: "Webhook received" });
  } catch (e) {
    console.error("Transaction failed:", e);
    res.status(500).json({ error: "Transaction failed" });
  }
});


app.listen(3002);