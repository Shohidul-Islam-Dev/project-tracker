export type Role = 'admin' | 'worker' | 'visitor';

export type OrderStatus = 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
  avatar?: string;
  assignedProjects: string[];
}

export interface ProgressEntry {
  id: string;
  date: string;
  description: string;
  percentage: number;
  updatedBy: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientUserId: string;
  amount: number;
  account: string;
  cms: string;
  orderStatus: OrderStatus;
  information: string;
  progressEntries: ProgressEntry[];
  overallProgress: number;
  createdAt: string;
  updatedAt: string;
  assignedWorkers: string[];
  category: string;
  // New fields
  responsible: string;
  incDate: string;
  percentage: number;
  orderPageUrl: string;
  spreadsheetLink: string;
  assignBy: string;
  deliLastTime: string;
}
