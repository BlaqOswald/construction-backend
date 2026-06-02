import { Request, Response } from "express";

import {
  addSiteOverhead,
  getByProject,
  updateSiteOverhead,
  deleteSiteOverhead,
  addPayment,
} from "./siteoverheads.service";

// ======================
// SAFE PARAM HELPER
// ======================
const getParam = (param: string | string[] | undefined): string => {
  if (!param) return "";
  return Array.isArray(param) ? param[0] : param;
};

// ======================
// CREATE OVERHEAD
// ======================
export const createOverhead = async (req: Request, res: Response) => {
  try {
    const data = await addSiteOverhead(req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ======================
// GET PROJECT OVERHEADS
// ======================
export const getProjectOverheads = async (req: any, res: Response) => {
  try {
    const projectId = getParam(req.params.projectId);
    const data = await getByProject(req.user, projectId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ======================
// UPDATE OVERHEAD
// ======================
export const updateOverhead = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const data = await updateSiteOverhead(id, req.body);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ======================
// DELETE OVERHEAD
// ======================
export const deleteOverhead = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const data = await deleteSiteOverhead(id);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

// ======================
// ADD PAYMENT HISTORY
// ======================
export const addPaymentHistory = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const data = await addPayment(id, req.body);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};