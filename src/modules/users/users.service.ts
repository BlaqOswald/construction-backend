import { User } from "./users.entity";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

let users: User[] = [];

export const createUser = (data: any) => {
  const user: User = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    role: data.role,

    password: null,
    tempPassword: data.tempPassword || "123456",
    mustSetPassword: true,

    projectIds: data.projectIds || [],
  };

  users.push(user);
  return user;
};

export const getUsers = () => users;

export const setPassword = async (
  email: string,
  password: string
) => {
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  const hashed = await bcrypt.hash(password, 10);

  user.password = hashed;
  user.tempPassword = null;
  user.mustSetPassword = false;

  return {
    message: "Password set successfully",
  };
};