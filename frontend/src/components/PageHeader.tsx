import type { ReactNode } from "react";
import { eyebrow as eyebrowClass } from "@/lib/ui";

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
    <header className="relative mb-[54px] flex items-end justify-between gap-[50px] rounded-lg border border-[rgba(156,61,42,.16)] bg-[rgba(248,245,238,.88)] px-7 pt-6 pb-[26px] shadow-[0_12px_35px_rgba(58,45,33,.05)] before:absolute before:top-0 before:right-7 before:left-7 before:h-[5px] before:rounded-b-[5px] before:bg-[repeating-linear-gradient(90deg,var(--color-brick)_0_14px,transparent_14px_21px,var(--color-moss)_21px_35px,transparent_35px_42px)] before:opacity-[.62] before:content-[''] max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-[25px] max-[600px]:px-[18px] max-[600px]:py-[22px]">
      <div className="max-w-[790px]">
        <span className={eyebrowClass}>{eyebrow}</span>
        <h1 className="mt-2 mb-[18px] font-serif text-[clamp(38px,5vw,66px)] leading-none tracking-[-.035em] max-[600px]:text-[40px]">
          {title}
        </h1>
        <p className="mb-0 max-w-[700px] text-[15px] leading-[1.75] text-muted">{text}</p>
      </div>
      {action}
    </header>
  );
}
