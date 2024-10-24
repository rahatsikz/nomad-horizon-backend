import { NextFunction, Request, Response } from "express";
import { BlogService } from "./blog.service";
import httpStatus from "http-status";

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const result = await BlogService.createBlog(payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const BlogController = {
  createBlog,
};
