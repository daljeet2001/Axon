"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TOPIC_NAME = "axon";
const client = new client_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: [process.env.KAFKA_BROKER_URL],
    ssl: {
        ca: [fs_1.default.readFileSync(path_1.default.resolve(__dirname, './kafka/kaafka-ca.pem'), 'utf-8')],
    },
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafka.producer();
        yield producer.connect();
        while (1) {
            const pendingRows = yield client.zapRunOutbox.findMany({
                where: {},
                take: 10
            });
            console.log(pendingRows);
            producer.send({
                topic: TOPIC_NAME,
                messages: pendingRows.map(r => {
                    return {
                        value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
                    };
                })
            });
            yield client.zapRunOutbox.deleteMany({
                where: {
                    id: {
                        in: pendingRows.map(x => x.id)
                    }
                }
            });
            yield new Promise(r => setTimeout(r, 3000));
        }
    });
}
main();
