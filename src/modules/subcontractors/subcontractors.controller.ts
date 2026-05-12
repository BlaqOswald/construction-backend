import * as service from "./subcontractors.service";

export const addSubcontractor = async (req: any, res: any) => {
  try {
    const result = await service.addSubcontractor(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error creating subcontractor" });
  }
};

export const getByProject = async (req: any, res: any) => {
  try {
    const result = await service.getByProject(req.params.projectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcontractors" });
  }
};

/**
 * 🔥 NEW PAYMENT FLOW (INCREMENTAL PAYMENT)
 */
export const addPayment = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const result = await service.updatePayment(id, req.body);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Payment update failed" });
  }
};

export const deleteSub = async (req: any, res: any) => {
  await service.deleteSubcontractor(req.params.id);
  res.json({ message: "Deleted" });
};