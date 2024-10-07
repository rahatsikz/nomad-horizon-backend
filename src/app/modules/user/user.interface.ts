export type SignUpProps = {
  username: string;
  email: string;
  password: string;
  role?: "customer" | "admin" | "superadmin";
};
