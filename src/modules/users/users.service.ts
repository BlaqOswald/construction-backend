import { User } from "./users.entity";
import { v4 as uuidv4 } from "uuid";

let users: User[] = [];

export const createUser = (data: any) => {
  const user: User = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    role: data.role,
    password: undefined,
    mustSetPassword: true,
    projectIds: data.projectIds || [],
  };

  users.push(user);
  return user;
};

export const getUsers = () => users;

export const setPassword = (email: string, password: string) => {
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  user.password = password;
  user.mustSetPassword = false;

  return { message: "Password created successfully" };
};

export const login = (email: string, password: string) => {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return user;
};