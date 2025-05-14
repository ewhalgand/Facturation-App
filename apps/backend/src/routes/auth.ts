import { Hono } from "hono";
import signup from "../controllers/signup.js";

const authRoute = new Hono();

authRoute.route("/signup", signup);

export default authRoute;
