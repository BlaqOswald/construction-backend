import { pool } from "../db";

export const getProjectDashboard = async (
  projectId: string,
  userId: string
) => {
  // 1️⃣ PROJECT (secure by user)
  const projectResult = await pool.query(
    `SELECT * FROM project WHERE id = $1 AND user_id = $2`,
    [projectId, userId]
  );

  const project = projectResult.rows[0];

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  // 2️⃣ ACTIVITIES
  const activityResult = await pool.query(
    `SELECT * FROM activity WHERE project_id = $1`,
    [projectId]
  );

  const activities = activityResult.rows;

  // 3️⃣ TASKS
  const taskResult = await pool.query(
    `SELECT * FROM task WHERE project_id = $1`,
    [projectId]
  );

  const tasks = taskResult.rows;

  // -------------------------------
  // 📊 ACTIVITY METRICS
  // -------------------------------
  const totalActivities = activities.length;

  const completedActivities = activities.filter(
    (a: any) => a.status === "completed"
  ).length;

  const activityProgress =
    totalActivities === 0
      ? 0
      : (completedActivities / totalActivities) * 100;

  // -------------------------------
  // 📊 TASK METRICS
  // -------------------------------
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t: any) => t.status === "completed"
  ).length;

  const taskProgress =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // -------------------------------
  // 💰 FINANCIALS
  // -------------------------------
  const totalCost = activities.reduce(
    (sum: number, a: any) => sum + Number(a.cost || 0),
    0
  );

  const budget = Number(project.budget || 0);
  const remainingBudget = budget - totalCost;

  // -------------------------------
  // 🧠 OVERALL PROGRESS
  // -------------------------------
  const overallProgress = Math.round(
    (activityProgress * 0.6 + taskProgress * 0.4)
  );

  // -------------------------------
  // 🚦 HEALTH ENGINE
  // -------------------------------
  let health = "EXCELLENT";

  if (remainingBudget < 0) {
    health = "OVER BUDGET";
  } else if (overallProgress < 40 && totalCost > budget * 0.6) {
    health = "RISK";
  } else if (overallProgress < 70) {
    health = "MODERATE";
  }

  // -------------------------------
  // 📦 FINAL RESPONSE
  // -------------------------------
  return {
    project: project.name,

    // financial
    budget,
    current_spend: totalCost,
    remaining_budget: remainingBudget,

    // activities
    total_activities: totalActivities,
    completed_activities: completedActivities,
    activity_progress: Math.round(activityProgress),

    // tasks
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    task_progress: Math.round(taskProgress),

    // intelligence
    overall_progress: overallProgress,
    health,
  };
};
