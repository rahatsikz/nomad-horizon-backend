import { Role, User } from "@prisma/client";
import config from "../../../config";
import {
  excludeFromList,
  excludeFromObject,
} from "../../../shared/excludeFrom";
import prisma from "../../../shared/prisma";
import { SignUpProps } from "./user.interface";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";

const createUser = async (payload: SignUpProps) => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_round)
  );

  const result = await prisma.user.create({
    data: payload,
  });

  const resultWithoutPassword = excludeFromObject(result, ["password"]);

  return resultWithoutPassword;
};

const createAdmin = async (payload: SignUpProps) => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_round)
  );

  const result = await prisma.user.create({
    data: {
      ...payload,
      role: Role.admin,
    },
  });

  const resultWithoutPassword = excludeFromObject(result, ["password"]);

  return resultWithoutPassword;
};

const getSingleUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (result) return excludeFromObject(result, ["password"]);

  // return resultWithoutPassword;
};

const getAllCustomers = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: Role.customer,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (result) return excludeFromList(result, ["password"]);
};

const getAllAdmins = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: Role.admin,
    },
  });
  if (result) return excludeFromList(result, ["password"]);
};

const updateUser = async (
  id: string,
  payload: Partial<User>,
  user: {
    userId: string;
    role: Role;
  }
) => {
  if (user.role !== Role.admin && user.userId !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  if (result) return excludeFromObject(result, ["password"]);
};

// !may update it later
const deleteUser = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  if (result) return excludeFromObject(result, ["password"]);
};

const updateProfile = async (userId: string, payload: Partial<User>) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...payload,
    },
  });
  if (result) return excludeFromObject(result, ["password"]);
};

export const UserService = {
  createUser,
  getSingleUserById,
  getAllCustomers,
  updateUser,
  deleteUser,
  getAllAdmins,
  createAdmin,
  updateProfile,
};
