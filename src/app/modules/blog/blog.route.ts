import express from "express";
import { BlogController } from "./blog.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BlogValidation } from "./blog.validation";

const router = express.Router();

router.post(
  "/create",
  auth("admin"),
  validateRequest(BlogValidation.create),
  BlogController.createBlog
);

export const BlogRoutes = router;
