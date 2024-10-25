import { NextFunction, Request, Response } from "express";
import { NewsService } from "./news.service";
import httpStatus from "http-status";

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

export const NewsController = {
  createNews,
};
