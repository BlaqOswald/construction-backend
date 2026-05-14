export interface User {
  id: string;
  name: string;
  email: string;

  role: "admin" | "manager" | "client";

  password?: string | null;
  tempPassword?: string | null;

  mustSetPassword: boolean;

  projectIds: string[];
}