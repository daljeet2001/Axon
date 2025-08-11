
import express, {json, urlencoded} from "express";
import { RegisterRoutes } from "./routes/routes";
// import { Response as ExResponse, Request as ExRequest } from "express";
// import swaggerUi from "swagger-ui-express";
// import cors from "cors";
import cors from "cors";




import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

export const app = express();
app.use(cors());       // enable CORS for all origins

// Use body parser to read sent json payloads
// app.use(cors({
//   origin: "*", // or your live site domain
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
// Swagger UI endpoint
// app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
//   return res.send(
//     swaggerUi.generateHTML(await import("../build/swagger.json"))
//   );
// });
// app.options("*", cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


RegisterRoutes(app);