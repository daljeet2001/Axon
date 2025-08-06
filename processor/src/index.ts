import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3005;
const TOPIC_NAME = "axon";

const client = new PrismaClient();

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: [process.env.KAFKA_BROKER_URL!],
  ssl: {
    ca: [fs.readFileSync(path.resolve(__dirname, './kafka/kaafka-ca.pem'), 'utf-8')],
  },
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
});


async function main() {
  const producer = kafka.producer();
  await producer.connect();
  console.log('Kafka producer connected');

  while (true) {
    try {
      const pendingRows = await client.zapRunOutbox.findMany({
        where: {},
        take: 10,
      });

      if (pendingRows.length > 0) {
        console.log(`[Processor] Found ${pendingRows.length} pending rows`);

        await producer.send({
          topic: TOPIC_NAME,
          messages: pendingRows.map((r) => ({
            value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 }),
          })),
        });

        await client.zapRunOutbox.deleteMany({
          where: {
            id: {
              in: pendingRows.map((x) => x.id),
            },
          },
        });

        console.log(`[Processor] Processed ${pendingRows.length} rows`);
      }

      await new Promise((r) => setTimeout(r, 3000)); 
    } catch (err) {
      console.error('Error in processor loop:', err);
      await new Promise((r) => setTimeout(r, 5000)); 
    }
  }
}


app.get('/', (req, res) => {
  res.send('Outbox processor is running...');
});

app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
  main(); 
});
