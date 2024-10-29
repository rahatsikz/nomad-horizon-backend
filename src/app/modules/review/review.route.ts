import express from "express";
import { ReviewController } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

router.post(
  "/create",
  auth("customer"),
  validateRequest(ReviewValidation.create),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);

export const ReviewRoutes = router;
