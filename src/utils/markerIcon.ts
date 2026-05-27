import { PRIORITY_COLORS } from "../constants/priority";
import type { Priority } from "../types/apartment";

export const getMarkerIcon = (
  priority: Priority | null | undefined
): naver.maps.MarkerIcon => {
  const hasPriority =
    priority != null && priority >= 1 && priority <= 5;
  const bg = hasPriority
    ? PRIORITY_COLORS[priority]
    : PRIORITY_COLORS.default;
  const label = hasPriority ? String(priority) : "·";
  const size = hasPriority ? 34 : 28;
  const fontSize = hasPriority ? 16 : 14;

  return {
    content: `
      <div style="
        width:${size}px;
        height:${size}px;
        background:${bg};
        border:2px solid #fff;
        border-radius:50%;
        color:#fff;
        font-weight:bold;
        font-size:${fontSize}px;
        line-height:${size - 4}px;
        text-align:center;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
        cursor:pointer;
        font-family:sans-serif;
      ">${label}</div>
    `,
    anchor: new naver.maps.Point(size / 2, size / 2),
  };
};
