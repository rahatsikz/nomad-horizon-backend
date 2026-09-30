import bcrypt from 'bcrypt';
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

describe('User API', () => {
  beforeEach(async () => {
    assertTestDatabase();
    await resetTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('creates a customer with a hashed password and does not return the password', async () => {
    const password = 'password123';
    const payload = {
      username: 'new-customer',
      email: 'new-customer@example.com',
      password,
    };

    const response = await request(app).post('/api/v1/users/signup').send(payload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.password).toBeUndefined();

    const savedUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    expect(savedUser).not.toBeNull();
    expect(savedUser?.password).not.toBe(password);
    await expect(bcrypt.compare(password, savedUser?.password ?? '')).resolves.toBe(true);
  });

  it('rejects a duplicate email', async () => {
    const { user } = await createUser({ email: 'duplicate@example.com' });

    const response = await request(app).post('/api/v1/users/signup').send({
      username: 'another-user',
      email: user.email,
      password: 'password123',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('A record with the provided values already exists.');
  });

  it('allows a customer to update their own profile', async () => {
    const customer = await createUser();
    const token = createAccessToken(customer.user);

    const response = await request(app)
      .patch(`/api/v1/users/${customer.user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'updated-customer' });

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('updated-customer');
  });

  it('rejects a customer updating another user', async () => {
    const customer = await createUser();
    const otherCustomer = await createUser();
    const token = createAccessToken(customer.user);

    const response = await request(app)
      .patch(`/api/v1/users/${otherCustomer.user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'should-not-change' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden');
  });

  it('allows an admin to list customers but rejects an unauthenticated request', async () => {
    const unauthenticatedResponse = await request(app).get('/api/v1/users');
    expect(unauthenticatedResponse.status).toBe(401);

    const admin = await createUser({ role: Role.admin });
    await createUser({ role: Role.customer });
    const token = createAccessToken(admin.user);

    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].password).toBeUndefined();
  });

  it('allows only a superadmin to create an admin', async () => {
    const admin = await createUser({ role: Role.admin });
    const adminToken = createAccessToken(admin.user);

    const forbiddenResponse = await request(app)
      .post('/api/v1/users/create-admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'blocked-admin',
        email: 'blocked-admin@example.com',
        password: 'password123',
      });

    expect(forbiddenResponse.status).toBe(403);

    const superadmin = await createUser({ role: Role.superadmin });
    const superadminToken = createAccessToken(superadmin.user);
    const response = await request(app)
      .post('/api/v1/users/create-admin')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        username: 'created-admin',
        email: 'created-admin@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.role).toBe('admin');
  });
});
