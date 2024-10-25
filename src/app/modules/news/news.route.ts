import express from "express";
import { NewsController } from "./news.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { NewsValidation } from "./news.validation";

const router = express.Router();

router.post(
  "/create",
  auth("admin"),
  validateRequest(NewsValidation.create),
  NewsController.createNews
);

export const NewsRoutes = router;
