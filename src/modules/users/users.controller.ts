import { Request, Response } from "express";
import * as service from "./users.service";

export const createUser = (req: Request, res: Response) => {
  res.json(service.createUser(req.body));
};

export const getUsers = (req: Request, res: Response) => {
  res.json(service.getUsers());
};

export const setPassword = (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(service.setPassword(email, password));
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(service.login(email, password));
};