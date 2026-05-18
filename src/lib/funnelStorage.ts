import { Node, Edge } from '@xyflow/react';

const FUNNELS_KEY = 'funnelmap-funnels';
const ACTIVE_FUNNEL_KEY = 'funnelmap-active-funnel';

export interface SavedFunnel {
  id: string;
  name: string;
  description: string;
  offerBrief: any;
  nodes: Node[];
  edges: Edge[];
  layouts: Record<string, any>;
  copyData: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/** List all saved funnels. */
export function listFunnels(): SavedFunnel[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(FUNNELS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

/** Get a funnel by ID. */
export function getFunnel(id: string): SavedFunnel | null {
  return listFunnels().find(f => f.id === id) || null;
}

/** Save a funnel (upsert). */
export function saveFunnel(funnel: SavedFunnel): void {
  const funnels = listFunnels();
  const idx = funnels.findIndex(f => f.id === funnel.id);
  funnel.updatedAt = Date.now();
  if (idx >= 0) {
    funnels[idx] = funnel;
  } else {
    funnels.push(funnel);
  }
  localStorage.setItem(FUNNELS_KEY, JSON.stringify(funnels));
}

/** Delete a funnel. */
export function deleteFunnel(id: string): void {
  const funnels = listFunnels().filter(f => f.id !== id);
  localStorage.setItem(FUNNELS_KEY, JSON.stringify(funnels));
  if (getActiveFunnelId() === id) {
    clearActiveFunnelId();
  }
}

/** Duplicate a funnel. */
export function duplicateFunnel(id: string): SavedFunnel | null {
  const original = getFunnel(id);
  if (!original) return null;
  const copy: SavedFunnel = {
    ...JSON.parse(JSON.stringify(original)),
    id: `funnel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${original.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveFunnel(copy);
  return copy;
}

/** Rename a funnel. */
export function renameFunnel(id: string, newName: string): void {
  const funnels = listFunnels();
  const funnel = funnels.find(f => f.id === id);
  if (funnel) {
    funnel.name = newName;
    funnel.updatedAt = Date.now();
    localStorage.setItem(FUNNELS_KEY, JSON.stringify(funnels));
  }
}

/** Get active funnel ID. */
export function getActiveFunnelId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_FUNNEL_KEY);
}

/** Set active funnel ID. */
export function setActiveFunnelId(id: string): void {
  localStorage.setItem(ACTIVE_FUNNEL_KEY, id);
}

/** Clear active funnel ID. */
export function clearActiveFunnelId(): void {
  localStorage.removeItem(ACTIVE_FUNNEL_KEY);
}

/** Create a new empty funnel. */
export function createNewFunnel(name: string): SavedFunnel {
  const funnel: SavedFunnel = {
    id: `funnel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    description: '',
    offerBrief: {},
    nodes: [],
    edges: [],
    layouts: {},
    copyData: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveFunnel(funnel);
  return funnel;
}
