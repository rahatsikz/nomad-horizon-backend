import httpStatus from "http-status";
import { ReviewService } from "./review.service";
import { NextFunction, Request, Response } from "express";
import pick from "../../../shared/pick";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const userId = req.user?.userId;
    const result = await ReviewService.createReview(payload, userId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req.query, ["serviceId", "bookingId"]);
    const result = await ReviewService.getAllReviews(filters);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getAllReviews,
};
