import { Hono, type Context } from "hono";
import { prisma } from "../db/client.js";
import type { Session } from "better-auth";
import { auth } from "../auth/auth.js";

const userController = new Hono();

userController.delete("/", async (c: Context) => {
  const { session } = (await auth.api.getSession({
    headers: c.req.raw.headers,
  })) as { session: Session };

  if (!session) {
    return c.json({ error: "Non autorisé" }, 401);
  }

  const userId = session.userId;

  if (!userId) {
    return c.json({ error: "Utilisateur non trouvé dans la session" }, 401);
  }

  try {
    await prisma.user.delete({
      where: { id: session.userId },
    });

    return c.json({ message: "Utilisateur supprimé avec succès !" }, 200);
  } catch (err) {
    return c.json({ error: "Erreur lors de la suppression" }, 500);
  }
});

export default userController;
