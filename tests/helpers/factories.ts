import bcrypt from 'bcrypt';
import { BookingStatus, Role, ServiceCategory, Status } from '@prisma/client';
import { jwtHelpers } from '../../src/helpers/jwtHelpers';
import config from '../../src/config';
import { prisma } from './testDatabase';

let sequence = 0;

const uniqueValue = (prefix: string) => {
  sequence += 1;
  return `${prefix}-${Date.now()}-${sequence}`;
};

export const createUser = async (overrides: { role?: Role; email?: string } = {}) => {
  const password = 'password123';
  const user = await prisma.user.create({
    data: {
      username: uniqueValue('user'),
      email: overrides.email ?? `${uniqueValue('user')}@example.com`,
      password: await bcrypt.hash(password, 4),
      role: overrides.role ?? Role.customer,
    },
  });

  return { user, password };
};

export const createAccessToken = (user: { id: string; role: Role }) =>
  jwtHelpers.createToken(
    { userId: user.id, role: user.role },
    config.jwt.secret as string,
    config.jwt.expires_in as string,
  );

export const createService = async () =>
  prisma.service.create({
    data: {
      serviceName: uniqueValue('service'),
      content: 'Test service content',
      image: 'https://example.com/service.jpg',
      status: Status.available,
      price: 100,
      category: ServiceCategory.technical,
    },
  });

export const createSchedule = async (serviceId: string) =>
  prisma.schedule.create({
    data: {
      serviceId,
      startTime: '09:00',
      endTime: '12:00',
      eachSessionDuration: 60,
      daysOfWeek: 'Monday',
    },
  });

export const createBooking = async (
  userId: string,
  serviceId: string,
  status = BookingStatus.processing,
  date = new Date('2026-10-01T00:00:00.000Z'),
) =>
  prisma.booking.create({
    data: {
      userId,
      serviceId,
      date,
      startTime: '09:00',
      endTime: '10:00',
      bookingStatus: status,
    },
  });
