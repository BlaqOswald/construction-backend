// suppliers.controller.ts

import { Request, Response } from "express";

import {
  createSupplierService,
  getSuppliersByProjectService,
  addDeliveryService,
  addPaymentService,
  updateSupplierService,
  deleteSupplierService,
  updateDeliveryService,
  deleteDeliveryService,
  payDeliveryService,
  bulkPaymentService,
} from "./suppliers.service";

// ======================
// CREATE SUPPLIER
// ======================
export const createSupplier = async (
  req: Request,
  res: Response
) => {
  try {
    const supplier =
      await createSupplierService(
        req.body
      );

    res.json(supplier);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Create supplier failed",
    });
  }
};

// ======================
// GET SUPPLIERS BY PROJECT
// ======================
export const getSuppliersByProject = async (req: any, res: Response) => {
  try {
    const projectId = String(req.params.projectId);
    const data = await getSuppliersByProjectService(req.user, projectId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch suppliers failed" });
  }
};

// ======================
// ADD DELIVERY
// ======================
export const addDelivery = async (
  req: Request,
  res: Response
) => {
  try {
    const delivery =
      await addDeliveryService(
        req.body
      );

    res.json(delivery);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Add delivery failed",
    });
  }
};

// ======================
// ADD PAYMENT
// ======================
export const addPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const payment =
      await addPaymentService(
        req.body
      );

    res.json(payment);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Add payment failed",
    });
  }
};

// ======================
// UPDATE SUPPLIER
// ======================
export const updateSupplier =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = String(
        req.params.id
      );

      const supplier =
        await updateSupplierService(
          id,
          req.body
        );

      res.json(supplier);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Update supplier failed",
      });
    }
  };

// ======================
// DELETE SUPPLIER
// ======================
export const deleteSupplier =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = String(
        req.params.id
      );

      const supplier =
        await deleteSupplierService(
          id
        );

      res.json(supplier);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Delete supplier failed",
      });
    }
  };

// ======================
// UPDATE DELIVERY
// ======================
export const updateDelivery =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = String(
        req.params.id
      );

      const result =
        await updateDeliveryService(
          id,
          req.body
        );

      res.json(result);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Update delivery failed",
      });
    }
  };

// ======================
// DELETE DELIVERY
// ======================
export const deleteDelivery =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = String(
        req.params.id
      );

      const result =
        await deleteDeliveryService(
          id
        );

      res.json(result);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Delete delivery failed",
      });
    }
  };

// ======================
// PAY DELIVERY
// ======================
export const payDelivery = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await payDeliveryService(
        req.body
      );

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Payment failed",
    });
  }
};
export const bulkPayment = async (req: Request, res: Response) => {
  try {
    const result = await bulkPaymentService(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Bulk payment failed",
    });
  }
};