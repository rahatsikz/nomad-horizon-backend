import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth("admin", "superadmin", "customer"),
  NotificationController.getNotificationsByID
);

export const NotificationRoutes = router;
