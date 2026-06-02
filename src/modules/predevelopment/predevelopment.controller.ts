import { Request, Response } from "express";
import * as service from "./predevelopment.service";



// =============================
// CREATE CATEGORY
// =============================

export const addCategory = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.body.project_id) {
      return res.status(400).json({
        message: "project_id required",
      });
    }

    const result =
      await service.addCategory(req.body);

    return res.status(201).json(result);
  } catch (err) {
    console.error("CATEGORY ADD ERROR:", err);

    return res.status(500).json({
      message: "Failed to add category",
      error:
        err instanceof Error
          ? err.message
          : err,
    });
  }
};



// =============================
// GET CATEGORIES BY PROJECT
// =============================

export const getCategoriesByProject = async (
  req: any,
  res: Response
) => {
  try {
    const projectId = String(req.params.projectId);

    const result =
      await service.getCategoriesByProject(req.user, projectId);

    return res.json(result);
  } catch (err) {
    console.error("CATEGORY FETCH ERROR:", err);

    return res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};



// =============================
// UPDATE CATEGORY
// =============================

export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const result =
      await service.updateCategory(
        id,
        req.body
      );

    return res.json(result);
  } catch (err) {
    console.error(
      "CATEGORY UPDATE ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to update category",
      error: err,
    });
  }
};



// =============================
// DELETE CATEGORY
// =============================

export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const result =
      await service.deleteCategory(id);

    return res.json(result);
  } catch (err) {
    console.error(
      "CATEGORY DELETE ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to delete category",
      error: err,
    });
  }
};



// =============================
// CREATE COST ITEM
// =============================

export const addCostItem = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.body.category_id) {
      return res.status(400).json({
        message: "category_id required",
      });
    }

    const result =
      await service.addCostItem(req.body);

    return res.status(201).json(result);
  } catch (err) {
    console.error(
      "COST ITEM ADD ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to add cost item",
      error:
        err instanceof Error
          ? err.message
          : err,
    });
  }
};



// =============================
// GET ITEMS BY CATEGORY
// =============================

export const getItemsByCategory =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const categoryId = String(
        req.params.categoryId
      );

      const result =
        await service.getItemsByCategory(
          categoryId
        );

      return res.json(result);
    } catch (err) {
      console.error(
        "ITEM FETCH ERROR:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to fetch items",
        error:
          err instanceof Error
            ? err.message
            : err,
      });
    }
  };



// =============================
// UPDATE COST ITEM
// =============================

export const updateCostItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const result =
      await service.updateCostItem(
        id,
        req.body
      );

    return res.json(result);
  } catch (err) {
    console.error(
      "ITEM UPDATE ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to update item",
      error: err,
    });
  }
};



// =============================
// DELETE COST ITEM
// =============================

export const deleteCostItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const result =
      await service.deleteCostItem(id);

    return res.json(result);
  } catch (err) {
    console.error(
      "ITEM DELETE ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to delete item",
      error: err,
    });
  }
};



// =============================
// ADD ATTACHMENT
// =============================

export const addAttachment = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.body.cost_item_id) {
      return res.status(400).json({
        message:
          "cost_item_id required",
      });
    }

    const result =
      await service.addAttachment(
        req.body
      );

    return res.status(201).json(result);
  } catch (err) {
    console.error(
      "ATTACHMENT ADD ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to add attachment",
      error:
        err instanceof Error
          ? err.message
          : err,
    });
  }
};



// =============================
// GET ATTACHMENTS
// =============================

export const getAttachments = async (
  req: Request,
  res: Response
) => {
  try {
    const costItemId = String(
      req.params.costItemId
    );

    const result =
      await service.getAttachments(
        costItemId
      );

    return res.json(result);
  } catch (err) {
    console.error(
      "ATTACHMENT FETCH ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to fetch attachments",
      error:
        err instanceof Error
          ? err.message
          : err,
      });
  }
};



// =============================
// DELETE ATTACHMENT
// =============================

export const deleteAttachment =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = String(req.params.id);

      const result =
        await service.deleteAttachment(
          id
        );

      return res.json(result);
    } catch (err) {
      console.error(
        "ATTACHMENT DELETE ERROR:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to delete attachment",
        error: err,
      });
    }
  };