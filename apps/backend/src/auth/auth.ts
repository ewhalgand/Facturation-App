import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/client.js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  secret: process.env.AUTH_SECRET,
  trustedOrigins: ["http://localhost:5173"],
  cookies: {
    secure: false,
    sameSite: "lax",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
