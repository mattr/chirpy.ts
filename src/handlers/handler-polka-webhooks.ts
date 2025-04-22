import type { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";

export default async function handlerPolkaWebhooks(req: Request, res: Response) {
  type parameters = { event: string, data: { userId: string } };

  const params: parameters = req.body;

  // ignore all other events
  if (params.event !== "user.upgraded") {
    res.status(204).send({});
    return;
  }

  try {
    const result = await upgradeUser(params.data.userId);
    console.log("user upgraded", JSON.stringify(result, null, 2));
    res.status(204).send({});
  } catch (error) {
    console.log("[handlerPolkaWebhooks]", error);
    res.status(404).send({ error });
  }
}
