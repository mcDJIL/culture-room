import { Icon } from "@/components/Icon";
import { surfaceCard } from "@/lib/ui";
import type { IconName } from "@/types";

export function DataState({
  action,
  alert = false,
  icon,
  text,
  title,
}: {
  action?: React.ReactNode;
  alert?: boolean;
  icon: IconName;
  text: string;
  title: string;
}) {
  return (
    <div className={`${surfaceCard} grid min-h-[300px] content-center place-items-center gap-2.5 p-8 text-center`} role={alert ? "alert" : "status"}>
      <Icon name={icon} size={30} />
      <h2 className="mt-2 font-serif text-[27px]">{title}</h2>
      <p className="mb-2 max-w-[440px] text-[12px] leading-[1.7] text-muted">{text}</p>
      {action}
    </div>
  );
}
