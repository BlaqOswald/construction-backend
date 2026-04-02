import { pool } from "../db";

// --------------------------------------------------
// CREATE ACTIVITY + AUTO UPDATE PROJECT SPEND
// --------------------------------------------------
export const createActivity = async (data: {
  name: string;
  project_id: string;
}) => {
  const result = await pool.query(
    `INSERT INTO activity (name, project_id)
     VALUES ($1, $2)
     RETURNING *`,
    [data.name, data.project_id]
  );

  // 🔥 update project spend AFTER insert
  await updateProjectSpend(data.project_id);

  return result.rows[0];
};

// --------------------------------------------------
// GET ALL ACTIVITIES (WITH PROJECT NAME)
// --------------------------------------------------
export const getActivities = async () => {
  const result = await pool.query(`
    SELECT
      activity.id,
      activity.name,
      activity.status,
      project.name AS project_name
    FROM activity
    JOIN project ON activity.project_id = project.id
  `);

  return result.rows;
};

// --------------------------------------------------
// GET ACTIVITIES BY PROJECT
// --------------------------------------------------
export const getActivitiesByProject = async (project_id: string) => {
  const result = await pool.query(
    `
    SELECT
      activity.id,
      activity.name,
      activity.status,
      project.name AS project_name
    FROM activity
    JOIN project ON activity.project_id = project.id
    WHERE activity.project_id = $1
    `,
    [project_id]
  );

  return result.rows;
};

// --------------------------------------------------
// UPDATE ACTIVITY STATUS
// --------------------------------------------------
export const updateActivityStatus = async (
  id: string,
  status: string
) => {
  const result = await pool.query(
    `UPDATE activity
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};

// --------------------------------------------------
// 🔥 AUTO UPDATE PROJECT SPEND
// --------------------------------------------------
export const updateProjectSpend = async (projectId: string) => {
  const result = await pool.query(
    `
    UPDATE project
    SET current_spend = (
      SELECT COALESCE(SUM(cost), 0)
      FROM activity
      WHERE project_id = $1
    )
    WHERE id = $1
    RETURNING *;
    `,
    [projectId]
  );

  return result.rows[0];
};
