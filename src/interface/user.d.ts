import { JwtPayload } from "jsonwebtoken";

export type UserRole = "customer" | "admin" | "superadmin";

export interface AuthenticatedUser extends JwtPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}
