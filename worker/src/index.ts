import "dotenv/config";
import express from 'express';
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";
import fs from 'fs';
import path from 'path';

const app= express();
const PORT = process.env.PORT || 3006;

const prismaClient = new PrismaClient();
const TOPIC_NAME = "axon"
console.log("broker:", process.env.KAFKA_BROKER_URL);



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
    const consumer = kafka.consumer({ groupId: 'main-worker-2' });
    await consumer.connect();
    const producer =  kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          })
          if (!message.value?.toString()) {
            return;
          }

          const parsedValue = JSON.parse(message.value?.toString());
          const zapRunId = parsedValue.zapRunId;
          const stage = parsedValue.stage;

          const zapRunDetails = await prismaClient.zapRun.findFirst({
            where: {
              id: zapRunId
            },
            include: {
              zap: {
                include: {
                  actions: {
                    include: {
                      type: true
                    }
                  }
                }
              },
            }
          });
          const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

          if (!currentAction) {
            console.log("Current action not found?");
            return;
          }

          const zapRunMetadata = zapRunDetails?.metadata;
          console.log('zaprunmetadata',zapRunMetadata)

          if (currentAction.type.id === "email") {
            const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
            // console.log("body", body);
            const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
            // console.log("to", to);
            console.log(`Sending out email to ${to} body is ${body}`)
            await sendEmail(to, body);
            console.log("sending email")
          }

          if (currentAction.type.id === "send-sol") {

            const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
            const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
            console.log(`Sending out SOL of ${amount} to address ${address}`);
            // await sendSol(address, amount);
            console.log("sending sol")
          }
          
        
          await new Promise(r => setTimeout(r, 500));

          const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1; // 1
          // console.log(lastStage);
          // console.log(stage);
          if (lastStage !== stage) {
            console.log("pushing back to the queue")
            await producer.send({
              topic: TOPIC_NAME,
              messages: [{
                value: JSON.stringify({
                  stage: stage + 1,
                  zapRunId
                })
              }]
            })  
          }

          console.log("processing done");
       
          await consumer.commitOffsets([{
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString() // 5
          }])
        },
      })

}

app.get('/', (req, res) => {
  res.send('Outbox processor is running...');
});

app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
  main(); 
});

