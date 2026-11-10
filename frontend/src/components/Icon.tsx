import type { ReactNode } from "react";
import type { IconName } from "@/types";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    archive: <path d="M5 8h14v11H5zM4 5h16v3H4zm5 7h6" />,
    bookmark: <path d="M7 4h10v16l-5-3-5 3z" />,
    briefcase: <path d="M4 8h16v11H4zm5 0V5h6v3m-11 5h16" />,
    calendar: <path d="M5 7h14v12H5zM8 4v6m8-6v6M5 11h14" />,
    check: <path d="m5 12 4 4 10-10" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    comment: <path d="M5 5h14v11H9l-4 3z" />,
    home: <path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4z" />,
    image: <path d="M4 5h16v14H4zm2 11 4-4 3 3 2-2 3 3M15 9h.01" />,
    like: <path d="M8 20H4V9h4m0 11h8.5l3-7.5A2.5 2.5 0 0 0 17 9h-4l1-5c-3 0-5 4-6 6z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    network: <path d="M12 5v5m0 0-5 4m5-4 5 4M5 14v5h4v-5zm10 0v5h4v-5zM10 3h4v4h-4z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <path d="M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm5-1.5L20 20" />,
    users: <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 9c.4-4.3 2.4-7 6-7s5.6 2.7 6 7m1-9a3.5 3.5 0 0 0 0-7m0 9c3 .2 4.6 2.5 5 6" />,
  };

  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      {paths[name]}
    </svg>
  );
}
