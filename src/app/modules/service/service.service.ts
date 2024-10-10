import prisma from "../../../shared/prisma";

const createService = async (payload: any) => {
  const result = await prisma.service.create({
    data: payload,
  });
  return result;
};

export const ServiceService = {
  createService,
};
