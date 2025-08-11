import express from "express";
import { userRouter } from "./router/UserController";
import { zapRouter } from "./router/ZapController";
import cors from "cors";
import { triggerRouter } from "./router/TriggerController";
import { actionRouter } from "./router/ActionController";

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);

app.listen(8080);
//openspi spec soon