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

const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ServiceService.getAllServices();
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Services fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await ServiceService.getServiceById(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Service fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ServiceController = {
  createService,
  getAllServices,
  getServiceById,
};
