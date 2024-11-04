import { NextFunction, Request, Response } from "express";
import { BookingService } from "./booking.service";
import httpStatus from "http-status";
import { BookingStatus } from "@prisma/client";
import pick from "../../../shared/pick";

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

const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const bookingStatus = req.query?.bookingStatus as BookingStatus;
    const filters = pick(req.query, ["bookingStatus"]);
    const paginationOptions = pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await BookingService.getAllBookings(
      filters,
      paginationOptions
    );
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const adjustBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.id;
    const payload = req.body;
    const result = await BookingService.adjustBooking(bookingId, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking adjusted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.id;
    const payload = req.body;
    const result = await BookingService.updateBookingStatus(bookingId, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.id;
    const result = await BookingService.deleteBooking(bookingId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking deleted successfully",
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
  getAllBookings,
  adjustBooking,
  updateBookingStatus,
  deleteBooking,
};
