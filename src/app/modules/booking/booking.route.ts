import express from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidation } from "./booking.validation";

const router = express.Router();

router.post(
  "/create",
  auth("customer"),
  validateRequest(BookingValidation.create),
  BookingController.createBooking
);

export const BookingRoutes = router;
