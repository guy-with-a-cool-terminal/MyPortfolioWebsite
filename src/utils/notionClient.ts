export interface NotionTask {
  id: string;
  task: string;
  category: string;
  completedDate: string;
  dueDate: string;
  priority: string;
  status: string;
  focusMode: boolean;
}

const WORKER_URL = import.meta.env.VITE_NOTION_PROXY_URL || 'https://notion-proxy.njugunabriian-dev.workers.dev';

export interface FetchTasksResult {
  tasks: NotionTask[];
  // notion-proxy queries Notion with no start_cursor and no way to pass one in, so
  // if Notion's response ever has more pages, this worker has no way to fetch them.
  // (An earlier assumption stated this as a known, current 100-row cap — checked
  // directly against the live worker on 2026-08-31, and it returned the full task
  // list with has_more: null, so that specific claim was wrong. Leaving this check
  // in anyway as a safety net, not a documented limitation.) `truncated` mirrors
  // Notion's own `has_more`, so a caller relying on the full history (see
  // computeProgressStats.ts) can surface a real gap honestly if one ever appears,
  // rather than silently under-counting. Fix belongs in notion-proxy itself (mirror
  // notion-chat/worker/notion.ts's queryAllTasks) if this ever actually fires.
  truncated: boolean;
}

export async function fetchAllTasks(): Promise<FetchTasksResult> {
  try {
    const response = await fetch(WORKER_URL);
    const data = await response.json();

    const tasks: NotionTask[] = data.results.map((page: any) => ({
      id: page.id,
      task: page.properties.Task?.title?.[0]?.plain_text || '',
      category: page.properties.Category?.select?.name || '',
      completedDate: page.properties['Completed Date']?.date?.start || '',
      dueDate: page.properties['Due Date']?.date?.start || '',
      priority: page.properties.Priority?.select?.name || '',
      status: page.properties.Status?.status?.name || '',
      focusMode: page.properties['Focus Mode']?.checkbox || false,
    }));

    return { tasks, truncated: !!data.has_more };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { tasks: [], truncated: false };
  }
}