import { NextFunction, Request, Response } from "express";
import { EventService } from "./event.service";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const result = await EventService.createEvent(payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Event created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req.query, ["showOnHomepage"]);
    const result = await EventService.getAllEvents(filters);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Events fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await EventService.getEventById(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Event fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const result = await EventService.updateEvent(id, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Event updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await EventService.deleteEvent(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Event deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const EventController = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
