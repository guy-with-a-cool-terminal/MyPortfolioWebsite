import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, LabelList, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2 } from 'lucide-react';
import { fetchAllTasks, NotionTask } from '../utils/notionClient';
import { fetchProgressStats } from '../utils/chatClient';
import { computeProgressData, TimeFilter, ProgressData } from '../lib/computeProgressStats';
import { STATS_SOURCE } from '../lib/progressDataSource';
import { CATEGORY_COLORS, STATUS_COLORS, HEATMAP_RAMP, CHART_CHROME } from '../lib/progress-palette';
import { cn } from '../lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const getLocalDateStr = (d?: Date) => {
  const date = d || new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All time' },
];

// A bare number-over-label pair, no card or border. Whitespace between these is what
// separates them, not a box. Reused for every stat group in the left rail.
const Stat: React.FC<{ value: React.ReactNode; label: string; valueColor?: string }> = ({ value, label, valueColor }) => (
  <div>
    <div className="text-3xl font-semibold" style={{ color: valueColor }}>
      {value}
    </div>
    <div className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
  </div>
);

// A fixed 2-column rhythm for the rail, its width is fixed regardless of viewport,
// so a wrapping flex row would reflow unpredictably; a real grid keeps it steady.
const StatGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-7">{children}</div>
);

// A quiet eyebrow label for a rail group, deliberately smaller/lighter than the
// text-xl section headings in the content column, so the page reads as two tiers
// (KPI list vs. analysis) rather than seven identically-weighted headings.
const RailLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</h2>
);

function buildHeatmapWeeks(heatmapData: Record<string, number>) {
  const dates = Object.keys(heatmapData).sort();
  if (!dates.length) return { weeks: [] as (string | null)[][], monthLabels: [] as (string | null)[] };

  // Start from January 1st of the earliest tracked year (not just the first
  // logged day) so the grid always reads left-to-right from the start of the
  // year, with a real "Jan" column instead of picking up mid-month.
  const start = new Date(new Date(dates[0]).getFullYear(), 0, 1);
  start.setDate(start.getDate() - start.getDay()); // back up to the preceding Sunday
  const end = new Date();

  const weeks: (string | null)[][] = [];
  const monthLabels: (string | null)[] = [];
  let week: (string | null)[] = new Array(7).fill(null);
  let monthStartLabelThisWeek: string | null = null;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = getLocalDateStr(d);
    week[d.getDay()] = dateStr;
    // Label a week only once, on the day the month actually starts, not on
    // every day <= 7 (a month starting mid-week would otherwise flag two
    // consecutive week-columns and print e.g. "AprApr").
    if (d.getDate() === 1) monthStartLabelThisWeek = d.toLocaleDateString('en-US', { month: 'short' });

    if (d.getDay() === 6) {
      weeks.push(week);
      monthLabels.push(monthStartLabelThisWeek);
      week = new Array(7).fill(null);
      monthStartLabelThisWeek = null;
    }
  }
  if (week.some((v) => v !== null)) {
    weeks.push(week);
    monthLabels.push(monthStartLabelThisWeek);
  }

  return { weeks, monthLabels };
}

const heatmapColor = (count: number) => {
  if (!count) return HEATMAP_RAMP[0];
  return HEATMAP_RAMP[Math.min(count, HEATMAP_RAMP.length - 1)];
};

const EMPTY_STATS: ProgressData['stats'] = {
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
};

const Progress: React.FC = () => {
  const [tasks, setTasks] = useState<NotionTask[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const [data, setData] = useState<ProgressData>({
    stats: EMPTY_STATS,
    categoryData: [],
    monthlyData: [],
    capacityData: [],
    heatmapData: {},
    velocityData: [],
    capacityWarnings: [],
    trendInsights: [],
    capacityInsight: '',
  });

  const [loading, setLoading] = useState(true); // true only until the first successful load
  const [refreshing, setRefreshing] = useState(false); // true on subsequent filter changes
  const [error, setError] = useState<string | null>(null);
  // Set only in 'local' mode (see progressDataSource.ts) — notion-proxy has no
  // pagination handling, so if Notion's response ever spans more than one page
  // this surfaces that instead of just showing wrong numbers silently.
  const [truncated, setTruncated] = useState(false);
  // A ref, not state: reading it doesn't need to re-trigger the effect below (state
  // would, since flipping it there would refire the effect right after every load and
  // double-fetch on every mount/filter change).
  const hasLoadedRef = React.useRef(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<NotionTask[]>([]);

  // 'worker' mode still needs the raw per-task list for the click-a-heatmap-day
  // detail view even though it doesn't need it for stats. 'local' mode already
  // fetches the same list below (to compute stats from), so fetching it again
  // here would just be a second redundant call to notion-proxy.
  useEffect(() => {
    if (STATS_SOURCE === 'worker') {
      fetchAllTasks().then(({ tasks }) => setTasks(tasks));
    }
  }, []);

  // Stats come from whichever source progressDataSource.ts picks — see that file
  // to switch. Refetching on a filter change never blanks the page: the previous
  // render holds at reduced opacity until the new data arrives, rather than
  // flashing skeletons on every click.
  useEffect(() => {
    let cancelled = false;
    if (hasLoadedRef.current) setRefreshing(true);
    else setLoading(true);
    setError(null);

    const load: Promise<ProgressData> =
      STATS_SOURCE === 'worker'
        ? fetchProgressStats(timeFilter)
        : fetchAllTasks().then(({ tasks: allTasks, truncated: wasTruncated }) => {
            if (!cancelled) {
              setTasks(allTasks);
              setTruncated(wasTruncated);
            }
            return computeProgressData(allTasks, timeFilter);
          });

    load
      .then((next) => {
        if (cancelled) return;
        setData(next);
        hasLoadedRef.current = true;
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load progress data.');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [timeFilter]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedTasks(tasks.filter((t) => (t.completedDate || t.dueDate) === date));
  };

  const { stats, categoryData, monthlyData, capacityData, heatmapData, velocityData, capacityWarnings, trendInsights, capacityInsight } = data;
  const { weeks, monthLabels } = buildHeatmapWeeks(heatmapData);

  if (loading && !hasLoadedRef.current) {
    return (
      <div className="min-h-screen bg-background px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1680px]">
          <div className="mb-14 flex items-center justify-between">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-6 w-56" />
          </div>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[380px_1fr]">
            <div className="grid grid-cols-2 gap-x-6 gap-y-7">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
            <div className="space-y-10">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-72 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1680px] px-6 py-14 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight xl:text-4xl">Progress</h1>
            <p className="mt-2 text-base text-muted-foreground">Connected to Notion, bridging planning and execution.</p>
          </div>
          <div className="flex items-center gap-4">
            {refreshing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <div className="flex items-center gap-6">
              {TIME_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTimeFilter(f.value)}
                  className={cn(
                    'border-b-2 pb-1 text-base font-medium transition-colors',
                    timeFilter === f.value ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="mb-8 text-sm text-destructive">{error}</p>}
        {!error && truncated && (
          <p className="mb-8 text-sm text-muted-foreground">
            Notion has more tasks than this page could fetch in one request. Numbers below may undercount until notion-chat is deployed.
          </p>
        )}

        <div className={cn('grid grid-cols-1 gap-16 transition-opacity lg:grid-cols-[380px_1fr]', refreshing && 'opacity-60')}>
          {/* Left rail: every bare number on the page lives here, in a column
              narrow enough that they never had to fight for width in the first
              place. The wide column to the right is reserved for anything
              spatial (charts, the heatmap). */}
          <aside className="space-y-12">
            <div>
              <RailLabel>Overview</RailLabel>
              <StatGrid>
                <Stat value={stats.total} label="Total tasks" />
                <Stat value={stats.completed} label="Completed" />
                <Stat value={`${stats.completionRate}%`} label="Completion rate" />
                <Stat value={stats.avgTasksPerDay} label="Avg tasks / day" />
              </StatGrid>
            </div>

            {(capacityWarnings.length > 0 || trendInsights.length > 0) && (
              <div className="space-y-4">
                {capacityWarnings.slice(0, 3).map((w, i) => (
                  <div key={`warn-${i}`} className="border-l-2 pl-4 text-sm leading-relaxed" style={{ borderColor: STATUS_COLORS.warning }}>
                    <div className="font-medium">{w.count} tasks due {w.date}.</div>
                    <div className="text-muted-foreground">Your sweet spot is {w.limit}/day. Consider moving {w.count - w.limit}.</div>
                  </div>
                ))}
                {trendInsights.map((ins, i) => (
                  <div
                    key={`trend-${i}`}
                    className="border-l-2 pl-4 text-sm leading-relaxed"
                    style={{ borderColor: ins.severity === 'warning' ? STATUS_COLORS.warning : STATUS_COLORS.good }}
                  >
                    <div className="font-medium">{ins.title}</div>
                    <div className="text-muted-foreground">{ins.description}</div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <RailLabel>Task health</RailLabel>
              <StatGrid>
                <Stat value={stats.tasksOnTime} label="On time" valueColor={STATUS_COLORS.good} />
                <Stat value={stats.tasksPushed} label="Pushed late" valueColor={STATUS_COLORS.warning} />
                <Stat value={`${stats.pushRate}%`} label="Push rate" valueColor={STATUS_COLORS.warning} />
                <Stat value={`${stats.recoveryRate}%`} label="On-time rate" valueColor={STATUS_COLORS.good} />
                <Stat value={stats.averageDelay} label="Avg delay (days)" />
              </StatGrid>
            </div>

            <div>
              <RailLabel>Current status</RailLabel>
              <StatGrid>
                <Stat value={stats.completed} label="Done" valueColor={STATUS_COLORS.good} />
                <Stat value={stats.inProgress} label="In progress" valueColor={CATEGORY_COLORS.Work} />
                <Stat value={stats.notStarted} label="To do" />
              </StatGrid>
            </div>
          </aside>

          {/* Right column: everything spatial. Full width of whatever's left after
              the rail, so it's the one place widening the page actually helps. */}
          <div className="space-y-14">
            <section>
              <h2 className="mb-6 text-xl font-semibold text-foreground">Activity</h2>
              {weeks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No on-time completions logged yet.</p>
              ) : (
                <div className="flex flex-wrap items-start gap-16">
                  <div className="overflow-x-auto">
                    <div className="inline-flex flex-col gap-2">
                      <div className="flex gap-1">
                        {monthLabels.map((label, i) => (
                          <div key={i} className="w-4 text-xs text-muted-foreground">
                            {label || ''}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <div className="mr-1 flex flex-col gap-1 text-xs text-muted-foreground">
                          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                            <div key={i} className="flex h-4 w-8 items-center justify-end">
                              {d}
                            </div>
                          ))}
                        </div>
                        {weeks.map((week, wi) => (
                          <div key={wi} className="flex flex-col gap-1">
                            {week.map((date, di) => (
                              <button
                                key={di}
                                type="button"
                                disabled={!date}
                                onClick={() => date && handleDateClick(date)}
                                title={date ? `${date}: ${heatmapData[date] || 0} on-time task${heatmapData[date] === 1 ? '' : 's'}` : undefined}
                                className={cn(
                                  'h-4 w-4 appearance-none rounded-[3px] border-0 p-0',
                                  date ? 'cursor-pointer' : 'cursor-default'
                                )}
                                style={{
                                  background: date ? heatmapColor(heatmapData[date] || 0) : 'transparent',
                                  border: 'none',
                                  outline: date === selectedDate ? `1.5px solid ${CATEGORY_COLORS.Work}` : 'none',
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="mt-1 flex items-center gap-2 pl-9 text-xs text-muted-foreground">
                        <span>Less</span>
                        {HEATMAP_RAMP.map((c) => (
                          <div key={c} className="h-3 w-3 rounded-[3px]" style={{ background: c }} />
                        ))}
                        <span>More</span>
                      </div>
                    </div>
                  </div>

                  {/* Streaks belong next to the activity that produces them, not
                      restated in the overview rail as a second copy of the same fact. */}
                  <div className="flex gap-12 pt-1">
                    <Stat value={`${stats.currentStreak}d`} label="Current streak" />
                    <Stat value={`${stats.longestStreak}d`} label="Longest streak" />
                  </div>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Completion velocity</h2>
              <p className="mb-6 mt-2 text-sm text-muted-foreground">
                7-day moving average vs. daily count. A downward trend warns of burnout before it's felt.
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={velocityData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={CHART_CHROME.grid} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} width={28} />
                  <Tooltip
                    contentStyle={{ background: CHART_CHROME.tooltipBg, border: `1px solid ${CHART_CHROME.tooltipBorder}`, borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: CHART_CHROME.tooltipText }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13, color: CHART_CHROME.axisText }} />
                  {/* Daily count is texture behind the story, not the story: kept
                      thin and muted so the 7-day average is the one line that reads. */}
                  <Line type="monotone" dataKey="tasks" name="Daily tasks" stroke={CHART_CHROME.axisText} strokeWidth={1} strokeOpacity={0.35} dot={false} />
                  <Line type="monotone" dataKey="avg" name="7-day avg" stroke={CATEGORY_COLORS.Work} strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="grid gap-16 lg:grid-cols-2 xl:gap-24">
              <div>
                <h2 className="mb-6 text-xl font-semibold text-foreground">Tasks by month</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={CHART_CHROME.grid} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} width={28} />
                    <Tooltip
                      contentStyle={{ background: CHART_CHROME.tooltipBg, border: `1px solid ${CHART_CHROME.tooltipBorder}`, borderRadius: 8, fontSize: 13 }}
                      labelStyle={{ color: CHART_CHROME.tooltipText }}
                    />
                    <Bar dataKey="tasks" fill={CATEGORY_COLORS.Work} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground">Capacity</h2>
                {capacityInsight && (
                  <p
                    className="mb-6 mt-2 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: capacityInsight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
                  />
                )}
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={capacityData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={CHART_CHROME.grid} />
                    <XAxis dataKey="taskCount" axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} width={28} />
                    <Tooltip
                      contentStyle={{ background: CHART_CHROME.tooltipBg, border: `1px solid ${CHART_CHROME.tooltipBorder}`, borderRadius: 8, fontSize: 13 }}
                      labelStyle={{ color: CHART_CHROME.tooltipText }}
                    />
                    <Bar dataKey="days" name="Days at this load" fill={CATEGORY_COLORS.Learning} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-xl font-semibold text-foreground">Categories</h2>
              <ResponsiveContainer width="100%" height={Math.max(180, categoryData.length * 56)}>
                <BarChart
                  data={[...categoryData].sort((a, b) => b.completed - a.completed)}
                  layout="vertical"
                  margin={{ top: 4, right: 40, left: 8, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} stroke={CHART_CHROME.grid} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: CHART_CHROME.axisText, fontSize: 13 }} width={100} />
                  <Tooltip
                    cursor={{ fill: CHART_CHROME.grid, opacity: 0.4 }}
                    contentStyle={{ background: CHART_CHROME.tooltipBg, border: `1px solid ${CHART_CHROME.tooltipBorder}`, borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: CHART_CHROME.tooltipText }}
                    formatter={(value: number, _name, item) => [`${value} completed, ${item.payload.incomplete} incomplete`, '']}
                  />
                  <Bar dataKey="completed" radius={[0, 4, 4, 0]} barSize={28}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                    <LabelList dataKey="completed" position="right" fill={CHART_CHROME.axisText} fontSize={13} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDate}</DialogTitle>
          </DialogHeader>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks recorded for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium">{task.task}</div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: CATEGORY_COLORS[task.category] || CHART_CHROME.axisText }} />
                        {task.category}
                      </span>
                      <span>·</span>
                      <span>{task.status}</span>
                    </div>
                  </div>
                  {task.status === 'Completed' && (
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px]"
                      style={{
                        borderColor: task.completedDate === task.dueDate ? STATUS_COLORS.good : STATUS_COLORS.warning,
                        color: task.completedDate === task.dueDate ? STATUS_COLORS.good : STATUS_COLORS.warning,
                      }}
                    >
                      {task.completedDate === task.dueDate ? 'On time' : 'Pushed'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Progress;
