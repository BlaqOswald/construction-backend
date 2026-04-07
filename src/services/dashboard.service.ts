import { pool } from "../db";

export const getProjectDashboard = async (
  projectId: string,
  userId: string
) => {
  // 1. Project check
  const projectResult = await pool.query(
    `SELECT * FROM project WHERE id = $1 AND user_id = $2`,
    [projectId, userId]
  );

  const project = projectResult.rows[0];

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  // ---------------------------
  // 2. FAST SQL METRICS (NO JS LOOPS)
  // ---------------------------

  const activityStats = await pool.query(
    `
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed,
      COALESCE(SUM(cost), 0) AS total_cost
    FROM activity
    WHERE project_id = $1
    `,
    [projectId]
  );

  const taskStats = await pool.query(
    `
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed
    FROM task
    WHERE project_id = $1
    `,
    [projectId]
  );

  const activity = activityStats.rows[0];
  const task = taskStats.rows[0];

  // ---------------------------
  // 3. CONVERT RESULTS
  // ---------------------------

  const totalActivities = Number(activity.total);
  const completedActivities = Number(activity.completed);
  const totalCost = Number(activity.total_cost);

  const totalTasks = Number(task.total);
  const completedTasks = Number(task.completed);

  // ---------------------------
  // 4. PROGRESS CALCULATION
  // ---------------------------

  const activityProgress =
    totalActivities === 0
      ? 0
      : (completedActivities / totalActivities) * 100;

  const taskProgress =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // ---------------------------
  // 5. FINANCIALS
  // ---------------------------

  const budget = Number(project.budget || 0);
  const remainingBudget = budget - totalCost;

  // ---------------------------
  // 6. OVERALL INTELLIGENCE
  // ---------------------------

  const overallProgress = Math.round(
    activityProgress * 0.6 + taskProgress * 0.4
  );

  let health = "EXCELLENT";

  if (remainingBudget < 0) {
    health = "OVER BUDGET";
  } else if (overallProgress < 40 && totalCost > budget * 0.6) {
    health = "RISK";
  } else if (overallProgress < 70) {
    health = "MODERATE";
  }

  // ---------------------------
  // 7. RESPONSE
  // ---------------------------

  return {
    project: project.name,

    budget,
    current_spend: totalCost,
    remaining_budget: remainingBudget,

    total_activities: totalActivities,
    completed_activities: completedActivities,
    activity_progress: Math.round(activityProgress),

    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    task_progress: Math.round(taskProgress),

    overall_progress: overallProgress,
    health,
  };
};
