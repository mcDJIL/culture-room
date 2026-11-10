import { Icon } from "@/components/Icon";
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
    <button aria-current={current === view ? "page" : undefined} onClick={onClick} type="button">
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  );
}
