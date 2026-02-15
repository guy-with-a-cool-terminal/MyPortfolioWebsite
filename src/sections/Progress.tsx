import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
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

const COLORS = {
  Work: '#60a5fa',
  Learning: '#34d399',
  Programming: '#a78bfa',
  Personal: '#fbbf24',
  Admin: '#f87171',
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
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [capacityData, setCapacityData] = useState<CapacityData[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});

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
    const today = new Date().toISOString().split('T')[0];

    for (let i = dates.length - 1; i >= 0; i--) {
      if (i === dates.length - 1) {
        const daysDiff = Math.floor((new Date(today).getTime() - new Date(dates[i]).getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 0) {
          currentStreak = 1;
          tempStreak = 1;
        } else if (daysDiff === 1) {
          // Yesterday counts as current
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const diff = Math.floor((new Date(dates[i + 1]).getTime() - new Date(dates[i]).getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak = tempStreak;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

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

    // Capacity analysis (all-time)
    const tasksByDay: Record<string, number> = {};
    allCompleted.forEach(task => {
      const date = task.dueDate;
      if (date) {
        tasksByDay[date] = (tasksByDay[date] || 0) + 1;
      }
    });

    const capacityBuckets: Record<string, { total: number; completed: number }> = {
      '1-2': { total: 0, completed: 0 },
      '3-4': { total: 0, completed: 0 },
      '5-6': { total: 0, completed: 0 },
      '7+': { total: 0, completed: 0 },
    };

    Object.values(tasksByDay).forEach(count => {
      let bucket = '7+';
      if (count <= 2) bucket = '1-2';
      else if (count <= 4) bucket = '3-4';
      else if (count <= 6) bucket = '5-6';

      capacityBuckets[bucket].total++;
      capacityBuckets[bucket].completed++;
    });

    const capacity = Object.entries(capacityBuckets)
      .map(([taskCount, { total, completed }]) => ({
        taskCount: `${taskCount} tasks/day`,
        days: total,
        successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }))
      .filter(item => item.days > 0);

    setCapacityData(capacity);
  };

  const renderHeatmap = () => {
    const dates = Object.keys(heatmapData).sort();
    if (!dates.length) return null;

    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    const weeks: string[][] = [];
    let currentWeek: string[] = [];

    for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      currentWeek.push(dateStr);
      
      if (d.getDay() === 6 || d.getTime() === lastDate.getTime()) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    const getColor = (count: number) => {
      if (!count) return 'rgba(255, 255, 255, 0.05)';
      if (count === 1) return 'rgba(96, 165, 250, 0.3)';
      if (count === 2) return 'rgba(96, 165, 250, 0.5)';
      if (count === 3) return 'rgba(96, 165, 250, 0.7)';
      return 'rgba(96, 165, 250, 0.9)';
    };

    return (
      <div style={{ overflowX: 'auto', padding: '20px 0' }}>
        <div style={{ display: 'flex', gap: '4px', minWidth: 'fit-content' }}>
          {weeks.map((week, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((date, j) => (
                <div
                  key={j}
                  title={`${date}: ${heatmapData[date] || 0} on-time tasks`}
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: getColor(heatmapData[date] || 0),
                    borderRadius: '2px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
          Only shows days with on-time completions (completed on due date)
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.6)' }}>Loading your progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#fff',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with Time Filter */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '48px',
              margin: '0 0 10px 0',
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
            }}>
              My Progress Dashboard
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', margin: 0 }}>
              Data-driven insights into my productivity(Connected to Notion Task boards)
            </p>
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
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
            { label: 'Total Tasks', value: stats.total, color: '#60a5fa' },
            { label: 'Completed', value: stats.completed, color: '#34d399' },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, color: '#a78bfa' },
            { label: 'Current Streak', value: `${stats.currentStreak} days`, color: '#fbbf24', subtitle: 'On-time only' },
            { label: 'Longest Streak', value: `${stats.longestStreak} days`, color: '#f87171', subtitle: 'All-time' },
            { label: 'Avg Tasks/Day', value: stats.avgTasksPerDay, color: '#60a5fa' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color, marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {stat.label}
              </div>
              {stat.subtitle && (
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>
                  {stat.subtitle}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Task Health Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '30px',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
            Task Health
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#34d399' }}>{stats.tasksOnTime}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>On Time</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#fbbf24' }}>{stats.tasksPushed}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Pushed Late</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(167, 139, 250, 0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#a78bfa' }}>{stats.averageDelay}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Avg Delay (days)</div>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(96, 165, 250, 0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#60a5fa' }}>{stats.recoveryRate}%</div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>On-Time Rate</div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '30px',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
            Activity Heatmap (All-Time)
          </h2>
          {renderHeatmap()}
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}>
          {/* Monthly Tasks */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
              Tasks by Month
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.3)" tick={{ fill: 'rgba(255, 255, 255, 0.6)' }} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" tick={{ fill: 'rgba(255, 255, 255, 0.6)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(26, 26, 31, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="tasks" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Capacity Analysis */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
              Daily Capacity Analysis
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={capacityData}>
                <XAxis dataKey="taskCount" stroke="rgba(255, 255, 255, 0.3)" tick={{ fill: 'rgba(255, 255, 255, 0.6)' }} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" tick={{ fill: 'rgba(255, 255, 255, 0.6)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(26, 26, 31, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="days" fill="#34d399" radius={[8, 8, 0, 0]} name="Days at this load" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
              Shows how many days you worked at each task volume
            </div>
          </div>
        </div>

        {/* Category & Status Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}>
          {/* Category Breakdown */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
              Category Distribution (All-Time)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {categoryData.map((cat, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: COLORS[cat.name as keyof typeof COLORS] }}>
                    {cat.completed}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {cat.incomplete} incomplete
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Overview */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
              Task Status
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#34d399' }}>{stats.completed}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#fbbf24' }}>{stats.inProgress}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>In Progress</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#f87171' }}>{stats.notStarted}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Not Started</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;