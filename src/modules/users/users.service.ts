import { User } from "./users.entity";

let users: User[] = [];

export const createUser = (data: Partial<User>) => {
  const user: User = {
    id: Date.now().toString(),
    name: data.name!,
    email: data.email!,
    role: data.role || "supervisor",
  };

  users.push(user);
  return user;
};

export const getUsers = () => users;
