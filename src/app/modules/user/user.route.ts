import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.create),
  UserController.createUser
);

router.get("/:id", UserController.getSingleUserById);

export const UserRoutes = router;
