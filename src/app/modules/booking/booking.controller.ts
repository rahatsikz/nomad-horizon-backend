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
      message: "Booking created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const BookingController = {
  createBooking,
};
