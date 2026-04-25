import { create } from 'zustand';
import { User, Project, Role, OrderStatus, ProgressEntry } from './types';
import { defaultUsers, defaultProjects } from './data';

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  projects: Project[];
  selectedProjectId: string | null;
  sidebarOpen: boolean;

  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  selectProject: (id: string | null) => void;
  toggleSidebar: () => void;

  // Admin actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progressEntries' | 'overallProgress'>) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (userId: string, role: Role) => void;
  assignProjectToUser: (userId: string, projectId: string) => void;
  removeProjectFromUser: (userId: string, projectId: string) => void;

  // Worker actions
  updateOrderStatus: (projectId: string, status: OrderStatus) => void;
  addProgressEntry: (projectId: string, entry: Omit<ProgressEntry, 'id'>) => void;
  updateProjectDetails: (projectId: string, updates: { information?: string; cms?: string }) => void;

  // Account actions
  updateUserCredentials: (userId: string, updates: { name?: string; username?: string; password?: string }) => boolean;
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultValue;
};

const saveToStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useStore = create<AppState>((set, get) => ({
  currentUser: loadFromStorage<User | null>('currentUser', null),
  users: loadFromStorage<User[]>('users', defaultUsers),
  projects: loadFromStorage<Project[]>('projects', defaultProjects),
  selectedProjectId: null,
  sidebarOpen: true,

  login: (username, password) => {
    const users = get().users;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      set({ currentUser: user });
      saveToStorage('currentUser', user);
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null, selectedProjectId: null });
    localStorage.removeItem('currentUser');
  },

  selectProject: (id) => set({ selectedProjectId: id }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  addProject: (project) => {
    const id = 'p' + Date.now();
    const now = new Date().toISOString().split('T')[0];
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
      progressEntries: [],
      overallProgress: 0,
    };
    const projects = [...get().projects, newProject];
    set({ projects });
    saveToStorage('projects', projects);
  },

  deleteProject: (id) => {
    const projects = get().projects.filter(p => p.id !== id);
    const users = get().users.map(u => ({
      ...u,
      assignedProjects: u.assignedProjects.filter(pid => pid !== id),
    }));
    set({ projects, users, selectedProjectId: get().selectedProjectId === id ? null : get().selectedProjectId });
    saveToStorage('projects', projects);
    saveToStorage('users', users);
  },

  updateProject: (id, updates) => {
    const now = new Date().toISOString().split('T')[0];
    const projects = get().projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: now } : p
    );
    set({ projects });
    saveToStorage('projects', projects);
  },

  addUser: (userData) => {
    const id = 'u' + Date.now();
    const newUser: User = { ...userData, id };
    const users = [...get().users, newUser];
    set({ users });
    saveToStorage('users', users);
  },

  deleteUser: (id) => {
    const users = get().users.filter(u => u.id !== id);
    set({ users });
    saveToStorage('users', users);
  },

  updateUserRole: (userId, role) => {
    const users = get().users.map(u =>
      u.id === userId ? { ...u, role } : u
    );
    set({ users });
    saveToStorage('users', users);
  },

  assignProjectToUser: (userId, projectId) => {
    const users = get().users.map(u =>
      u.id === userId
        ? { ...u, assignedProjects: [...new Set([...u.assignedProjects, projectId])] }
        : u
    );
    set({ users });
    saveToStorage('users', users);
  },

  removeProjectFromUser: (userId, projectId) => {
    const users = get().users.map(u =>
      u.id === userId
        ? { ...u, assignedProjects: u.assignedProjects.filter(id => id !== projectId) }
        : u
    );
    set({ users });
    saveToStorage('users', users);
  },

  updateOrderStatus: (projectId, status) => {
    const now = new Date().toISOString().split('T')[0];
    const projects = get().projects.map(p =>
      p.id === projectId ? { ...p, orderStatus: status, updatedAt: now } : p
    );
    set({ projects });
    saveToStorage('projects', projects);
  },

  addProgressEntry: (projectId, entry) => {
    const id = 'pe' + Date.now();
    const now = new Date().toISOString().split('T')[0];
    const projects = get().projects.map(p => {
      if (p.id === projectId) {
        const newEntries = [...p.progressEntries, { ...entry, id }];
        return {
          ...p,
          progressEntries: newEntries,
          overallProgress: entry.percentage,
          updatedAt: now,
        };
      }
      return p;
    });
    set({ projects });
    saveToStorage('projects', projects);
  },

  updateProjectDetails: (projectId, updates) => {
    const now = new Date().toISOString().split('T')[0];
    const projects = get().projects.map(p =>
      p.id === projectId ? { ...p, ...updates, updatedAt: now } : p
    );
    set({ projects });
    saveToStorage('projects', projects);
  },

  updateUserCredentials: (userId, updates) => {
    // If username is being changed, check it's not already taken by another user
    if (updates.username) {
      const existing = get().users.find(u => u.username === updates.username && u.id !== userId);
      if (existing) return false;
    }

    const users = get().users.map(u =>
      u.id === userId ? { ...u, ...updates } : u
    );
    const currentUser = get().currentUser;
    const updatedCurrentUser = currentUser && currentUser.id === userId
      ? { ...currentUser, ...updates }
      : currentUser;

    set({ users, currentUser: updatedCurrentUser });
    saveToStorage('users', users);
    if (updatedCurrentUser) saveToStorage('currentUser', updatedCurrentUser);
    return true;
  },
}));
