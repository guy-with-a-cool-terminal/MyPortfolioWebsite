// Client-side stats calculation. This is a deliberate, temporary SECOND copy of
// the canonical implementation in notion-chat/worker/stats.ts's computeProgressData
// — normally exactly the kind of duplication that codebase's DECISIONS.md warns
// against (#2), but notion-chat is not deployed yet, so Progress.tsx has nothing
// to call. See src/lib/progressDataSource.ts for the single switch that decides
// which implementation runs; this file is the 'local' branch of that switch.
//
// IMPORTANT: if you change the math here (what counts as "on time", the 80%
// capacity threshold, the 125%/75% velocity bands, anything), make the identical
// change in notion-chat/worker/stats.ts, and vice versa. When notion-chat is
// deployed, flip VITE_STATS_SOURCE to 'worker' and this file stops being read —
// don't delete it outright until then, but don't let it silently diverge either.
//
// Kept byte-for-byte faithful to worker/stats.ts's logic (only the import path
// for NotionTask differs, since this runs in the browser against notionClient.ts's
// type, which is a superset of the worker's).

import type { NotionTask } from '../utils/notionClient';

export type TimeFilter = 'week' | 'month' | 'all';

export interface Stats {
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
}

export interface CategoryData {
  name: string;
  completed: number;
  incomplete: number;
}

export interface MonthlyData {
  month: string;
  tasks: number;
}

export interface CapacityData {
  taskCount: string;
  days: number;
  successRate: number;
  rawCount: number;
}

export interface VelocityData {
  date: string;
  avg: number;
  tasks: number;
}

export interface CapacityWarning {
  date: string;
  count: number;
  limit: number;
}

export interface TrendInsight {
  type: 'velocity' | 'push_rate';
  title: string;
  description: string;
  severity: 'warning' | 'info';
}

export interface ProgressData {
  stats: Stats;
  categoryData: CategoryData[];
  monthlyData: MonthlyData[];
  capacityData: CapacityData[];
  heatmapData: Record<string, number>;
  velocityData: VelocityData[];
  capacityWarnings: CapacityWarning[];
  trendInsights: TrendInsight[];
  capacityInsight: string;
}

const getLocalDateStr = (d?: Date) => {
  const date = d || new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

function getFilteredTasks(taskData: NotionTask[], timeFilter: TimeFilter): NotionTask[] {
  if (timeFilter === 'all') return taskData;

  const now = new Date();
  const filterDate = new Date();
  if (timeFilter === 'week') filterDate.setDate(now.getDate() - 7);
  else if (timeFilter === 'month') filterDate.setDate(now.getDate() - 30);

  return taskData.filter((task) => {
    const taskDate = task.completedDate || task.dueDate;
    if (!taskDate) return false;
    return new Date(taskDate) >= filterDate;
  });
}

export function computeProgressData(taskData: NotionTask[], timeFilter: TimeFilter): ProgressData {
  const filteredTasks = getFilteredTasks(taskData, timeFilter);

  const completed = filteredTasks.filter((t) => t.status === 'Completed');
  const inProgress = filteredTasks.filter((t) => t.status === 'In Progress');
  const notStarted = filteredTasks.filter((t) => t.status === 'Not Started');

  const completedWithDates = completed
    .map((task) => ({ ...task, actualCompletedDate: task.completedDate || task.dueDate }))
    .filter((t) => t.actualCompletedDate && t.dueDate);

  let tasksOnTime = 0;
  let tasksPushed = 0;
  let totalDelay = 0;

  completedWithDates.forEach((task) => {
    const dueDate = new Date(task.dueDate);
    const completedDate = new Date(task.actualCompletedDate);
    const delay = Math.floor((completedDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    if (delay === 0) tasksOnTime++;
    else if (delay > 0) {
      tasksPushed++;
      totalDelay += delay;
    }
  });

  const averageDelay = tasksPushed > 0 ? totalDelay / tasksPushed : 0;
  const recoveryRate = completed.length > 0 ? Math.round((tasksOnTime / completed.length) * 100) : 0;
  const pushRateAll = completed.length > 0 ? Math.round((tasksPushed / completed.length) * 100) : 0;

  // Heatmap (all-time, on-time completions only)
  const dailyCounts: Record<string, number> = {};
  taskData
    .filter((t) => t.status === 'Completed')
    .forEach((task) => {
      const completedDate = task.completedDate || task.dueDate;
      if (completedDate && task.dueDate && completedDate === task.dueDate) {
        dailyCounts[task.dueDate] = (dailyCounts[task.dueDate] || 0) + 1;
      }
    });

  // Streaks (all-time)
  const dates = Object.keys(dailyCounts).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = getLocalDateStr(new Date());

  if (dates.length > 0) {
    tempStreak = 1;
    longestStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = Math.floor((new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) tempStreak++;
      else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const lastDate = dates[dates.length - 1];
    const daysSinceLast = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
    currentStreak = daysSinceLast <= 1 ? tempStreak : 0;
  }

  const firstDate = dates[0] ? new Date(dates[0]) : new Date();
  const lastDateObj = new Date();
  const totalDays = Math.floor((lastDateObj.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const avgTasksPerDay = dates.length > 0 ? completed.length / dates.length : 0;

  const stats: Stats = {
    total: filteredTasks.length,
    completed: completed.length,
    inProgress: inProgress.length,
    notStarted: notStarted.length,
    completionRate: Math.round((completed.length / filteredTasks.length) * 100) || 0,
    currentStreak,
    longestStreak,
    daysActive: dates.length,
    totalDays,
    tasksOnTime,
    tasksPushed,
    averageDelay: Math.round(averageDelay * 10) / 10,
    recoveryRate,
    avgTasksPerDay: Math.round(avgTasksPerDay * 10) / 10,
    pushRate: pushRateAll,
  };

  // Category breakdown (all-time)
  const allCompleted = taskData.filter((t) => t.status === 'Completed');
  const categories = ['Work', 'Learning', 'Programming', 'Personal', 'Admin'];
  const categoryData: CategoryData[] = categories.map((cat) => ({
    name: cat,
    completed: allCompleted.filter((t) => t.category === cat).length,
    incomplete: taskData.filter((t) => t.category === cat && t.status !== 'Completed').length,
  }));

  // Monthly (all-time)
  const monthCounts: Record<string, number> = {};
  allCompleted.forEach((task) => {
    const date = task.completedDate || task.dueDate;
    if (date) {
      const month = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    }
  });
  const monthlyData: MonthlyData[] = Object.entries(monthCounts).map(([month, tasks]) => ({ month, tasks }));

  // Capacity analysis
  const scheduledByDay: Record<string, number> = {};
  const actuallyCompletedOnTimeByDay: Record<string, number> = {};
  taskData.forEach((task) => {
    if (task.dueDate) {
      scheduledByDay[task.dueDate] = (scheduledByDay[task.dueDate] || 0) + 1;
      if (task.status === 'Completed' && task.completedDate === task.dueDate) {
        actuallyCompletedOnTimeByDay[task.dueDate] = (actuallyCompletedOnTimeByDay[task.dueDate] || 0) + 1;
      }
    }
  });

  const loadPerformance: Record<number, { days: number; successes: number }> = {};
  Object.entries(scheduledByDay).forEach(([date, scheduledCount]) => {
    if (new Date(date) > new Date()) return;
    if (!loadPerformance[scheduledCount]) loadPerformance[scheduledCount] = { days: 0, successes: 0 };
    loadPerformance[scheduledCount].days++;
    const completedCount = actuallyCompletedOnTimeByDay[date] || 0;
    if (completedCount >= scheduledCount * 0.8) loadPerformance[scheduledCount].successes++;
  });

  const capacityData: CapacityData[] = Object.entries(loadPerformance)
    .map(([count, { days, successes }]) => ({
      taskCount: `${count} task${count === '1' ? '' : 's'}/day`,
      days,
      successRate: Math.round((successes / days) * 100),
      rawCount: parseInt(count, 10),
    }))
    .sort((a, b) => a.rawCount - b.rawCount);

  const validLoads = capacityData.filter((c) => c.days >= 3);
  const bestLoad = validLoads.length > 0 ? validLoads.reduce((prev, curr) => (curr.successRate >= prev.successRate ? curr : prev)) : null;
  const capacityInsight = bestLoad
    ? `Data suggests you are most successful (${bestLoad.successRate}% completion) when scheduling **${bestLoad.rawCount} task${bestLoad.rawCount === 1 ? '' : 's'}** per day.`
    : 'Keep tracking tasks, Brian, to find your optimal daily capacity.';

  // Velocity (7-day moving average, all-time)
  const sortedDates = Object.keys(dailyCounts).sort();
  const velocityData: VelocityData[] = [];
  if (sortedDates.length > 0) {
    const firstVelDate = new Date(sortedDates[0]);
    const lastVelDate = new Date();
    for (let d = new Date(firstVelDate); d <= lastVelDate; d.setDate(d.getDate() + 1)) {
      const dateStr = getLocalDateStr(d);
      const tasksOnDay = dailyCounts[dateStr] || 0;
      let sum = 0;
      for (let i = 0; i < 7; i++) {
        const prev = new Date(d);
        prev.setDate(d.getDate() - i);
        const prevStr = getLocalDateStr(prev);
        if (dailyCounts[prevStr]) sum += dailyCounts[prevStr];
      }
      velocityData.push({ date: dateStr, tasks: tasksOnDay, avg: Math.round((sum / 7) * 10) / 10 });
    }
  }

  // Capacity planning warnings (future)
  const upcomingTasks: Record<string, number> = {};
  const todayStr = getLocalDateStr(new Date());
  taskData
    .filter((t) => t.status !== 'Completed' && t.dueDate)
    .forEach((task) => {
      if (task.dueDate >= todayStr) upcomingTasks[task.dueDate] = (upcomingTasks[task.dueDate] || 0) + 1;
    });

  const roundedLimit = Math.round(avgTasksPerDay || 2);
  const capacityWarnings: CapacityWarning[] = Object.entries(upcomingTasks)
    .filter(([, count]) => count > roundedLimit)
    .map(([date, count]) => ({ date, count, limit: roundedLimit }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Trend insights
  const trendInsights: TrendInsight[] = [];

  if (velocityData.length >= 7) {
    const currentVelocity = velocityData[velocityData.length - 1].avg;
    const monthlyVel = velocityData.slice(-30);
    const monthlyAvg = monthlyVel.reduce((acc, curr) => acc + curr.avg, 0) / monthlyVel.length;

    if (currentVelocity > monthlyAvg * 1.25) {
      trendInsights.push({
        type: 'velocity',
        title: 'Unstoppable Momentum! 🔥',
        description: "You're crushing it, Brian! Your 7-day velocity is well above your monthly average. Keep that energy going!",
        severity: 'info',
      });
    } else if (currentVelocity < monthlyAvg * 0.75) {
      trendInsights.push({
        type: 'velocity',
        title: 'Productivity dip. Is all well, Brian?',
        description: "Your weekly completion rate is noticeably lower than your usual average. Remember to take a breather if you're feeling burnt out.",
        severity: 'warning',
      });
    }
  }

  const last7Days = taskData.filter((t) => {
    const taskDate = t.completedDate || t.dueDate;
    if (!taskDate) return false;
    const diff = (new Date().getTime() - new Date(taskDate).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && t.status === 'Completed';
  });

  if (last7Days.length >= 3) {
    const pushedLate = last7Days.filter((t) => t.completedDate && t.dueDate && t.completedDate > t.dueDate).length;
    const pushRate7 = pushedLate / last7Days.length;
    const weeklyAvgVolume = last7Days.length / 7;

    if (pushRate7 > 0.3) {
      const isVolumeHigh = weeklyAvgVolume >= roundedLimit * 0.9;
      trendInsights.push({
        type: 'push_rate',
        title: isVolumeHigh ? 'High Workload Pressure ⚠️' : 'Focus & Planning Insight',
        description: isVolumeHigh
          ? `Brian, you're working hard but pushing ${Math.round(pushRate7 * 100)}% of tasks late. You might be over-committed. Let's scale back tomorrow?`
          : `You're at a normal workload but still pushing ${Math.round(pushRate7 * 100)}% of tasks late. Watch out for procrastination creeping in!`,
        severity: 'warning',
      });
    } else if (pushRate7 === 0 && last7Days.length > 5) {
      trendInsights.push({
        type: 'push_rate',
        title: 'Impeccable Execution 🎯',
        description: "Flawless execution this week, Brian! You haven't delayed a single task. Absolute machine!",
        severity: 'info',
      });
    }
  }

  return { stats, categoryData, monthlyData, capacityData, heatmapData: dailyCounts, velocityData, capacityWarnings, trendInsights, capacityInsight };
}
