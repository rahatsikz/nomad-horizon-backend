import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.create),
  AuthController.loginUser
);
router.post(
  "/new-access-token",
  validateRequest(AuthValidation.newAccessToken),
  AuthController.getNewAccessToken
);

export const AuthRoutes = router;
