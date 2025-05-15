import { Hono } from "hono";
import { auth } from "../auth/auth.js";
import { prisma } from "../db/client.js";

const login = new Hono();

login.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (user) {
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });
    }

    const res = await auth.api.signInEmail({
      body,
      asResponse: true,
    });

    if (!res.ok) {
      const errData = await res.json();
      return c.json({ error: errData.error.message }, 400);
    }

    const data = await res.json();

    return c.json({ message: "Connexion réussie !", data }, 200);
  } catch (err) {
    if (err instanceof Error) {
      return c.json({ error: err.message }, 500);
    }

    return c.json({ error: "Une erreur inconnue est survenue" }, 500);
  }
});

export default login;
