import { NextFunction, Request, Response } from "express";
import { ServiceService } from "./service.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

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
    const filters = pick(req.query, ["search", "category", "price", "status"]);
    const paginationOptions = pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await ServiceService.getAllServices(
      filters,
      paginationOptions
    );
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

const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await ServiceService.updateService(id, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Service updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await ServiceService.deleteService(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Service deleted successfully",
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
  updateService,
  deleteService,
};
