type OrderStatus = string;

const STATUS_COPY: Record<string, { label: string; subtitle: string }> = {
  pending: {
    label: "Waiting for the kitchen",
    subtitle: "Waiting for the kitchen",
  },
  preparing: {
    label: "Cooking",
    subtitle: "Your food is on the stove",
  },
  ready: {
    label: "Ready for pickup",
    subtitle: "Come grab it while it's hot",
  },
  completed: {
    label: "Order complete",
    subtitle: "Enjoy your meal",
  },
  cancelled: {
    label: "Order cancelled",
    subtitle: "We’re sorry this order was cancelled",
  },
};

function normalizeStatus(status?: OrderStatus) {
  const value = (status || "").toLowerCase();
  if (value === "waiting") return "pending";
  if (value === "done" || value === "finished") return "completed";
  return value;
}

export function OrderStatusMascot({ status }: { status?: OrderStatus }) {
  const normalized = normalizeStatus(status);
  const copy = STATUS_COPY[normalized] || STATUS_COPY.pending;
  const isPending = normalized === "pending";
  const isPreparing = normalized === "preparing";
  const isReady = normalized === "ready";
  const isCompleted = normalized === "completed";

  return (
    <div className="w-full rounded-[28px] border border-border/70 bg-card/90 p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Order status</p>
          <h3 className="text-lg font-semibold text-foreground">{copy.label}</h3>
          <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>
        <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Live
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-border/70 bg-background/80 p-3 sm:p-4">
        <svg viewBox="0 0 320 260" className="mx-auto w-full max-w-[320px]" role="img" aria-label={`${copy.label} mascot`}>
          <ellipse cx="160" cy="220" rx="64" ry="16" fill="var(--color-foreground)" opacity="0.08" />

          <g className={isPending ? "opacity-100 transition-opacity duration-300" : "opacity-0 pointer-events-none transition-opacity duration-300"}>
            <g className="mascot-bob" style={{ transformOrigin: "160px 160px" }}>
              <ellipse cx="160" cy="214" rx="44" ry="12" fill="var(--color-foreground)" opacity="0.08" />
              <circle cx="160" cy="104" r="42" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <ellipse cx="160" cy="96" rx="34" ry="32" fill="var(--color-background)" />
              <path d="M120 92c8-18 36-24 56-16 10 4 16 12 15 24-14-8-30-8-47-2-10 4-18 10-24 18" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="122" y="70" width="76" height="24" rx="12" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="132" y="58" width="56" height="18" rx="9" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="136" y="82" width="48" height="10" rx="5" fill="var(--color-primary)" opacity="0.2" />
              <circle cx="145" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="177" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="143" cy="104" r="1.6" fill="var(--color-card)" />
              <circle cx="175" cy="104" r="1.6" fill="var(--color-card)" />
              <path d="M142 119c8 5 16 5 24 0" stroke="var(--color-foreground)" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="136" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <circle cx="184" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <rect x="120" y="170" width="80" height="56" rx="24" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <path d="M136 182c8-10 24-10 32 0" stroke="var(--color-foreground)" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M132 188c8-8 24-8 32 0" stroke="var(--color-foreground)" strokeWidth="2.8" strokeLinecap="round" />
              <rect x="98" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="96" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="198" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="222" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <g className="mascot-tap" style={{ transformOrigin: "156px 220px" }}>
                <rect x="142" y="208" width="24" height="34" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <circle cx="154" cy="242" r="8" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              </g>
              <g className="mascot-glance" style={{ transformOrigin: "160px 106px" }}>
                <path d="M140 104h9" stroke="var(--color-foreground)" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M171 104h9" stroke="var(--color-foreground)" strokeWidth="2.4" strokeLinecap="round" />
              </g>
              <g className="mascot-clock" style={{ transformOrigin: "246px 84px" }}>
                <circle cx="246" cy="84" r="20" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3" />
                <path d="M246 68v16" stroke="var(--color-foreground)" strokeWidth="2.6" strokeLinecap="round" />
                <path className="mascot-clock-hand" d="M246 84l8 6" stroke="var(--color-foreground)" strokeWidth="2.6" strokeLinecap="round" />
              </g>
            </g>
          </g>

          <g className={isPreparing ? "opacity-100 transition-opacity duration-300" : "opacity-0 pointer-events-none transition-opacity duration-300"}>
            <g className="mascot-bob" style={{ transformOrigin: "160px 160px" }}>
              <ellipse cx="160" cy="214" rx="44" ry="12" fill="var(--color-foreground)" opacity="0.08" />
              <circle cx="160" cy="104" r="42" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <ellipse cx="160" cy="96" rx="34" ry="32" fill="var(--color-background)" />
              <path d="M124 92c7-18 41-24 58-14 12 7 14 20 10 28-12-8-24-10-38-7-9 2-17 5-30 7" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="122" y="70" width="76" height="24" rx="12" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="132" y="58" width="56" height="18" rx="9" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="145" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="177" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="143" cy="104" r="1.6" fill="var(--color-card)" />
              <circle cx="175" cy="104" r="1.6" fill="var(--color-card)" />
              <path d="M142 119c8 5 16 5 24 0" stroke="var(--color-foreground)" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="136" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <circle cx="184" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <rect x="120" y="170" width="80" height="58" rx="24" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <path d="M138 184h44" stroke="var(--color-foreground)" strokeWidth="3" strokeLinecap="round" />
              <g className="mascot-lean" style={{ transformOrigin: "160px 180px" }}>
                <rect x="104" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <circle cx="94" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <g className="mascot-stir" style={{ transformOrigin: "132px 184px" }}>
                  <rect x="116" y="168" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                  <circle cx="128" cy="212" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                </g>
              </g>
              <rect x="194" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="226" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="208" y="150" width="56" height="38" rx="16" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <path d="M220 158h32" stroke="var(--color-foreground)" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M222 166h28" stroke="var(--color-foreground)" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M230 176c6 4 10 8 10 16" stroke="var(--color-foreground)" strokeWidth="2.8" strokeLinecap="round" />
              <g className="mascot-steam" style={{ transformOrigin: "224px 144px" }}>
                <path d="M214 140c4-10 10-16 20-16" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
                <path d="M224 140c6-12 12-18 20-18" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
              </g>
            </g>
          </g>

          <g className={isReady ? "opacity-100 transition-opacity duration-300" : "opacity-0 pointer-events-none transition-opacity duration-300"}>
            <g className="mascot-bob" style={{ transformOrigin: "160px 160px" }}>
              <ellipse cx="160" cy="214" rx="44" ry="12" fill="var(--color-foreground)" opacity="0.08" />
              <circle cx="160" cy="104" r="42" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <ellipse cx="160" cy="96" rx="34" ry="32" fill="var(--color-background)" />
              <path d="M124 92c8-18 40-24 56-14 11 7 16 20 12 30-14-8-30-10-46-6-8 2-14 6-22 10" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="122" y="70" width="76" height="24" rx="12" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="132" y="58" width="56" height="18" rx="9" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="145" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="177" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="143" cy="104" r="1.6" fill="var(--color-card)" />
              <circle cx="175" cy="104" r="1.6" fill="var(--color-card)" />
              <g className="mascot-chomp" style={{ transformOrigin: "160px 119px" }}>
                <path d="M142 119c10 8 16 8 26 0" stroke="var(--color-foreground)" strokeWidth="2.6" strokeLinecap="round" />
              </g>
              <circle cx="136" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <circle cx="184" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <rect x="120" y="170" width="80" height="58" rx="24" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <path d="M138 184h44" stroke="var(--color-foreground)" strokeWidth="3" strokeLinecap="round" />
              <rect x="100" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="90" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="196" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="220" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <g className="mascot-eat" style={{ transformOrigin: "136px 200px" }}>
                <rect x="84" y="160" width="54" height="38" rx="14" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <rect x="100" y="174" width="24" height="10" rx="5" fill="var(--color-primary)" />
                <g className="mascot-sparkle" style={{ transformOrigin: "128px 172px" }}>
                  <circle cx="128" cy="172" r="8" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="2.4" />
                  <path d="M128 164v16M120 172h16" stroke="var(--color-foreground)" strokeWidth="2.2" strokeLinecap="round" />
                </g>
                <g className="mascot-eat-arm" style={{ transformOrigin: "110px 190px" }}>
                  <rect x="98" y="174" width="24" height="30" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                  <circle cx="110" cy="204" r="8" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                  <rect x="102" y="170" width="18" height="16" rx="8" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                </g>
              </g>
              <g className="mascot-cheek" style={{ transformOrigin: "160px 126px" }}>
                <circle cx="132" cy="128" r="6" fill="var(--color-primary)" opacity="0.16" />
                <circle cx="190" cy="128" r="6" fill="var(--color-primary)" opacity="0.16" />
              </g>
              <g className="mascot-sparkle" style={{ transformOrigin: "232px 138px" }}>
                <path d="M232 124l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8Z" fill="var(--color-primary)" />
              </g>
            </g>
          </g>

          <g className={isCompleted ? "opacity-100 transition-opacity duration-300" : "opacity-0 pointer-events-none transition-opacity duration-300"}>
            <g className="mascot-goodbye" style={{ transformOrigin: "160px 180px" }}>
              <ellipse cx="160" cy="214" rx="44" ry="12" fill="var(--color-foreground)" opacity="0.08" />
              <circle cx="160" cy="104" r="42" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <ellipse cx="160" cy="96" rx="34" ry="32" fill="var(--color-background)" />
              <path d="M124 92c8-18 38-24 58-14 10 6 14 16 12 24-12-8-28-10-44-8-8 1-16 6-26 10" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="122" y="70" width="76" height="24" rx="12" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <rect x="132" y="58" width="56" height="18" rx="9" fill="var(--color-background)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="145" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="177" cy="106" r="5" fill="var(--color-foreground)" />
              <circle cx="143" cy="104" r="1.6" fill="var(--color-card)" />
              <circle cx="175" cy="104" r="1.6" fill="var(--color-card)" />
              <path d="M142 119c8 5 16 5 24 0" stroke="var(--color-foreground)" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="136" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <circle cx="184" cy="126" r="7" fill="var(--color-primary)" opacity="0.16" />
              <rect x="120" y="170" width="80" height="58" rx="24" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <path d="M138 184h44" stroke="var(--color-foreground)" strokeWidth="3" strokeLinecap="round" />
              <g className="mascot-wave" style={{ transformOrigin: "108px 190px" }}>
                <rect x="96" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <circle cx="88" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              </g>
              <g className="mascot-walk" style={{ transformOrigin: "160px 216px" }}>
                <rect x="112" y="208" width="24" height="38" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <circle cx="124" cy="246" r="8" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <rect x="184" y="208" width="24" height="38" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
                <circle cx="196" cy="246" r="8" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              </g>
              <rect x="196" y="176" width="24" height="44" rx="12" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3.5" />
              <circle cx="220" cy="198" r="9" fill="var(--color-card)" stroke="var(--color-foreground)" strokeWidth="3.5" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
