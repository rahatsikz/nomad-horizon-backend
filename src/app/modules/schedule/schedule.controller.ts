import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ScheduleService } from "./schedule.service";
import pick from "../../../shared/pick";

const getSchedulesOfAvailablity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryData = pick(req.query, ["serviceId", "date"]);

    const result = await ScheduleService.getSchedulesOfAvailablity(queryData);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedules fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ScheduleController = {
  getSchedulesOfAvailablity,
};
