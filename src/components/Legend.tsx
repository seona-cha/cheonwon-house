import { LEGEND_ITEMS } from "../constants/priority";
import "./Legend.scss";

export const Legend = () => (
  <aside className="legend" aria-label="우선순위 범례">
    <h3>방문 우선순위</h3>
    {LEGEND_ITEMS.map((item) => (
      <div className="legend-item" key={item.label}>
        <span
          className="legend-dot"
          style={{ background: item.color }}
        >
          {item.level ?? "·"}
        </span>
        {item.label}
      </div>
    ))}
  </aside>
);
