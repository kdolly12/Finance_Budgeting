import type { ReactNode } from "react"; // use 'import type' in TS 4.5+

import "./Panel.css";

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Panel({ title, children, className }: PanelProps) {
  return (
    <div className={`panel ${className || ""}`}>
      {title && <h2 className="panel-title">{title}</h2>}
      <div className="panel-content">{children}</div>
    </div>
  );
}
