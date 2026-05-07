"use client";

export function SawBladeAnimation({ color = "#f97316" }: { color?: string }) {
  const teeth = 48;
  const outerR = 92;
  const toothTip = 96;
  const toothBase = 85;
  const bodyR = 82;
  const innerR = 35;
  const holeR = 14;

  return (
    <div className="relative w-64 h-64 lg:w-80 lg:h-80">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full animate-[spin_12s_linear_infinite] drop-shadow-[0_0_40px_rgba(234,88,12,0.15)]"
      >
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4d4d8" />
            <stop offset="30%" stopColor="#a1a1aa" />
            <stop offset="60%" stopColor="#71717a" />
            <stop offset="100%" stopColor="#52525b" />
          </linearGradient>
          <linearGradient id="metalGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4e4e7" />
            <stop offset="50%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="#71717a" />
          </linearGradient>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="70%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </radialGradient>
          <linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#78716c" />
          </linearGradient>
          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="1" dy="1" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feFlood floodColor="#000" floodOpacity="0.3" />
            <feComposite in2="SourceGraphic" operator="in" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>

        {/* Main body plate */}
        <circle cx="100" cy="100" r={bodyR} fill="url(#metalGrad)" />

        {/* Circular brush marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const r = 45 + i * 3;
          return (
            <circle
              key={`ring-${i}`}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Expansion slots */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i * 90 + 20) * Math.PI / 180;
          const x1 = 100 + 40 * Math.cos(angle);
          const y1 = 100 + 40 * Math.sin(angle);
          const x2 = 100 + 68 * Math.cos(angle);
          const y2 = 100 + 68 * Math.sin(angle);
          return (
            <line
              key={`slot-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#3f3f46"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          );
        })}

        {/* Cooling holes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 + 10) * Math.PI / 180;
          const cx = 100 + 55 * Math.cos(angle);
          const cy = 100 + 55 * Math.sin(angle);
          return (
            <circle
              key={`hole-${i}`}
              cx={cx}
              cy={cy}
              r="4"
              fill="#27272a"
              stroke="#3f3f46"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Teeth — realistic carbide tips */}
        {Array.from({ length: teeth }).map((_, i) => {
          const angle = (i * (360 / teeth)) * Math.PI / 180;
          const nextAngle = ((i * (360 / teeth)) + (360 / teeth) * 0.4) * Math.PI / 180;

          const bx1 = 100 + toothBase * Math.cos(angle - 0.02);
          const by1 = 100 + toothBase * Math.sin(angle - 0.02);
          const tx = 100 + toothTip * Math.cos(angle);
          const ty = 100 + toothTip * Math.sin(angle);
          const bx2 = 100 + toothBase * Math.cos(nextAngle);
          const by2 = 100 + toothBase * Math.sin(nextAngle);

          return (
            <polygon
              key={`tooth-${i}`}
              points={`${bx1},${by1} ${tx},${ty} ${bx2},${by2}`}
              fill="url(#toothGrad)"
            />
          );
        })}

        {/* Outer rim */}
        <circle cx="100" cy="100" r={outerR} fill="none" stroke="#52525b" strokeWidth="1" />

        {/* Center plate */}
        <circle cx="100" cy="100" r={innerR} fill="url(#centerGrad)" filter="url(#innerShadow)" />
        <circle cx="100" cy="100" r={innerR} fill="none" stroke="#52525b" strokeWidth="1.5" />

        {/* Pin holes */}
        {Array.from({ length: 2 }).map((_, i) => {
          const angle = (i * 180) * Math.PI / 180;
          const cx = 100 + 24 * Math.cos(angle);
          const cy = 100 + 24 * Math.sin(angle);
          return (
            <circle key={`pin-${i}`} cx={cx} cy={cy} r="2.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
          );
        })}

        {/* Center bore */}
        <circle cx="100" cy="100" r={holeR} fill="#0f0f0f" />
        <circle cx="100" cy="100" r={holeR} fill="none" stroke="#3f3f46" strokeWidth="1.5" />

        {/* Highlight reflection */}
        <ellipse cx="75" cy="75" rx="25" ry="20" fill="white" opacity="0.04" transform="rotate(-30 75 75)" />
      </svg>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-3xl -z-10"
        style={{ background: `radial-gradient(circle, ${color}33 0%, transparent 70%)` }}
      />
    </div>
  );
}
