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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Delete all records first
        yield prismaClient.availableAction.deleteMany({});
        yield prismaClient.availableTrigger.deleteMany({});
        // Seed available triggers
        yield prismaClient.availableTrigger.upsert({
            where: { id: "webhook" },
            update: {},
            create: {
                id: "webhook",
                name: "Webhook",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIovxkR9l-OlwpjTXV1B4YNh0W_s618ijxAQ&s"
            }
        });
        // Seed available actions
        yield prismaClient.availableAction.upsert({
            where: { id: "send-sol" },
            update: {},
            create: {
                id: "send-sol",
                name: "Send Solana",
                image: "https://www.svgrepo.com/show/470684/solana.svg"
            }
        });
        yield prismaClient.availableAction.upsert({
            where: { id: "email" },
            update: {},
            create: {
                id: "email",
                name: "Send Email",
                image: "https://static.vecteezy.com/system/resources/previews/022/613/021/non_2x/google-mail-gmail-icon-logo-symbol-free-png.png"
            }
        });
    });
}
main()
    .then(() => {
    console.log("Seeding complete");
    prismaClient.$disconnect();
})
    .catch((e) => {
    console.error("Seeding error:", e);
    prismaClient.$disconnect();
    process.exit(1);
});
