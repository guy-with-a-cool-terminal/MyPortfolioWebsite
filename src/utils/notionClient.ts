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

const WORKER_URL = 'https://notion-proxy.njugunabriian-dev.workers.dev';

export async function fetchAllTasks(): Promise<NotionTask[]> {
  try {
    const response = await fetch(WORKER_URL);
    const data = await response.json();

    return data.results.map((page: any) => ({
      id: page.id,
      task: page.properties.Task?.title?.[0]?.plain_text || '',
      category: page.properties.Category?.select?.name || '',
      completedDate: page.properties['Completed Date']?.date?.start || '',
      dueDate: page.properties['Due Date']?.date?.start || '',
      priority: page.properties.Priority?.select?.name || '',
      status: page.properties.Status?.status?.name || '',  
      focusMode: page.properties['Focus Mode']?.checkbox || false,
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}