export const CacheKeys = {
  TASKS_ALL: 'tasks:all',
  TASKS_BY_PROJECT: (projectId: string) => `tasks:project:${projectId}`,
  TASK_BY_ID: (taskId: string) => `tasks:id:${taskId}`,
  PROJECTS_ALL: 'projects:all',
  PROJECT_BY_ID: (projectId: string) => `projects:id:${projectId}`,
};

export const CacheTTLs = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 900,
  VERY_LONG: 3600,
};

export type CacheKeyPattern = 
  | 'tasks:all'
  | 'tasks:project:*'
  | 'tasks:id:*'
  | 'projects:all'
  | 'projects:id:*';
