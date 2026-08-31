// The one place that decides where Progress.tsx's stats come from. Flip
// VITE_STATS_SOURCE (in Vercel's env config, or a local .env) to 'worker' once
// notion-chat is deployed — that's the whole migration, no code changes, no
// hunting through Progress.tsx for a hardcoded branch.
//
// 'worker': fetch pre-computed stats from the notion-chat worker's /stats
//           endpoint (src/utils/chatClient.ts) — the canonical implementation,
//           paginates properly, shared with the /chat planning assistant.
// 'local':  compute stats in the browser (src/lib/computeProgressStats.ts) from
//           notion-proxy's raw task list — the fallback used while notion-chat
//           isn't deployed. notion-proxy has no pagination handling, so IF Notion
//           ever returns a second page this mode would under-count (checked
//           directly against the live worker on 2026-08-31 and it did not
//           truncate at the time of writing); Progress.tsx surfaces that via
//           FetchTasksResult.truncated rather than showing wrong numbers silently.
export type StatsSource = 'worker' | 'local';

const VALID: StatsSource[] = ['worker', 'local'];
const requested = import.meta.env.VITE_STATS_SOURCE as string | undefined;

export const STATS_SOURCE: StatsSource = VALID.includes(requested as StatsSource) ? (requested as StatsSource) : 'local';
