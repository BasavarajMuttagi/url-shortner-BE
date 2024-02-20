import express from "express";
import { LoginUser, RegisterUser } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validators/user.validator";
const AuthRouter = express.Router();

AuthRouter.post("/login", validate(userLoginSchema), LoginUser);
AuthRouter.post("/register", validate(userRegistrationSchema), RegisterUser);

export { AuthRouter };
