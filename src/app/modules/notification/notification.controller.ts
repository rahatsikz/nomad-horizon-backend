import { NextFunction, Request, Response } from "express";
import { NotificationService } from "./notification.service";
import httpStatus from "http-status";

const getNotificationsByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const result = await NotificationService.getNotificationsByID(userId);

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Notifications fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const NotificationController = {
  getNotificationsByID,
};
