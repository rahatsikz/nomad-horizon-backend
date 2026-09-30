-- Enforce one active booking per service/date/start-time slot.
-- Cancelled bookings remain stored but release their slot.
CREATE UNIQUE INDEX "bookings_active_slot_unique"
ON "bookings" ("serviceId", "date", "startTime")
WHERE "bookingStatus" <> 'cancelled';
