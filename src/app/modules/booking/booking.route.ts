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

router.get("/all-bookings", auth("admin"), BookingController.getAllBookings);

router.patch(
  "/cancel-booking/:id",
  auth("customer"),
  BookingController.cancelBooking
);
router.patch(
  "/adjust-booking/:id",
  auth("admin"),
  BookingController.adjustBooking
);

router.patch(
  "/update-booking-status/:id",
  auth("admin"),
  BookingController.updateBookingStatus
);

router.delete(
  "/delete-booking/:id",
  auth("admin"),
  BookingController.deleteBooking
);

router.get(
  "/bookings-by-interval",
  auth("admin"),
  BookingController.getBookingCountsByInterval
);

export const BookingRoutes = router;
