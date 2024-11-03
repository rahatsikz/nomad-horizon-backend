import express from "express";
import { FeedbackController } from "./feedback.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FeedbackValidation } from "./feedback.validation";

const router = express.Router();

router.post(
  "/create",
  auth("customer"),
  validateRequest(FeedbackValidation.create),
  FeedbackController.createFeedback
);

router.get(
  "/",
  auth("admin", "superadmin"),
  FeedbackController.getAllFeedbacks
);

export const FeedbackRoutes = router;
