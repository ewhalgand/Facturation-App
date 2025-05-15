import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/user.js";
import { cors } from "hono/cors";
import { auth } from "./auth/auth.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/user", userRoute);

app.all("/api/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
