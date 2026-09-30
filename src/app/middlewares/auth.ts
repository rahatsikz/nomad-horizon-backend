import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { UserRole } from "../../interface/user";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization?.startsWith("Bearer ")) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const token = authorization.slice("Bearer ".length).trim();
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      const userId = verifiedToken.userId;
      const role = verifiedToken.role;
      const validRoles: UserRole[] = ["customer", "admin", "superadmin"];

      if (
        typeof userId !== "string" ||
        typeof role !== "string" ||
        !validRoles.includes(role as UserRole)
      ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token payload");
      }

      req.user = {
        ...verifiedToken,
        userId,
        role: role as UserRole,
      };

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
