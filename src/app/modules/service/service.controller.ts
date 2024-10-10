import { NextFunction, Request, Response } from "express";
import { ServiceService } from "./service.service";
import httpStatus from "http-status";

const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const result = await ServiceService.createService(payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Service created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ServiceController = {
  createService,
};
