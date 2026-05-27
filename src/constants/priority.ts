import type { Priority } from "../types/apartment";

export const PRIORITY_STORAGE_KEY = "cheonwon-apartment-priorities-v2";

export const PRIORITY_COLORS: Record<Priority | "default", string> = {
  1: "#c62828",
  2: "#ef6c00",
  3: "#f9a825",
  4: "#1565c0",
  5: "#6a1b9a",
  default: "#757575",
};

export const PRIORITY_LEVELS: Priority[] = [1, 2, 3, 4, 5];

export const LEGEND_ITEMS = [
  { level: 1, label: "1순위 (최우선)", color: PRIORITY_COLORS[1] },
  { level: 2, label: "2순위", color: PRIORITY_COLORS[2] },
  { level: 3, label: "3순위", color: PRIORITY_COLORS[3] },
  { level: 4, label: "4순위", color: PRIORITY_COLORS[4] },
  { level: 5, label: "5순위", color: PRIORITY_COLORS[5] },
  { level: null, label: "미지정", color: PRIORITY_COLORS.default },
] as const;
