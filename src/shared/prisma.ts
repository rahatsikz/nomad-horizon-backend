import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
  ],
});

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (event) => {
    if (event.duration > 100) {
      console.log({
        durationMs: event.duration,
        query: event.query,
      });
    }
  });
}

export default prisma;
