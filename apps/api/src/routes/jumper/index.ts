import { Regex } from "@hey/data/regex";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getStats from "./getStats";

const app = new Hono();

app.post(
  "/stats",
  zValidator(
    "json",
    z.object({
      address: z.string().regex(Regex.evmAddress),
      post: z.string()
    })
  ),
  getStats
);

export default app;
