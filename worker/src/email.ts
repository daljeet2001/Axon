import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: process.env.BREVO_ENDPOINT,
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USERNAME,
      pass: process.env.BREVO_PASSWORD,
    },
  });

export async function sendEmail(to: string, body: string) {
    await transport.sendMail({
        from: "singhdaljit25126@gmail.com",
        to,
        subject: "Hello from Axon",
        text: body
    })
}