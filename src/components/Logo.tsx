interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { text: 'text-sm', bolt: 10, gap: 'gap-0.5' },
    md: { text: 'text-lg', bolt: 14, gap: 'gap-0.5' },
    lg: { text: 'text-2xl', bolt: 20, gap: 'gap-1' },
    xl: { text: 'text-3xl', bolt: 26, gap: 'gap-1' },
  };

  const s = sizes[size];

  const gradientStyle = {
    background: 'linear-gradient(135deg, #4ade80, #22c55e, #16a34a)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
  };

  return (
    <div className={`flex items-center ${s.gap}`}>
      {/* I */}
      <span className={`${s.text} font-black tracking-tight`} style={gradientStyle}>
        I
      </span>

      {/* Lightning Bolt SVG */}
      <svg
        width={s.bolt}
        height={s.bolt}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 -mx-0.5"
      >
        <defs>
          <linearGradient id={`bolt-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
        <path
          d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
          fill={`url(#bolt-${size})`}
        />
      </svg>

      {/* S */}
      <span className={`${s.text} font-black tracking-tight`} style={gradientStyle}>
        S
      </span>

      {showText && (
        <span className="text-gray-400 font-normal ml-1" style={{ fontSize: '0.65em' }}>
          Tracker
        </span>
      )}
    </div>
  );
}
