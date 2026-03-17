import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertTriangle, Clock, TrendingDown, Info, AlertCircle, X, Loader2 } from 'lucide-react';
import { fetchAllTasks, NotionTask } from '../utils/notionClient';

type TimeFilter = 'week' | 'month' | 'all';

interface Stats {
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

interface CategoryData {
  name: string;
  completed: number;
  incomplete: number;
}

interface MonthlyData {
  month: string;
  tasks: number;
}

interface CapacityData {
  taskCount: string;
  days: number;
  successRate: number;
}

interface VelocityData {
  date: string;
  avg: number;
  tasks: number;
}

interface CapacityWarning {
  date: string;
  count: number;
  limit: number;
}

interface TrendInsight {
  type: 'velocity' | 'push_rate';
  title: string;
  description: string;
  severity: 'warning' | 'info';
}

const COLORS = {
  Work: '#38bdf8',
  Learning: '#34d399',
  Admin: '#f59e0b',
  Programming: '#a78bfa',
  Personal: '#fb7185',
  Neutral: '#94a3b8',
  Success: '#10b981',
  Danger: '#ef4444',
  Background: '#0f172a',
  Surface: '#1e293b',
  Border: '#334155',
  BorderStrong: '#475569',
  TextPrimary: '#f8fafc',
  TextSecondary: '#94a3b8',
  TextMuted: '#64748b',
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '148, 163, 184';
};

const getLocalDateStr = (d?: Date) => {
  const date = d || new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const TOKENS = {
  radius: { sm: '8px', md: '12px', lg: '16px', xl: '24px' },
  spacing: { sm: '12px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' }
};

const Progress: React.FC = () => {
  const [tasks, setTasks] = useState<NotionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    daysActive: 0,
    totalDays: 0,
    tasksOnTime: 0,
    tasksPushed: 0,
    averageDelay: 0,
    recoveryRate: 0,
    avgTasksPerDay: 0,
    pushRate: 0,
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [capacityData, setCapacityData] = useState<CapacityData[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [velocityData, setVelocityData] = useState<VelocityData[]>([]);
  const [capacityWarnings, setCapacityWarnings] = useState<CapacityWarning[]>([]);
  const [trendInsights, setTrendInsights] = useState<TrendInsight[]>([]);
  const [capacityInsight, setCapacityInsight] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<NotionTask[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      processData(tasks);
    }
  }, [timeFilter, tasks]);

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchAllTasks();
    setTasks(data);
    processData(data);
    setLoading(false);
  };

  const getFilteredTasks = (taskData: NotionTask[]): NotionTask[] => {
    if (timeFilter === 'all') return taskData;

    const now = new Date();
    const filterDate = new Date();

    if (timeFilter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (timeFilter === 'month') {
      filterDate.setDate(now.getDate() - 30);
    }

    return taskData.filter(task => {
      const taskDate = task.completedDate || task.dueDate;
      if (!taskDate) return false;
      return new Date(taskDate) >= filterDate;
    });
  };

  const processData = (taskData: NotionTask[]) => {
    // Apply time filter to most stats (not categories)
    const filteredTasks = getFilteredTasks(taskData);
    
    const completed = filteredTasks.filter(t => t.status === 'Completed');
    const inProgress = filteredTasks.filter(t => t.status === 'In Progress');
    const notStarted = filteredTasks.filter(t => t.status === 'Not Started');

    // Process completed tasks with dates
    const completedWithDates = completed.map(task => ({
      ...task,
      // Fallback: if no completedDate, assume completed on dueDate
      actualCompletedDate: task.completedDate || task.dueDate,
    })).filter(t => t.actualCompletedDate && t.dueDate);

    // Calculate on-time vs pushed tasks
    let tasksOnTime = 0;
    let tasksPushed = 0;
    let totalDelay = 0;

    completedWithDates.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const completedDate = new Date(task.actualCompletedDate);
      const delay = Math.floor((completedDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (delay === 0) {
        tasksOnTime++;
      } else if (delay > 0) {
        tasksPushed++;
        totalDelay += delay;
      }
    });

    const averageDelay = tasksPushed > 0 ? totalDelay / tasksPushed : 0;
    const recoveryRate = completed.length > 0 ? Math.round((tasksOnTime / completed.length) * 100) : 0;
    const pushRate = completed.length > 0 ? Math.round((tasksPushed / completed.length) * 100) : 0;

    // Heatmap data (all-time, shows on-time completions)
    const dailyCounts: Record<string, number> = {};
    taskData.filter(t => t.status === 'Completed').forEach(task => {
      const completedDate = task.completedDate || task.dueDate;
      if (completedDate && task.dueDate) {
        const isOnTime = completedDate === task.dueDate;
        if (isOnTime) {
          dailyCounts[task.dueDate] = (dailyCounts[task.dueDate] || 0) + 1;
        }
      }
    });

    setHeatmapData(dailyCounts);

    // Calculate streaks (all-time, only on-time tasks count)
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
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      // Current streak: must include today or yesterday
      const lastDate = dates[dates.length - 1];
      const daysSinceLast = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLast <= 1) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }
    }

    // Total days calculation
    const firstDate = dates[0] ? new Date(dates[0]) : new Date();
    const lastDate = new Date();
    const totalDays = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const avgTasksPerDay = dates.length > 0 ? completed.length / dates.length : 0;

    setStats({
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
      pushRate,
    });

    // Category breakdown (always all-time)
    const allCompleted = taskData.filter(t => t.status === 'Completed');
    const categories = ['Work', 'Learning', 'Programming', 'Personal', 'Admin'];
    const catData = categories.map(cat => ({
      name: cat,
      completed: allCompleted.filter(t => t.category === cat).length,
      incomplete: taskData.filter(t => t.category === cat && t.status !== 'Completed').length,
    }));
    setCategoryData(catData);

    // Monthly data (all-time)
    const monthCounts: Record<string, number> = {};
    allCompleted.forEach(task => {
      const date = task.completedDate || task.dueDate;
      if (date) {
        const month = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    const monthly = Object.entries(monthCounts).map(([month, tasks]) => ({ month, tasks }));
    setMonthlyData(monthly);

    // Capacity analysis (Scheduled vs Completed)
    const scheduledByDay: Record<string, number> = {};
    const actuallyCompletedOnTimeByDay: Record<string, number> = {};
    
    // Track all tasks that were due on specific days
    taskData.forEach(task => {
      if (task.dueDate) {
        scheduledByDay[task.dueDate] = (scheduledByDay[task.dueDate] || 0) + 1;
        if (task.status === 'Completed' && task.completedDate === task.dueDate) {
          actuallyCompletedOnTimeByDay[task.dueDate] = (actuallyCompletedOnTimeByDay[task.dueDate] || 0) + 1;
        }
      }
    });

    const loadPerformance: Record<number, { days: number; successes: number }> = {};
    
    Object.entries(scheduledByDay).forEach(([date, scheduledCount]) => {
      if (new Date(date) > new Date()) return; // Don't include future days in historical performance
      
      if (!loadPerformance[scheduledCount]) {
        loadPerformance[scheduledCount] = { days: 0, successes: 0 };
      }
      
      loadPerformance[scheduledCount].days++;
      const completedCount = actuallyCompletedOnTimeByDay[date] || 0;
      
      // A success is defined as finishing at least 80% of what you planned for that day
      if (completedCount >= scheduledCount * 0.8) {
        loadPerformance[scheduledCount].successes++;
      }
    });

    const capacity = Object.entries(loadPerformance)
      .map(([count, { days, successes }]) => ({
        taskCount: `${count} tasks/day`,
        days: days,
        successRate: Math.round((successes / days) * 100),
        rawCount: parseInt(count)
      }))
      .sort((a, b) => a.rawCount - b.rawCount);

    setCapacityData(capacity);

    // Find the "Sweet Spot" - highest success rate with at least 3 days of data
    const validLoads = capacity.filter(c => c.days >= 3);
    const bestLoad = validLoads.length > 0 
      ? validLoads.reduce((prev, curr) => (curr.successRate >= prev.successRate ? curr : prev))
      : null;

    if (bestLoad) {
      setCapacityInsight(`Data suggests you are most successful (${bestLoad.successRate}% completion) when scheduling **${bestLoad.rawCount} tasks** per day.`);
    } else {
      setCapacityInsight("Keep tracking tasks, Brian, to find your optimal daily capacity.");
    }

    // Velocity Trend (7-day moving average)
    const sortedDates = Object.keys(dailyCounts).sort();
    if (sortedDates.length > 0) {
      const velocity: VelocityData[] = [];
      const firstDate = new Date(sortedDates[0]);
      const lastDate = new Date();
      
      for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
        const dateStr = getLocalDateStr(d);
        const tasksOnDay = dailyCounts[dateStr] || 0;
        
        // Calculate 7-day moving average
        let sum = 0;
        let count = 0;
        for (let i = 0; i < 7; i++) {
          const prev = new Date(d);
          prev.setDate(d.getDate() - i);
          const prevStr = getLocalDateStr(prev);
          if (dailyCounts[prevStr]) {
            sum += dailyCounts[prevStr];
          }
        }
        velocity.push({
          date: dateStr,
          tasks: tasksOnDay,
          avg: Math.round((sum / 7) * 10) / 10
        });
      }
      setVelocityData(velocity);
    }

    // Capacity Planning (Future Warnings)
    const upcomingTasks: Record<string, number> = {};
    const todayStr = getLocalDateStr(new Date());
    taskData.filter(t => t.status !== 'Completed' && t.dueDate).forEach(task => {
      if (task.dueDate >= todayStr) {
        upcomingTasks[task.dueDate] = (upcomingTasks[task.dueDate] || 0) + 1;
      }
    });

    const roundedLimit = Math.round(avgTasksPerDay || 2);
    const warnings: CapacityWarning[] = [];
    Object.entries(upcomingTasks).forEach(([date, count]) => {
      if (count > roundedLimit) {
        warnings.push({ date, count, limit: roundedLimit });
      }
    });
    setCapacityWarnings(warnings.sort((a, b) => a.date.localeCompare(b.date)));

    // Burnout & Trend Insights
    const insights: TrendInsight[] = [];
    
    // Velocity Trend Check
    if (velocityData.length >= 7) {
      const currentVelocity = velocityData[velocityData.length - 1].avg;
      const monthlyData = velocityData.slice(-30);
      const monthlyAvg = monthlyData.reduce((acc, curr) => acc + curr.avg, 0) / monthlyData.length;

      if (currentVelocity > monthlyAvg * 1.25) {
        // High Performance
        insights.push({
          type: 'velocity',
          title: 'Unstoppable Momentum! 🔥',
          description: `You're crushing it, Brian! Your 7-day velocity is well above your monthly average. Keep that energy going!`,
          severity: 'info'
        });
      } else if (currentVelocity < monthlyAvg * 0.75) {
        // Dip
        insights.push({
          type: 'velocity',
          title: 'Productivity Dip — Is all well? Brian..',
          description: `Your weekly completion rate is noticeably lower than your usual average. Remember to take a breather if you're feeling burnt out.`,
          severity: 'warning'
        });
      }
    }

    // Push Rate & Volume Correlation
    const last7Days = taskData.filter(t => {
      const taskDate = t.completedDate || t.dueDate;
      if (!taskDate) return false;
      const diff = (new Date().getTime() - new Date(taskDate).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7 && t.status === 'Completed';
    });

    if (last7Days.length >= 3) {
      const pushedLate = last7Days.filter(t => t.completedDate && t.dueDate && t.completedDate > t.dueDate).length;
      const pushRate = pushedLate / last7Days.length;
      const weeklyAvgVolume = last7Days.length / 7;

      if (pushRate > 0.3) {
        const isVolumeHigh = weeklyAvgVolume >= (roundedLimit * 0.9);
        insights.push({
          type: 'push_rate',
          title: isVolumeHigh ? 'High Workload Pressure ⚠️' : 'Focus & Planning Insight',
          description: isVolumeHigh 
            ? `Brian, you're working hard but pushing ${Math.round(pushRate * 100)}% of tasks late. You might be over-committed. Let's scale back tomorrow?`
            : `You're at a normal workload but still pushing ${Math.round(pushRate * 100)}% of tasks late. Watch out for procrastination creeping in!`,
          severity: 'warning'
        });
      } else if (pushRate === 0 && last7Days.length > 5) {
        insights.push({
          type: 'push_rate',
          title: 'Impeccable Execution 🎯',
          description: `Flawless execution this week, Brian! You haven't delayed a single task. Absolute machine!`,
          severity: 'info'
        });
      }
    }
    setTrendInsights(insights);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    const dayTasks = tasks.filter(t => {
      const taskDate = t.completedDate || t.dueDate;
      return taskDate === date;
    });
    setSelectedTasks(dayTasks);
  };

  const renderHeatmap = () => {
    const dates = Object.keys(heatmapData).sort();
    if (!dates.length) return null;

    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    const weeks: string[][] = [];
    let currentWeek: string[] = [];

    for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
      const dateStr = getLocalDateStr(d);
      currentWeek.push(dateStr);
      
      if (d.getDay() === 6 || d.getTime() === lastDate.getTime()) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    const getColor = (count: number) => {
      if (!count) return '#1e293b'; // Base card color for empty
      if (count === 1) return '#083344'; // Level 1 (Dark Cyan)
      if (count === 2) return '#0891b2'; // Level 2 (Cyan)
      if (count === 3) return '#0ea5e9'; // Level 3 (Sky)
      return '#38bdf8'; // Level 4 (Vibrant Sky Blue)
    };

    return (
      <div style={{ overflowX: 'auto', padding: '20px 0' }}>
        <div style={{ display: 'flex', gap: '4px', minWidth: 'fit-content' }}>
          {weeks.map((week, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((date, j) => (
                <div
                  key={j}
                  onClick={() => handleDateClick(date)}
                  title={`${date}: ${heatmapData[date] || 0} on-time tasks`}
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: getColor(heatmapData[date] || 0),
                    borderRadius: '3px',
                    border: date === selectedDate ? '2px solid #38bdf8' : '0.5px solid #334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: date === selectedDate ? 'scale(1.2)' : 'scale(1)',
                    zIndex: date === selectedDate ? 1 : 0,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: COLORS.TextSecondary, fontWeight: '500' }}>
          Only shows days with on-time completions (completed on due date). Click a square to explore.
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: COLORS.Background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Loader2 className="animate-spin" style={{ width: '48px', height: '48px', marginBottom: '20px', color: '#38bdf8' }} />
          <div style={{ fontSize: '18px', color: COLORS.TextSecondary, fontWeight: '500' }}>Loading your progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.Background,
      color: COLORS.TextPrimary, // Primary Text
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with Time Filter */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              margin: '0 0 10px 0',
              color: COLORS.TextPrimary,
              fontWeight: '800',
              letterSpacing: '-1px',
            }}>
              Hey Brian, Here's Your Progress
            </h1>
            <p style={{ color: COLORS.TextSecondary, fontSize: '16px', margin: 0 }}>
              Connected to Notion • Bridging the gap between planning and execution
            </p>
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            style={{
              background: COLORS.Surface,
              border: `1px solid ${COLORS.Border}`,
              color: COLORS.TextPrimary,
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
            }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          {[
            { label: 'Total Tasks', value: stats.total, color: '#38bdf8', subtitle: undefined, themeKey: 'Work' },
            { label: 'Completed', value: stats.completed, color: '#34d399', subtitle: undefined, themeKey: 'Learning' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, color: '#a78bfa', subtitle: undefined, themeKey: 'Programming' },
            { label: 'Current Streak', value: `${stats.currentStreak} days`, color: '#fb7185', subtitle: undefined, themeKey: 'Personal' },
            { label: 'Longest Streak', value: `${stats.longestStreak} days`, color: COLORS.TextSecondary, subtitle: undefined, themeKey: 'Neutral' },
            { label: 'Avg Tasks/Day', value: stats.avgTasksPerDay, color: '#38bdf8', subtitle: undefined, themeKey: 'Work' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: `rgba(${hexToRgb(COLORS[stat.themeKey as keyof typeof COLORS] || COLORS.Neutral)}, 0.08)`,
              padding: TOKENS.spacing.lg,
              borderRadius: TOKENS.radius.lg,
              border: `1px solid rgba(${hexToRgb(COLORS[stat.themeKey as keyof typeof COLORS] || COLORS.Neutral)}, 0.25)`,
            }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: stat.color, marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '13px',
                color: COLORS.TextMuted,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {stat.label}
              </div>
              {stat.subtitle && (
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.TextSecondary, marginTop: '4px' }}>
                  {stat.subtitle}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Capacity Warnings */}
        {capacityWarnings.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            {capacityWarnings.slice(0, 3).map((warning, i) => (
              <div key={i} style={{
                background: COLORS.Surface,
                border: `1px solid ${COLORS.Border}`,
                padding: '16px 20px',
                borderRadius: TOKENS.radius.md,
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#fcd34d',
                fontSize: '14px',
              }}>
                <AlertTriangle size={20} color="#f59e0b" />
                <span>
                  <strong style={{ color: '#f59e0b' }}>Careful Brian, Capacity Overload:</strong> You have {warning.count} tasks due on {warning.date}. 
                  Your historical sweet spot is {warning.limit} tasks/day. 
                  <strong style={{ color: '#f59e0b' }}> Suggestion:</strong> Move {warning.count - warning.limit} task{warning.count - warning.limit > 1 ? 's' : ''} to another day to protect your success rate.
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Trend Insights (Burnout/Downhill detection) */}
        {trendInsights.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '14px', color: COLORS.TextSecondary, marginBottom: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Trend Insights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              {trendInsights.map((insight, i) => (
                <div key={i} style={{
                  background: insight.severity === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(167, 139, 250, 0.08)',
                  border: `1px solid ${insight.severity === 'warning' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(167, 139, 250, 0.25)'}`,
                  padding: '20px',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    padding: '10px',
                    background: insight.severity === 'warning' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(167, 139, 250, 0.12)',
                    borderRadius: '10px',
                    color: insight.severity === 'warning' ? '#f59e0b' : '#a78bfa',
                  }}>
                    {insight.type === 'velocity' ? <TrendingDown size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      color: insight.severity === 'warning' ? '#f59e0b' : '#a78bfa', 
                      marginBottom: '4px' 
                    }}>
                      {insight.title}
                    </div>
                    <div style={{ fontSize: '14px', color: COLORS.TextSecondary, lineHeight: '1.5' }}>
                      {insight.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedDate && (
          <div style={{
            background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
            marginBottom: '30px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s ease-in-out',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: COLORS.TextPrimary }}>
                Tasks for {selectedDate}
              </h2>
              <button 
                onClick={() => setSelectedDate(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${COLORS.Border}`,
                  padding: '8px 16px',
                  borderRadius: '10px',
                  color: COLORS.TextSecondary,
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              >
                <X size={20} />
              </button>
            </div>
            {selectedTasks.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedTasks.map((task, i) => (
                  <div key={i} style={{
                  padding: '16px',
                  background: COLORS.Surface,
                  borderRadius: TOKENS.radius.md,
                  border: `1px solid ${COLORS.Border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: '700', color: COLORS.TextPrimary, marginBottom: '4px' }}>{task.task}</div>
                    <div style={{ fontSize: '12px', color: COLORS.TextSecondary, display: 'flex', gap: '10px' }}>
                      <span style={{ color: COLORS[task.category as keyof typeof COLORS] || COLORS.TextSecondary, fontWeight: 'bold' }}>{task.category}</span>
                      <span>•</span>
                      <span>{task.status}</span>
                    </div>
                  </div>
                  {task.status === 'Completed' && (
                    <div style={{
                      fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: 'rgba(16, 185, 129, 0.08)',
                      color: task.completedDate === task.dueDate ? '#34d399' : '#fb7185',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      border: `1px solid ${task.completedDate === task.dueDate ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 113, 133, 0.1)'}`
                    }}>
                      {task.completedDate === task.dueDate ? 'ON TIME' : 'PUSHED'}
                    </div>
                  )}
                </div>
                ))}
              </div>
            ) : (
              <div style={{ color: COLORS.TextSecondary, textAlign: 'center', padding: '20px', fontWeight: '500' }}>
                No tasks recorded for this day.
              </div>
            )}
          </div>
        )}

        {/* Task Health Section */}
        <div style={{
          background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
          marginBottom: '30px',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: COLORS.TextPrimary }}>
            Task Health
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#34d399')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#34d399')}, 0.25)` }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#34d399' }}>{stats.tasksOnTime}</div>
              <div style={{ fontSize: '14px', color: COLORS.TextSecondary, fontWeight: '600' }}>On Time</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#f59e0b')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#f59e0b')}, 0.25)` }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{stats.tasksPushed}</div>
              <div style={{ fontSize: '14px', color: COLORS.TextSecondary, fontWeight: '600' }}>Pushed Late</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#a78bfa')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#a78bfa')}, 0.25)` }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#a78bfa' }}>{stats.pushRate}%</div>
              <div style={{ fontSize: '14px', color: COLORS.TextSecondary, fontWeight: '600' }}>Push Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#a78bfa')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#a78bfa')}, 0.25)` }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#a78bfa' }}>{stats.averageDelay}</div>
              <div style={{ fontSize: '14px', color: COLORS.TextSecondary, fontWeight: '600' }}>Avg Delay (days)</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#38bdf8')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#38bdf8')}, 0.25)` }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#38bdf8' }}>{stats.recoveryRate}%</div>
              <div style={{ fontSize: '14px', color: COLORS.TextSecondary, fontWeight: '600' }}>On-Time Rate</div>
            </div>
          </div>
        </div>

        <div style={{
          background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
          marginBottom: '30px',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: COLORS.TextPrimary }}>
            Activity Heatmap
          </h2>
          {renderHeatmap()}
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}>
          <div style={{
            background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
            gridColumn: '1 / -1', // Always spans full width on desktop if space allows
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                Completion Velocity (7-Day Moving Avg)
              </h2>
              <div style={{
                fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em',
                background: 'rgba(167, 139, 250, 0.1)',
                color: '#a78bfa',
                padding: '4px 10px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(167, 139, 250, 0.25)',
                fontWeight: '600',
              }}>
                <Info size={14} />
                Speed of Consistency
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(167, 139, 250, 0.08)', 
              padding: '12px 16px', 
              borderRadius: TOKENS.radius.md, 
              marginBottom: '20px',
              fontSize: '13px',
              lineHeight: '1.5',
              color: COLORS.TextSecondary,
              borderLeft: '4px solid #a78bfa',
              border: '1px solid rgba(167, 139, 250, 0.25)'
            }}>
              <strong>How to read this:</strong> A steady line shows consistent discipline. A downward trend (Velocity Dip) warns of burnout before you feel it.
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={velocityData}>
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: COLORS.TextMuted, fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: COLORS.TextMuted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: COLORS.Background,
                    border: `1px solid ${COLORS.Border}`,
                    borderRadius: TOKENS.radius.md,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: COLORS.TextPrimary }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#a78bfa" 
                  strokeWidth={3} 
                  dot={false}
                  name="7-day Avg"
                />
                <Line 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#334155" 
                  strokeWidth={2} 
                  dot={true}
                  name="Daily Tasks"
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px', fontSize: '12px', color: COLORS.TextSecondary, fontWeight: '500' }}>
              Completion velocity tracks your output trend to catch early signs of fatigue.
            </div>
          </div>
          <div style={{
            background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: COLORS.TextPrimary }}>
              Tasks by Month
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: COLORS.TextMuted }} />
                <YAxis stroke="#94a3b8" tick={{ fill: COLORS.TextMuted }} />
                <Tooltip
                  contentStyle={{
                    background: COLORS.Background,
                    border: `1px solid ${COLORS.Border}`,
                    borderRadius: TOKENS.radius.md,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: COLORS.TextPrimary }}
                />
                <Bar dataKey="tasks" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: COLORS.TextPrimary }}>
                Capacity Analysis
              </h2>
              <div style={{
                fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em',
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontWeight: '600'
              }}>
                <Info size={14} />
                Focus Guide
              </div>
            </div>

            <div style={{ 
              background: COLORS.Surface, 
              padding: '12px 16px', 
              borderRadius: TOKENS.radius.md, 
              marginBottom: '20px',
              fontSize: '13px',
              lineHeight: '1.5',
              color: COLORS.TextSecondary,
              borderLeft: '4px solid #34d399',
              border: `1px solid ${COLORS.Border}`
            }}>
              <strong>Capacity Insight:</strong> {capacityInsight ? (
                <span dangerouslySetInnerHTML={{ __html: capacityInsight.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #34d399">$1</strong>') }} />
              ) : (
                "Loading insights..."
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capacityData}>
                <XAxis dataKey="taskCount" stroke="#94a3b8" tick={{ fill: COLORS.TextMuted }} />
                <YAxis stroke="#94a3b8" tick={{ fill: COLORS.TextMuted }} />
                <Tooltip
                  contentStyle={{
                    background: COLORS.Background,
                    border: `1px solid ${COLORS.Border}`,
                    borderRadius: TOKENS.radius.md,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: COLORS.TextPrimary }}
                />
                <Bar dataKey="days" fill="#34d399" radius={[8, 8, 0, 0]} name="Days at this load" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category & Status Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}>
          {/* Category Breakdown */}
          <div style={{
            background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: COLORS.TextPrimary }}>
              Categories
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {categoryData.map((cat, i) => (
                  <div key={i} style={{ 
                    padding: '16px', 
                    background: `rgba(${hexToRgb(COLORS[cat.name as keyof typeof COLORS] || COLORS.Neutral)}, 0.08)`, 
                    borderRadius: TOKENS.radius.md,
                    border: `1px solid rgba(${hexToRgb(COLORS[cat.name as keyof typeof COLORS] || COLORS.Neutral)}, 0.25)`,
                  }}>
                  <div style={{ fontSize: '13px', color: COLORS.TextSecondary, marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS[cat.name as keyof typeof COLORS] || '#f1f5f9' }}>
                    {cat.completed}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.TextSecondary, fontWeight: '500' }}>
                    {cat.incomplete} incomplete
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Overview */}
          <div style={{
            background: COLORS.Surface,
            padding: TOKENS.spacing.xl,
            borderRadius: TOKENS.radius.xl,
            border: `1px solid ${COLORS.BorderStrong}`,
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700', color: COLORS.TextPrimary }}>
              Current Status
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#34d399')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#34d399')}, 0.25)` }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#34d399' }}>{stats.completed}</div>
                <div style={{ fontSize: '13px', color: '#34d399', fontWeight: '600' }}>Done</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#38bdf8')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#38bdf8')}, 0.25)` }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#38bdf8' }}>{stats.inProgress}</div>
                <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '600' }}>In Progress</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: `rgba(${hexToRgb('#fb7185')}, 0.08)`, borderRadius: TOKENS.radius.lg, border: `1px solid rgba(${hexToRgb('#fb7185')}, 0.25)` }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#fb7185' }}>{stats.notStarted}</div>
                <div style={{ fontSize: '13px', color: '#fb7185', fontWeight: '600' }}>To Do</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;