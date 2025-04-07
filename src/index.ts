import { Elysia } from "elysia";
import { deviceController } from "./controllers/deviceController";

const app = new Elysia()
  .use(deviceController)
  .listen(6032);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);