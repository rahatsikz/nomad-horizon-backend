import { NextFunction, Request, Response } from "express";
import { BookingService } from "./booking.service";
import httpStatus from "http-status";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const userId = req.user?.userId;

    const result = await BookingService.createBooking(payload, userId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const customerSpecificBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const result = await BookingService.customerSpecificBookings(userId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Customer Bookings fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const bookingId = req.params.id;
    const result = await BookingService.cancelBooking(bookingId, userId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking cancelled successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const BookingController = {
  createBooking,
  customerSpecificBookings,
  cancelBooking,
};
