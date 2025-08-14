
import express, {json, urlencoded} from "express";
import { RegisterRoutes } from "./routes/routes";
import cors from "cors";
import {requestCountMiddleware} from './monitoring/requestCount'
import {activeCountMiddleware} from './monitoring/activeRequests'
import {requestDurationMiddleware} from './monitoring/requestDuration'
import client from "prom-client";




import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

export const app = express();
app.use(cors());       // enable CORS for all origins


app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use(requestCountMiddleware);
app.use(activeCountMiddleware)
app.use(requestDurationMiddleware)


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

RegisterRoutes(app);