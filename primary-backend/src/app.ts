
import express, {json, urlencoded} from "express";
import { RegisterRoutes } from "./routes/routes";
// import { Response as ExResponse, Request as ExRequest } from "express";
// import swaggerUi from "swagger-ui-express";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

export const app = express();

// Use body parser to read sent json payloads
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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);