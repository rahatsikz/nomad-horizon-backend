import express from "express";
import { EventController } from "./event.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { EventValidation } from "./event.validation";

const router = express.Router();

router.post(
  "/create",
  auth("admin"),
  validateRequest(EventValidation.create),
  EventController.createEvent
);

export const EventRoutes = router;
