// Client for the notion-chat worker. Mirrors notionClient.ts's pattern: plain fetch()
// straight to the deployed *.workers.dev URL, same in dev and prod.
//
// The PIN is checked server-side on every request (see notion-chat/DECISIONS.md #5).
// This client just carries whatever PIN the user entered; it enforces nothing itself.

const WORKER_URL = 'https://notion-chat.njugunabriian-dev.workers.dev';

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

// Progress stats. The canonical calculation lives entirely in the notion-chat worker
// (worker/stats.ts). Progress.tsx fetches this instead of recomputing it itself, so
// there is exactly one implementation of streak/velocity/capacity logic. See
// notion-chat/DECISIONS.md #2 before adding a second one anywhere.
export type TimeFilter = 'week' | 'month' | 'all';

export interface ProgressData {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    daysActive: number;
    totalDays: number;
    tasksOnTime: number;
    tasksPushed: number;
    averageDelay: number;
    recoveryRate: number;
    avgTasksPerDay: number;
    pushRate: number;
  };
  categoryData: { name: string; completed: number; incomplete: number }[];
  monthlyData: { month: string; tasks: number }[];
  capacityData: { taskCount: string; days: number; successRate: number; rawCount: number }[];
  heatmapData: Record<string, number>;
  velocityData: { date: string; avg: number; tasks: number }[];
  capacityWarnings: { date: string; count: number; limit: number }[];
  trendInsights: { type: 'velocity' | 'push_rate'; title: string; description: string; severity: 'warning' | 'info' }[];
  capacityInsight: string;
}

export async function fetchProgressStats(filter: TimeFilter): Promise<ProgressData> {
  const res = await fetch(`${WORKER_URL}/stats?filter=${filter}`);
  if (!res.ok) throw new Error(`Failed to fetch progress stats (${res.status})`);
  return res.json();
}
