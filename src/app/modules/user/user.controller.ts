import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const result = await UserService.createUser(payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await UserService.getSingleUserById(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserService.getAllCustomers();
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Customers fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserService.getAllAdmins();
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Admins fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const user = req.user as any;
    const result = await UserService.updateUser(id, payload, user);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const result = await UserService.createAdmin(payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const payload = req.body;
    const result = await UserService.updateProfile(userId, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getSingleUserById,
  getAllCustomers,
  updateUser,
  deleteUser,
  getAllAdmins,
  createAdmin,
  updateProfile,
};
