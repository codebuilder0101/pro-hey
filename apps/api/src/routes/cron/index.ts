import { Hono } from "hono";
import secretMiddleware from "src/middlewares/secretMiddleware";
import removeExpiredSubscribers from "./removeExpiredSubscribers";
import syncFollowersStandingToGuild from "./syncFollowersStandingToGuild";
import syncHQScoreAccountsToGuild from "./syncHQScoreAccountsToGuild";
import syncSubscribersToGuild from "./syncSubscribersToGuild";

const app = new Hono();

app.get("/syncSubscribersToGuild", secretMiddleware, syncSubscribersToGuild);
app.get(
  "/syncHQScoreAccountsToGuild",
  secretMiddleware,
  syncHQScoreAccountsToGuild
);
app.get(
  "/syncFollowersStandingToGuild",
  secretMiddleware,
  syncFollowersStandingToGuild
);
app.get(
  "/removeExpiredSubscribers",
  secretMiddleware,
  removeExpiredSubscribers
);

export default app;
