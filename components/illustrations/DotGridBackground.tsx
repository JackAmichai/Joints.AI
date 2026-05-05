interface DotGridBackgroundProps {
  spacing?: number;
  dotSize?: number;
  color?: string;
  className?: string;
}

export function DotGridBackground({ spacing = 24, dotSize = 1.5, color = "#2F6FEB", className = "" }: DotGridBackgroundProps) {
  const patternId = `dot-grid-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        <defs>
          <pattern id={patternId} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
            <circle cx={spacing / 2} cy={spacing / 2} r={dotSize} fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
