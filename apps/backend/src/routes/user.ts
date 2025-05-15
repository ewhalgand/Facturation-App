import { Hono } from "hono";
import getUser from "../controllers/userController.js";

const userRoute = new Hono();

userRoute.route("/me", getUser);

export default userRoute;
