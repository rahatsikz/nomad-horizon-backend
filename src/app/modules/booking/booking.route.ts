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

router.get(
  "/my-bookings",
  auth("customer"),
  BookingController.customerSpecificBookings
);

router.patch(
  "/cancel-booking/:id",
  auth("customer"),
  BookingController.cancelBooking
);

export const BookingRoutes = router;
