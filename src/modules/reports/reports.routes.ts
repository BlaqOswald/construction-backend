import { Router } from "express";
import { getReport } from "./reports.service";

const router = Router();

router.get("/:projectId", async (req, res) => {
  try {
    const result = await getReport(req.params.projectId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
});

export default router;
