import { BookingStatus } from '@prisma/client';
import { z } from 'zod';

const create = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: 'Service id is required',
    }),
    date: z
      .string({
        required_error: 'Date is required',
      })
      .datetime(),
    startTime: z.string({
      required_error: 'Start time is required',
    }),
    endTime: z.string({
      required_error: 'End time is required',
    }),
  }),
});

const getAll = z.object({
  query: z.object({
    bookingStatus: z.nativeEnum(BookingStatus).optional(),
    createdAt: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    sortBy: z.enum(['createdAt', 'date', 'bookingStatus']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

const idParam = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const adjust = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      date: z.string().datetime().optional(),
      startTime: z.string().min(1).optional(),
      endTime: z.string().min(1).optional(),
    })
    .strict(),
});

const updateStatus = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      bookingStatus: z.nativeEnum(BookingStatus),
    })
    .strict(),
});

export const BookingValidation = {
  create,
  getAll,
  idParam,
  adjust,
  updateStatus,
};
