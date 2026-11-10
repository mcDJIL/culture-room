import type { ReactNode } from "react";

export function PageHeader({
  action,
  eyebrow,
  text,
  title,
}: {
  action?: ReactNode;
  eyebrow: string;
  text: string;
  title: string;
}) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </header>
  );
}
