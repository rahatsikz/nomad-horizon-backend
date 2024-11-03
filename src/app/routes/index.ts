import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ServiceRoutes } from "../modules/service/service.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { BlogRoutes } from "../modules/blog/blog.route";
import { EventRoutes } from "../modules/event/event.route";
import { NewsRoutes } from "../modules/news/news.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { FeedbackRoutes } from "../modules/feedback/feedback.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/services",
    route: ServiceRoutes,
  },
  {
    path: "/schedules",
    route: ScheduleRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes,
  },
  {
    path: "/events",
    route: EventRoutes,
  },
  {
    path: "/news",
    route: NewsRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/feedbacks",
    route: FeedbackRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
