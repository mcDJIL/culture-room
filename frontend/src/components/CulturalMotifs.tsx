type Motif = "wayang" | "batik" | "keris" | "lancang" | "mandau" | "sampan";

export function CulturalMark({
  className = "",
  type,
}: {
  className?: string;
  type: Motif;
}) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 80 80">
      {type === "batik" && (
        <g fill="currentColor">
          <path d="M40 8c13 8 18 18 0 32C22 26 27 16 40 8Z" />
          <path d="M72 40c-8 13-18 18-32 0 14-18 24-13 32 0Z" />
          <path d="M40 72c-13-8-18-18 0-32 18 14 13 24 0 32Z" />
          <path d="M8 40c8-13 18-18 32 0-14 18-24 13-32 0Z" />
          <circle cx="40" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
        </g>
      )}
      {type === "wayang" && (
        <g fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M31 14 40 3l5 10 10-3-5 11c7 4 7 11 2 16l-8 5-3 13-15 18 7-26-7-8c-7-8-3-21 5-25Z" />
          <path d="m50 25 18 5-15 5" strokeWidth="3" />
          <path d="m36 45-18 10-8 17m32-25 14 12 12 11" fill="none" strokeWidth="3" />
          <circle cx="18" cy="55" r="3" />
          <circle cx="56" cy="59" r="3" />
        </g>
      )}
      {type === "keris" && (
        <g fill="currentColor">
          <path d="M39 5c10 9-8 15 2 24 10 8-8 14 1 22 7 7-2 13-2 20h-7c0-8 8-14 0-22-9-9 8-14-1-22-9-9 8-15 0-22Z" />
          <path d="M22 67h30l-5 7H27Z" />
          <path d="m35 73 9 2-8 3-8-2Z" />
        </g>
      )}
      {type === "lancang" && (
        <g fill="currentColor" stroke="currentColor" strokeLinecap="round">
          <path d="M8 55c15 4 42 4 64-3L61 66H20Z" />
          <path d="M12 54 5 46l13 5m45 2 12-10-5 13" fill="none" strokeWidth="3" />
          <path d="M36 18v35M55 27v26" fill="none" strokeWidth="3" />
          <path d="M34 20 17 44h17Zm4 2 15 25H39Zm19 7 11 17H57Z" />
          <path d="M18 70h45" fill="none" strokeWidth="3" />
        </g>
      )}
      {type === "mandau" && (
        <g fill="currentColor">
          <path d="M15 58C30 50 50 30 66 8l5 5C58 37 41 56 22 65Z" />
          <path d="m12 55 14 13-7 8L5 63Z" />
          <path d="m10 61-6 8 10 7 5-7Z" />
          <path d="m59 15 8-4-4 9Z" />
        </g>
      )}
      {type === "sampan" && (
        <g fill="currentColor" stroke="currentColor" strokeLinecap="round">
          <path d="M8 48c18 6 43 6 64-1L61 60H20Z" />
          <path d="m11 47-5-8 12 7m45 2 12-9-5 11" fill="none" strokeWidth="3" />
          <path d="m35 18 9 31" fill="none" strokeWidth="4" />
          <path d="m31 14 7-2 5 8-9 3Z" />
          <path d="M18 65h44" fill="none" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}

export function CulturalBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <CulturalMark
        className="absolute top-[22%] -left-[42px] w-[190px] -rotate-[5deg] text-brick opacity-[.055] max-[820px]:-left-20 max-[600px]:opacity-[.035]"
        type="wayang"
      />
      <CulturalMark
        className="absolute top-[12%] right-[2%] w-[120px] rotate-[13deg] text-brick opacity-[.055] max-[820px]:-right-[35px] max-[600px]:opacity-[.035]"
        type="keris"
      />
      <CulturalMark
        className="absolute right-[5%] bottom-[4%] w-[250px] text-moss opacity-[.055] max-[600px]:-right-[70px] max-[600px]:w-[210px] max-[600px]:opacity-[.035]"
        type="lancang"
      />
      <CulturalMark
        className="absolute top-[58%] left-[3%] w-[140px] -rotate-[13deg] text-moss opacity-[.055] max-[820px]:hidden max-[600px]:opacity-[.035]"
        type="mandau"
      />
      <CulturalMark
        className="absolute right-[30%] bottom-[1%] w-[180px] text-brick opacity-[.055] max-[600px]:opacity-[.035]"
        type="sampan"
      />
    </div>
  );
}

export function MotifRibbon() {
  const motifs: Motif[] = ["wayang", "batik", "keris", "lancang", "mandau", "sampan"];
  return (
    <div
      aria-hidden="true"
      className="relative z-[2] flex h-[52px] items-center justify-center gap-[clamp(12px,2.5vw,34px)] border-b border-line bg-[#e8dece] bg-[linear-gradient(45deg,rgba(156,61,42,.04)_25%,transparent_25%,transparent_75%,rgba(156,61,42,.04)_75%)] bg-[length:18px_18px] px-5 py-1.5 text-brick-dark max-[600px]:h-[42px] max-[600px]:gap-[9px] max-[600px]:p-[4px_10px]"
    >
      <span className="h-px w-[min(180px,12vw)] bg-current opacity-35 max-[600px]:w-[18px]" />
      {motifs.map((motif, index) => (
        <CulturalMark
          className={`size-[34px] opacity-[.82] max-[600px]:size-[27px] ${index >= 4 ? "max-[600px]:hidden" : ""}`}
          key={motif}
          type={motif}
        />
      ))}
      <span className="h-px w-[min(180px,12vw)] bg-current opacity-35 max-[600px]:w-[18px]" />
    </div>
  );
}
