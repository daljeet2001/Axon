import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function main() {
  // Delete all records first
  await prismaClient.availableAction.deleteMany({});
  await prismaClient.availableTrigger.deleteMany({});

  // Seed available triggers
  await prismaClient.availableTrigger.upsert({
    where: { id: "webhook" },
    update: {},
    create: {
      id: "webhook",
      name: "Webhook",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIovxkR9l-OlwpjTXV1B4YNh0W_s618ijxAQ&s"
    }
  });

  // Seed available actions
  await prismaClient.availableAction.upsert({
    where: { id: "send-sol" },
    update: {},
    create: {
      id: "send-sol",
      name: "Send Solana",
      image: "https://www.svgrepo.com/show/470684/solana.svg"
    }
  });

  await prismaClient.availableAction.upsert({
    where: { id: "email" },
    update: {},
    create: {
      id: "email",
      name: "Send Email",
      image: "https://static.vecteezy.com/system/resources/previews/022/613/021/non_2x/google-mail-gmail-icon-logo-symbol-free-png.png"
    }
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
