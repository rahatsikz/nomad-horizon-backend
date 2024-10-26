import { NextFunction, Request, Response } from "express";
import { BlogService } from "./blog.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

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

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, ["showOnHomepage"]);
    const result = await BlogService.getAllBlogs(filters);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Blogs fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await BlogService.getBlogById(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await BlogService.updateBlog(id, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await BlogService.deleteBlog(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
