import { NextFunction, Request, Response } from "express";
import { EventService } from "./event.service";
import httpStatus from "http-status";

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const result = await EventService.createEvent(payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Event created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const EventController = {
  createEvent,
};
