export interface Project {
  id: string;

  name: string;
  type: string;
  location: string;

  supervisor_id: string;

  status: "active" | "completed" | "pending";

  locked: boolean; // ONLY admin can change after true

  created_at: Date;
}
