import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.get("/", ScheduleController.getSchedulesOfAvailablity);
router.get("/:serviceId", ScheduleController.getSpecificServiceSchedule);

router.patch("/:id", auth("admin"), ScheduleController.updateSchedule);

export const ScheduleRoutes = router;
