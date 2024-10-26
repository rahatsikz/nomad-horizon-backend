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

router.get("/", NewsController.getAllNews);

router.get("/:id", NewsController.getNewsById);

router.patch(
  "/:id",
  auth("admin"),
  validateRequest(NewsValidation.update),
  NewsController.updateNews
);

router.delete("/:id", auth("admin"), NewsController.deleteNews);

export const NewsRoutes = router;
