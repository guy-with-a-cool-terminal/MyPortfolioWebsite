// Client for the notion-chat worker. Mirrors notionClient.ts's pattern: plain fetch()
// straight to the deployed *.workers.dev URL, same in dev and prod.
//
// The PIN is checked server-side on every request (see notion-chat/DECISIONS.md #5).
// This client just carries whatever PIN the user entered; it enforces nothing itself.

import type { TimeFilter, ProgressData } from '../lib/computeProgressStats';

const WORKER_URL = import.meta.env.VITE_NOTION_CHAT_URL || 'https://notion-chat.njugunabriian-dev.workers.dev';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface DraftEntry {
  task: string;
  category: 'Programming' | 'Work' | 'Personal' | 'Learning' | 'Admin';
  status: 'Not Started' | 'Postponed' | 'In Progress' | 'Completed';
  due_date: string;
  completed_date?: string;
}

export interface ChatTurnResult {
  reply: string;
  draft: DraftEntry | null;
}

export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const res = await fetch(`${WORKER_URL}/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.ok;
  } catch {
    return false;
  }
}

export async function sendMessage(pin: string, messages: ChatMessage[]): Promise<ChatTurnResult> {
  const res = await fetch(`${WORKER_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin, messages }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Chat request failed (${res.status})`);
  }
  return res.json();
}

export async function confirmLog(pin: string, entry: DraftEntry): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${WORKER_URL}/confirm-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin, entry }),
  });
  return res.json();
}

// Progress stats. The canonical CALCULATION lives entirely in the notion-chat worker
// (worker/stats.ts) — this just fetches its result; the TYPES for that result are
// shared with src/lib/computeProgressStats.ts (the local fallback used until
// notion-chat is deployed, see src/lib/progressDataSource.ts) so both branches of
// that switch return exactly the same shape to Progress.tsx.
export type { TimeFilter, ProgressData };

export async function fetchProgressStats(filter: TimeFilter): Promise<ProgressData> {
  const res = await fetch(`${WORKER_URL}/stats?filter=${filter}`);
  if (!res.ok) throw new Error(`Failed to fetch progress stats (${res.status})`);
  return res.json();
}
