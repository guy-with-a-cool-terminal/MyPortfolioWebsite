// Chart/data colors for the Progress dashboard, derived from the site's own
// "Deep Slate Comfort" theme tokens (src/index.css) rather than an invented palette.
// Validated with the dataviz skill's scripts/validate_palette.js against the card
// surface (#1b1f28, dark mode): lightness band, chroma floor, CVD separation, and
// contrast all pass. Re-validate if any of these change.
//
// Categorical colors are assigned by category NAME (fixed), never by array index.
// A category keeps its color regardless of what's filtered.
export const CATEGORY_COLORS: Record<string, string> = {
  Work: '#0997b3',
  Programming: '#855cd6',
  Personal: '#ea3e94',
  Learning: '#22a06b',
  Admin: '#c47f08',
};

export const CATEGORY_ORDER = ['Work', 'Programming', 'Personal', 'Learning', 'Admin'];

// Status colors are reserved for state (never reused as a 6th categorical color).
// Always paired with an icon + text label in the UI, not color alone.
export const STATUS_COLORS = {
  good: '#22a06b',
  warning: '#e9730c',
  danger: '#e14747',
};

// Sequential ramp for the heatmap (single hue, light->dark = low->high), built from
// the theme's primary cyan (hsl 190). Monotonic lightness by construction.
export const HEATMAP_RAMP = ['#212631', '#146171', '#1c879c', '#23acc7', '#40c3dd'];

// Chart chrome resolved from theme HSL tokens to hex, since recharts needs literal
// color strings (SVG props don't resolve CSS variables).
export const CHART_CHROME = {
  grid: '#252b37', // border
  axisText: '#9da3af', // muted-foreground
  tooltipBg: '#1b1f28', // card
  tooltipBorder: '#252b37', // border
  tooltipText: '#f4f4f6', // foreground
};
