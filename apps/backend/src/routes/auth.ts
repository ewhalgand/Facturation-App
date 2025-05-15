import { Hono } from "hono";
import signup from "../controllers/signupController.js";
import login from "../controllers/loginController.js";

const authRoute = new Hono();

authRoute.route("/signup", signup);
authRoute.route("/login", login);

export default authRoute;
