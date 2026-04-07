import { Request, Response } from "express";
import * as service from "./users.service";

export const createUser = (req: Request, res: Response) => {
  res.json(service.createUser(req.body));
};

export const getUsers = (req: Request, res: Response) => {
  res.json(service.getUsers());
};
