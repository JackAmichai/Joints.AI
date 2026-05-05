interface WaveBackgroundProps {
  color?: string;
  className?: string;
}

export function WaveBackground({ color = "#2F6FEB", className = "" }: WaveBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 md:h-24 opacity-[0.06]">
        <path d="M0,100 Q360,20 720,100 T1440,100" fill="none" stroke={color} strokeWidth="40" />
      </svg>
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute bottom-0 w-full h-12 md:h-20 opacity-[0.04]">
        <path d="M0,120 Q360,40 720,120 T1440,120" fill="none" stroke={color} strokeWidth="25" />
      </svg>
    </div>
  );
}
