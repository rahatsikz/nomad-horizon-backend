import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ScheduleValidation } from "./schedule.validation";
const router = express.Router();

router.get(
	"/",
	validateRequest(ScheduleValidation.availability),
	ScheduleController.getSchedulesOfAvailablity
);
router.get("/:serviceId", ScheduleController.getSpecificServiceSchedule);

router.patch("/:id", auth("admin"), ScheduleController.updateSchedule);

export const ScheduleRoutes = router;
