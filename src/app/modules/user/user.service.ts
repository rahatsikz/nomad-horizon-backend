import config from "../../../config";
import { excludeFromObject } from "../../../shared/excludeFrom";
import prisma from "../../../shared/prisma";
import { SignUpProps } from "./user.interface";
import bcrypt from "bcrypt";

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

export const UserService = {
  createUser,
};
