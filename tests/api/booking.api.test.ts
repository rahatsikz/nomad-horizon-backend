import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { BookingStatus, Role } from '@prisma/client';
import app from '../../src/app';
import { createAccessToken, createBooking, createService, createUser } from '../helpers/factories';
import {
  assertTestDatabase,
  disconnectTestDatabase,
  prisma,
  resetTestDatabase,
} from '../helpers/testDatabase';

describe('Booking API authorization and ownership', () => {
  beforeEach(async () => {
    assertTestDatabase();
    await resetTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('rejects unauthenticated booking creation', async () => {
    const response = await request(app).post('/api/v1/bookings/create').send({});

    expect(response.status).toBe(401);
  });

  it("does not allow a customer to cancel another customer's booking", async () => {
    const owner = await createUser();
    const otherCustomer = await createUser();
    const service = await createService();
    const booking = await createBooking(owner.user.id, service.id);
    const token = createAccessToken(otherCustomer.user);

    const response = await request(app)
      .patch(`/api/v1/bookings/cancel-booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Booking not found');
    await expect(prisma.booking.findUnique({ where: { id: booking.id } })).resolves.toMatchObject({
      bookingStatus: BookingStatus.processing,
    });
  });

  it('does not allow a customer to access admin booking lists', async () => {
    const customer = await createUser({ role: Role.customer });
    const token = createAccessToken(customer.user);

    const response = await request(app)
      .get('/api/v1/bookings/all-bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
