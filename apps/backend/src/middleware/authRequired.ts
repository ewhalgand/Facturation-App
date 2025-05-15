import type { MiddlewareHandler } from "hono";
import { auth } from "../auth/auth.js";

export const authRequired: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession(c.req.raw);

  if (!session) {
    return c.json({ error: "Non autorisé" }, 401);
  }

  c.set("session", session);

  await next();
};
