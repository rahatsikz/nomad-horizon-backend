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

router.get("/", EventController.getAllEvents);

router.get("/:id", EventController.getEventById);

router.patch(
  "/:id",
  auth("admin"),
  validateRequest(EventValidation.update),
  EventController.updateEvent
);

router.delete("/:id", auth("admin"), EventController.deleteEvent);

export const EventRoutes = router;
