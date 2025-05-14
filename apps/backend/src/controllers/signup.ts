import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../db/client.js";
import bcrypt from "bcrypt";

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

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      emailVerified: false,
      image: null,
      accounts: {
        create: {
          accountId: email,
          providerId: "local",
          password: hashedPassword,
        },
      },
    },
  });

  return c.json({ message: "Inscription réussie !", data: user });
});

export default signup;
