import { Icon } from "@/components/Icon";
import { navButton } from "@/lib/ui";
import type { IconName, View } from "@/types";

export function NavButton({
  current,
  icon,
  label,
  onClick,
  view,
}: {
  current: View;
  icon: IconName;
  label: string;
  onClick: () => void;
  view: View;
}) {
  return (
    <button
      aria-current={current === view ? "page" : undefined}
      className={navButton}
      onClick={onClick}
      type="button"
    >
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  );
}
