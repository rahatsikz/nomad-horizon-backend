import { NextFunction, Request, Response } from "express";
import { NewsService } from "./news.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const result = await NewsService.createNews(payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "News created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, ["showOnHomepage"]);

    const result = await NewsService.getAllNews(filters);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "News fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await NewsService.getNewsById(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "News fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await NewsService.updateNews(id, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "News updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await NewsService.deleteNews(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "News deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const NewsController = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
