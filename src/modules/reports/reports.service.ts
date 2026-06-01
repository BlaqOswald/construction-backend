import { getByProject as getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

export const getReport = async (projectId: string, month?: string) => {
  // ================= TASKS =================
  const allTasks = await getTasksByProject(projectId);

  const tasks = month
    ? allTasks.filter((t: any) =>
        t.created_at?.toString().startsWith(month)
      )
    : allTasks;

  // ================= MATERIALS =================
  const materialsRes = await pool.query(
    `SELECT m.*, s.name AS supplier_name
     FROM materials m
     LEFT JOIN suppliers s ON s.id = m.supplier_id
     WHERE m.project_id = $1
     ORDER BY m.category, m.name`,
    [projectId]
  );

  // ================= SUBCONTRACTORS =================
  const subRes = await pool.query(
    "SELECT * FROM subcontractors WHERE project_id = $1 ORDER BY name",
    [projectId]
  );

  // ================= SUPPLIERS =================
  const suppliersRes = await pool.query(
    `SELECT
       s.*,
       COALESCE(
         json_agg(
           DISTINCT jsonb_build_object(
             'id', d.id,
             'item_name', d.item_name,
             'quantity', d.quantity,
             'unit_cost', d.unit_cost,
             'total_cost', d.total_cost,
             'invoice_number', d.invoice_number,
             'payment_status', d.payment_status,
             'date_sent', d.date_sent
           )
         ) FILTER (WHERE d.id IS NOT NULL),
         '[]'
       ) AS deliveries,
       COALESCE(
         json_agg(
           DISTINCT jsonb_build_object(
             'id', p.id,
             'amount_paid', p.amount_paid,
             'payment_date', p.payment_date,
             'note', p.note,
             'delivery_id', p.delivery_id
           )
         ) FILTER (WHERE p.id IS NOT NULL),
         '[]'
       ) AS payments
     FROM suppliers s
     LEFT JOIN supplier_deliveries d ON d.supplier_id = s.id
     LEFT JOIN supplier_payments p ON p.supplier_id = s.id
     WHERE s.project_id = $1
     GROUP BY s.id
     ORDER BY s.name`,
    [projectId]
  );

  // ================= PRE-DEVELOPMENT =================
  const preDevRes = await pool.query(
    `SELECT
       c.id AS category_id,
       c.name AS category,
       COALESCE(
         json_agg(
           jsonb_build_object(
             'id', i.id,
             'item_name', i.item_name,
             'amount_paid', i.amount_paid,
             'date_paid', i.date_paid,
             'status', i.status
           ) ORDER BY i.date_paid ASC NULLS LAST
         ) FILTER (WHERE i.id IS NOT NULL),
         '[]'
       ) AS items
     FROM predevelopment_categories c
     LEFT JOIN predevelopment_items i ON i.category_id = c.id
     WHERE c.project_id = $1
     GROUP BY c.id, c.name, c.created_at
     ORDER BY c.created_at`,
    [projectId]
  );

  // ================= SITE OVERHEADS =================
  const overheadsRes = await pool.query(
    `SELECT
       o.id,
       o.category,
       o.item_name,
       o.monthly_amount,
       o.responsible_person,
       o.payment_terms,
       o.notes,
       COALESCE(
         json_agg(
           jsonb_build_object(
             'id', p.id,
             'billing_period', p.billing_period,
             'amount_paid', p.amount_paid,
             'paid_date', p.paid_date,
             'notes', p.notes
           ) ORDER BY p.paid_date ASC NULLS LAST
         ) FILTER (WHERE p.id IS NOT NULL),
         '[]'
       ) AS payment_history
     FROM site_overheads o
     LEFT JOIN site_overhead_payments p ON p.overhead_id = o.id
     WHERE o.project_id = $1
     GROUP BY o.id
     ORDER BY o.category, o.item_name`,
    [projectId]
  );

  const materials = materialsRes.rows;
  const subcontractors = subRes.rows;
  const suppliers = suppliersRes.rows;
  const preDevelopment = preDevRes.rows;
  const overheads = overheadsRes.rows;

  // ================= TASK COSTS =================
  const totalTaskCost = tasks.reduce(
    (sum: number, t: any) => sum + Number(t.total_cost || 0),
    0
  );

  const inHouseCost = tasks
    .filter((t: any) => t.task_type !== "Subcontractor")
    .reduce((sum: number, t: any) => sum + Number(t.total_cost || 0), 0);

  const subcontractorTaskCost = tasks
    .filter((t: any) => t.task_type === "Subcontractor")
    .reduce((sum: number, t: any) => sum + Number(t.total_cost || 0), 0);

  // ================= MATERIAL COSTS =================
  const totalMaterialCost = materials.reduce(
    (sum: number, m: any) => sum + Number(m.total_cost || 0),
    0
  );

  // ================= SUBCONTRACTOR COSTS =================
  const totalSubCost = subcontractors.reduce(
    (sum: number, s: any) => sum + Number(s.total_contract_cost || 0),
    0
  );
  const totalSubPaid = subcontractors.reduce(
    (sum: number, s: any) => sum + Number(s.amount_paid || 0),
    0
  );

  // ================= SUPPLIER TOTALS =================
  const totalSupplied = suppliers.reduce((sum: number, s: any) => {
    const deliveryTotal = (s.deliveries || []).reduce(
      (ds: number, d: any) => ds + Number(d.total_cost || 0),
      0
    );
    return sum + deliveryTotal;
  }, 0);

  const totalSupplierPaid = suppliers.reduce((sum: number, s: any) => {
    const paymentTotal = (s.payments || []).reduce(
      (ps: number, p: any) => ps + Number(p.amount_paid || 0),
      0
    );
    return sum + paymentTotal;
  }, 0);

  const totalSupplierBalance = totalSupplied - totalSupplierPaid;

  // ================= PRE-DEV TOTALS =================
  const totalPreDevCost = preDevelopment.reduce((sum: number, cat: any) => {
    const catTotal = (cat.items || []).reduce(
      (cs: number, i: any) => cs + Number(i.amount_paid || 0),
      0
    );
    return sum + catTotal;
  }, 0);

  // ================= OVERHEAD TOTALS =================
  const totalOverheadPaid = overheads.reduce((sum: number, o: any) => {
    const paid = (o.payment_history || []).reduce(
      (ps: number, p: any) => ps + Number(p.amount_paid || 0),
      0
    );
    return sum + paid;
  }, 0);

  // ================= TASK STATUS =================
  let completed = 0;
  let pending = 0;
  let inProgress = 0;

  tasks.forEach((task: any) => {
    if (task.status === "completed") completed++;
    else if (task.status === "in_progress") inProgress++;
    else pending++;
  });

  const totalTasks = tasks.length;
  const completionRate =
    totalTasks === 0 ? 0 : (completed / totalTasks) * 100;

  // ================= TASK ENRICHMENT =================
  const formattedTasks = tasks.map((task: any) => {
    const startDate = task.start_date ? new Date(task.start_date) : null;
    const endDate = task.end_date ? new Date(task.end_date) : null;

    let daysTaken = 0;
    if (startDate && endDate) {
      daysTaken = Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
    }

    return {
      ...task,
      start_date: task.start_date || null,
      end_date: task.end_date || null,
      daysTaken,
    };
  });

  // ================= BALANCE OWED =================
  const balanceOwed =
    (totalSubCost - totalSubPaid) + totalSupplierBalance;

  // ================= RETURN =================
  return {
    projectId,

    summary: {
      // task summary
      totalTasks,
      completedTasks: completed,
      pendingTasks: pending,
      inProgressTasks: inProgress,
      completionRate: Number(completionRate.toFixed(2)),

      // cost breakdown
      taskCost: totalTaskCost,
      inHouseCost,
      subcontractorTaskCost,
      materialCost: totalMaterialCost,
      subcontractorCost: totalSubCost,
      subcontractorPaid: totalSubPaid,
      subcontractorBalance: totalSubCost - totalSubPaid,
      supplierSupplied: totalSupplied,
      supplierPaid: totalSupplierPaid,
      supplierBalance: totalSupplierBalance,
      preDevCost: totalPreDevCost,
      overheadPaid: totalOverheadPaid,

      // top-level KPIs
      totalProjectCost:
        totalMaterialCost +
        totalSubCost +
        inHouseCost +
        totalPreDevCost +
        totalOverheadPaid,
      balanceOwed,
    },

    tasks: formattedTasks,
    materials,
    subcontractors,
    suppliers,
    preDevelopment,
    overheads,
  };
};
