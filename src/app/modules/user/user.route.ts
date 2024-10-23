import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.create),
  UserController.createUser
);

router.get("/:id", UserController.getSingleUserById);

router.get("/", auth("admin"), UserController.getAllCustomers);

router.patch(
  "/:id",
  auth("admin", "customer"),
  validateRequest(UserValidation.update),
  UserController.updateUser
);

router.delete("/:id", auth("admin"), UserController.deleteUser);

export const UserRoutes = router;
