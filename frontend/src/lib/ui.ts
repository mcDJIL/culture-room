const buttonBase =
  "inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-[11px] text-xs font-bold";

export const primaryButton = `${buttonBase} border-0 bg-brick text-white hover:bg-brick-dark`;

export const secondaryButton = (active = false) =>
  `${buttonBase} border border-ink ${active ? "bg-ink text-white" : "text-ink hover:bg-ink hover:text-white"}`;

export const textAction =
  "inline-flex min-h-11 cursor-pointer items-center border-0 border-b border-current bg-transparent px-0 pt-2 pb-[5px] text-xs font-bold text-brick-dark";

export const eyebrow = "mb-[7px] block text-[10px] font-bold text-brick-dark";

export const surfaceCard = "rounded-lg border border-line bg-paper";

export const avatar =
  "grid size-[42px] shrink-0 place-items-center rounded-full bg-moss font-serif font-bold text-white";

export const pageWrap =
  "mx-auto w-[min(1180px,calc(100%_-_48px))] min-h-[75vh] pt-[70px] pb-[120px] max-[820px]:w-[min(100%_-_36px,700px)] max-[820px]:pt-12 max-[600px]:w-[calc(100%_-_20px)] max-[600px]:pt-[42px] max-[600px]:pb-[90px]";

export const authPage =
  "mx-auto w-[min(560px,calc(100%_-_48px))] min-h-[75vh] pt-[70px] pb-[120px] max-[820px]:w-[min(100%_-_36px,700px)] max-[820px]:pt-12 max-[600px]:w-[calc(100%_-_20px)] max-[600px]:pt-[42px] max-[600px]:pb-[90px]";

export const primaryButtonSmall =
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-sm border-0 bg-brick px-3.5 py-2 text-[11px] font-bold text-white no-underline hover:bg-brick-dark";

export const mobileAuthPrimary =
  "inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-0 bg-brick px-3 py-[11px] text-xs font-bold text-white no-underline hover:bg-brick-dark";

export const mobileAuthSecondary =
  "inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-ink bg-transparent px-3 py-[11px] text-xs font-bold text-ink no-underline hover:bg-ink hover:text-white";

export const navButton =
  "flex min-h-12 min-w-[82px] cursor-pointer flex-col items-center justify-center gap-1 border-b-[3px] border-b-transparent bg-transparent px-2.5 pt-2 pb-1.5 text-[10px] text-muted hover:border-b-brick hover:text-brick aria-[current=page]:border-b-brick aria-[current=page]:text-brick max-[1160px]:min-w-[70px] max-[600px]:min-h-[62px] max-[600px]:min-w-0 max-[600px]:px-0.5 max-[600px]:py-1.5";

export const formClass = "grid gap-[19px] p-7 max-[600px]:p-[21px]";

export const labelClass = "grid gap-2 text-[11px] font-bold";

export const fieldClass =
  "w-full rounded-sm border border-[#8c8274] bg-transparent p-3 text-ink";

export const cardNotice = "mt-[9px] block text-[10px] leading-normal text-muted";

export const tagList = "flex flex-wrap gap-[7px]";

export const tagItem = "rounded-sm border border-line px-2 py-1.5 text-[9px] text-muted";

export const applyPanel = "mt-4 rounded-md bg-[#e9e2d6] p-4";

export const iconButton =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-sm border-0 bg-[#e6ded1]";

export const authError =
  "m-0 rounded-sm bg-[#f4e3de] px-3 py-2.5 text-[11px] leading-normal text-brick-dark";
