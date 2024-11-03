import { NextFunction, Request, Response } from "express";
import { FeedbackService } from "./feedback.service";
import httpStatus from "http-status";

const createFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    const userId = req.user?.userId;
    const result = await FeedbackService.createFeedback(content, userId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "We received your feedback",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFeedbacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await FeedbackService.getAllFeedbacks();
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Feedbacks retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const FeedbackController = {
  createFeedback,
  getAllFeedbacks,
};
