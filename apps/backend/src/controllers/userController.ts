import { Hono, type Context } from "hono";
import { prisma } from "../db/client.js";
import type { Session } from "better-auth";
import { auth } from "../auth/auth.js";

const getUser = new Hono();

getUser.delete("/", async (c: Context) => {
  const { session } = (await auth.api.getSession({
    headers: c.req.raw.headers,
  })) as { session: Session };

  if (!session) {
    return c.json({ error: "Non autorisé" }, 401);
  }

  await prisma.user.delete({
    where: { id: session.userId },
  });

  return c.json({ message: "Utilisateur supprimé avec succès !" }, 200);
});

export default getUser;
