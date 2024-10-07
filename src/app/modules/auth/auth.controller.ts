import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import config from "../../../config";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...payload } = req.body;
    const result = await AuthService.loginUser(payload);

    const { refreshToken } = result;

    const cookieOption = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOption);

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getNewAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await AuthService.getNewAccessToken(refreshToken);

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Access Token Generated Successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  loginUser,
  getNewAccessToken,
};
