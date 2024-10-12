import express from "express";
import { ServiceController } from "./service.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceValidation } from "./service.validation";

const router = express.Router();

router.post(
  "/create",
  auth("admin"),
  validateRequest(ServiceValidation.create),
  ServiceController.createService
);

router.get("/", ServiceController.getAllServices);

router.get("/:id", ServiceController.getServiceById);

export const ServiceRoutes = router;
