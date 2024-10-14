import { BookingStatus } from "@prisma/client";

export interface IBooking {
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  bookingStatus?: BookingStatus;
}
