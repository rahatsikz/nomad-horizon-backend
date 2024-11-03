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

router.post(
  "/create-admin",
  auth("superadmin"),
  validateRequest(UserValidation.create),
  UserController.createAdmin
);

router.get("/admins", auth("superadmin"), UserController.getAllAdmins);

router.get("/:id", UserController.getSingleUserById);
router.get("/", auth("admin"), UserController.getAllCustomers);

router.patch(
  "/update-profile",
  auth("customer", "admin", "superadmin"),
  validateRequest(UserValidation.update),
  UserController.updateProfile
);

router.patch(
  "/:id",
  auth("admin", "customer"),
  validateRequest(UserValidation.update),
  UserController.updateUser
);

router.delete("/:id", auth("admin", "superadmin"), UserController.deleteUser);

export const UserRoutes = router;
