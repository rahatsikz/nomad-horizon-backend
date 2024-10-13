import express from "express";
import { ScheduleController } from "./schedule.controller";
const router = express.Router();

router.get("/", ScheduleController.getSchedulesOfAvailablity);

export const ScheduleRoutes = router;
