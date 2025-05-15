import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../db/client.js";
import bcrypt from "bcrypt";
import { auth } from "../auth/auth.js";

const signup = new Hono();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mot de passe trop court"),
  name: z.string().min(2, "Nom requis"),
});

signup.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.format() }, 400);
  }

  const { email, password, name } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return c.json({ error: "Utilisateur déjà existant" }, 400);
  }

  try {
    const res = await auth.api.signUpEmail({
      body: { email, password, name },
      asResponse: true,
    });

    if (!res.ok) {
      const errData = await res.json();
      return c.json({ error: errData.error.message }, 400);
    }

    const data = await res.json();
    return c.json({ message: "Inscription réussie !", data }, 201);
  } catch (err) {
    if (err instanceof Error) {
      return c.json({ error: err.message }, 500);
    }

    return c.json({ error: "Une erreur inconnue est survenue" }, 500);
  }
});

export default signup;
