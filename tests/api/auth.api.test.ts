import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/app';
import { createUser } from '../helpers/factories';
import {
  assertTestDatabase,
  disconnectTestDatabase,
  resetTestDatabase,
} from '../helpers/testDatabase';

describe('Auth API', () => {
  beforeEach(async () => {
    assertTestDatabase();
    await resetTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('logs in a user and sets an HTTP-only refresh-token cookie', async () => {
    const { user, password } = await createUser();

    const response = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).toEqual(expect.any(String));
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
  });

  it('rejects an invalid password', async () => {
    const { user } = await createUser();

    const response = await request(app).post('/api/v1/auth/login').send({
      email: user.email,
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Password did not matched');
  });

  it('rejects malformed login input before reaching the service', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'not-an-email',
      password: 'short',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errorMessages).toEqual(expect.any(Array));
  });
});
