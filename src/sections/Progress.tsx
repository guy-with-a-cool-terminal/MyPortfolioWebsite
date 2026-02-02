import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchAllTasks, NotionTask } from '../utils/notionClient';

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
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await fetchAllTasks();
    setTasks(data);
    processData(data);
    setLoading(false);
  };

  const processData = (taskData: NotionTask[]) => {
    const completed = taskData.filter(t => t.status === 'Completed');
    const inProgress = taskData.filter(t => t.status === 'In Progress');
    const notStarted = taskData.filter(t => t.status === 'Not Started');

    // Use Due Date for all calculations (when you actually worked)
    const completedWithDates = completed
      .filter(t => t.dueDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const dailyCounts: Record<string, number> = {};
    completedWithDates.forEach(task => {
      if (task.dueDate) {
        dailyCounts[task.dueDate] = (dailyCounts[task.dueDate] || 0) + 1;
      }
    });

    setHeatmapData(dailyCounts);

    // Calculate streaks based on Due Date
    const dates = Object.keys(dailyCounts).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split('T')[0];

    for (let i = dates.length - 1; i >= 0; i--) {
      if (i === dates.length - 1) {
        const daysDiff = Math.floor((new Date(today).getTime() - new Date(dates[i]).getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const diff = Math.floor((new Date(dates[i + 1]).getTime() - new Date(dates[i]).getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          tempStreak++;
          if (i === dates.length - 2 && currentStreak > 0) currentStreak = tempStreak;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Total days calculation
    const firstDate = dates[0] ? new Date(dates[0]) : new Date();
    const lastDate = new Date();
    const totalDays = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    setStats({
      total: taskData.length,
      completed: completed.length,
      inProgress: inProgress.length,
      notStarted: notStarted.length,
      completionRate: Math.round((completed.length / taskData.length) * 100),
      currentStreak,
      longestStreak,
      daysActive: dates.length,
      totalDays,
    });

    // Category breakdown
    const categories = ['Work', 'Learning', 'Programming', 'Personal', 'Admin'];
    const catData = categories.map(cat => ({
      name: cat,
      completed: completed.filter(t => t.category === cat).length,
      incomplete: taskData.filter(t => t.category === cat && t.status !== 'Completed').length,
    }));
    setCategoryData(catData);

    // Monthly data - use Due Date
    const monthCounts: Record<string, number> = {};
    completedWithDates.forEach(task => {
      if (task.dueDate) {
        const month = new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    const monthly = Object.entries(monthCounts).map(([month, tasks]) => ({ month, tasks }));
    setMonthlyData(monthly);
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
                  title={`${date}: ${heatmapData[date] || 0} tasks`}
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
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
          }}>
            Progress Dashboard
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', margin: 0 }}>
            Data-driven insights into your productivity
          </p>
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
            { label: 'Current Streak', value: `${stats.currentStreak} days`, color: '#fbbf24' },
            { label: 'Longest Streak', value: `${stats.longestStreak} days`, color: '#f87171' },
            { label: 'Days Active', value: `${stats.daysActive}/${stats.totalDays}`, color: '#60a5fa' },
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
            </div>
          ))}
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
            Activity Heatmap
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

          {/* Category Breakdown */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
              Category Distribution
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
        </div>

        {/* Status Overview */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
            Task Status Overview
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
  );
};

export default Progress;