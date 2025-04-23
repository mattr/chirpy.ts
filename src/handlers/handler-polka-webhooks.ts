import type { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { getAPIKey } from "../utils/auth.js";

export default async function handlerPolkaWebhooks(req: Request, res: Response) {
  type parameters = { event: string, data: { userId: string } };

  const params: parameters = req.body;

  // ignore all other events
  if (params.event !== "user.upgraded") {
    res.status(204).send({});
    return;
  }

  try {
    const apikey = getAPIKey(req);
    if (!apikey || apikey !== process.env.POLKA_KEY) {
      res.status(401).send({ error: "invalid api key" });
      return;
    }

    const result = await upgradeUser(params.data.userId);
    console.log("user upgraded", JSON.stringify(result, null, 2));
    res.status(204).send({});
  } catch (error) {
    console.log("[handlerPolkaWebhooks]", error);
    res.status(401).send({ error });
  }
}
