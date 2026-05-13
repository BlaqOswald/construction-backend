export type UserRole = "admin" | "manager" | "client";

export interface User {
  id: string;
  name: string;
  email: string;

  role: UserRole;

  password?: string;
  mustSetPassword: boolean;

  projectIds: string[];
}