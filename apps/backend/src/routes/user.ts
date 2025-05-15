import { Hono } from "hono";
import userController from "../controllers/userController.js";

const userRoute = new Hono();

userRoute.route("/me", userController);

export default userRoute;
