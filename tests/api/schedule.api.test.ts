import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/app';
import { createBooking, createSchedule, createService } from '../helpers/factories';
import {
  assertTestDatabase,
  disconnectTestDatabase,
  prisma,
  resetTestDatabase,
} from '../helpers/testDatabase';

describe('Schedule API', () => {
  beforeEach(async () => {
    assertTestDatabase();
    await resetTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('rejects availability requests without required query parameters', async () => {
    const response = await request(app).get('/api/v1/schedules');

    expect(response.status).toBe(400);
  });

  it('marks a booked session unavailable', async () => {
    const customer = await prisma.user.create({
      data: {
        username: 'schedule-customer',
        email: 'schedule-customer@example.com',
        password: 'hashed-password',
      },
    });
    const service = await createService();
    const date = new Date('2026-10-05T00:00:00.000Z');
    await createSchedule(service.id);
    await createBooking(customer.id, service.id, undefined, date);

    const response = await request(app)
      .get('/api/v1/schedules')
      .query({ serviceId: service.id, date: date.toISOString() });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sessionStarts: '09:00',
          sessionEnds: '10:00',
          available: false,
        }),
      ]),
    );
  });
});
