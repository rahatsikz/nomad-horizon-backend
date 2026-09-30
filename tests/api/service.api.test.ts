import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { Role } from '@prisma/client';
import app from '../../src/app';
import { createAccessToken, createUser } from '../helpers/factories';
import {
  assertTestDatabase,
  disconnectTestDatabase,
  prisma,
  resetTestDatabase,
} from '../helpers/testDatabase';

const servicePayload = {
  serviceName: 'Coworking setup',
  content: 'A practical coworking setup consultation',
  image: 'https://example.com/coworking.jpg',
  price: 150,
  category: 'technical',
  status: 'available',
  schedule: [
    {
      startTime: '09:00',
      endTime: '12:00',
      eachSessionDuration: 60,
      daysOfWeek: 'Monday',
    },
  ],
};

describe('Service API', () => {
  beforeEach(async () => {
    assertTestDatabase();
    await resetTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('allows public service listing', async () => {
    const response = await request(app).get('/api/v1/services');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        meta: expect.any(Object),
        data: expect.any(Array),
      }),
    );
  });

  it('rejects service creation for non-admin users', async () => {
    const customer = await createUser({ role: Role.customer });
    const token = createAccessToken(customer.user);

    const response = await request(app)
      .post('/api/v1/services/create')
      .set('Authorization', `Bearer ${token}`)
      .send(servicePayload);

    expect(response.status).toBe(403);
  });

  it('creates a service and its schedule for an admin', async () => {
    const admin = await createUser({ role: Role.admin });
    const token = createAccessToken(admin.user);

    const response = await request(app)
      .post('/api/v1/services/create')
      .set('Authorization', `Bearer ${token}`)
      .send(servicePayload);

    expect(response.status).toBe(200);
    expect(response.body.data.serviceName).toBe(servicePayload.serviceName);
    await expect(prisma.schedule.count()).resolves.toBe(1);
  });

  it('rolls back service creation when a schedule is invalid', async () => {
    const admin = await createUser({ role: Role.admin });
    const token = createAccessToken(admin.user);

    const response = await request(app)
      .post('/api/v1/services/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...servicePayload,
        schedule: [
          {
            ...servicePayload.schedule[0],
            endTime: '09:15',
          },
        ],
      });

    expect(response.status).toBe(400);
    await expect(prisma.service.count()).resolves.toBe(0);
    await expect(prisma.schedule.count()).resolves.toBe(0);
  });
});
