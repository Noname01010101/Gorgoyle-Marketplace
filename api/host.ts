import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./src/server/serverController";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("working");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
