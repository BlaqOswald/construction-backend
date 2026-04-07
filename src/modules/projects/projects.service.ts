import { Project } from "./projects.entity";

let projects: any[] = [];

export const createProject = (data: any) => {
  const project = {
    id: Date.now().toString(),
    name: data.name,
    type: data.type,
    location: data.location,
    supervisor_id: data.supervisor_id,
    locked: false,
    created_at: new Date(),
  };

  projects.push(project);
  return project;
};

export const getProjects = () => projects;

export const lockProject = (id: string) => {
  const p = projects.find((p) => p.id === id);
  if (p) p.locked = true;
  return p;
};
export const getProject = async (id: string) => {
  const project = projects.find((p: any) => p.id === id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};
