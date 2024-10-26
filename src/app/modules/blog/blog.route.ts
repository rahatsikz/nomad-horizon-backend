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

router.get("/", BlogController.getAllBlogs);

router.get("/:id", BlogController.getBlogById);

router.patch(
  "/:id",
  auth("admin"),
  validateRequest(BlogValidation.update),
  BlogController.updateBlog
);

router.delete("/:id", auth("admin"), BlogController.deleteBlog);

export const BlogRoutes = router;
