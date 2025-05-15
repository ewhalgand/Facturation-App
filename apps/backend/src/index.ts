import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRequired } from "./middleware/authRequired.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/auth", authRoute);

app.use("*", authRequired);
app.route("/api/user", userRoute);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
