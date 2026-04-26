"use client";

interface AnatomicalBackgroundProps {
  variant?: "skeleton" | "spine" | "joints";
  className?: string;
}

export function AnatomicalBackground({
  variant = "skeleton",
  className = ""
}: AnatomicalBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute w-full h-full opacity-[0.08]"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {variant === "skeleton" && (
          <g transform="translate(100, 50)">
            {/* Skull */}
            <ellipse cx="100" cy="40" rx="35" ry="42" fill="currentColor" className="text-accent" />
            {/* Spine */}
            <path
              d="M100 82 L100 280"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-accent"
            />
            {/* Ribs */}
            <path d="M100 110 L60 140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 110 L140 140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 145 L55 175" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 145 L145 175" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 180 L60 200" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 180 L140 200" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            {/* Pelvis */}
            <path d="M70 220 Q100 240 130 220" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" className="text-accent" />
            {/* Arms */}
            <path d="M60 140 L30 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M140 140 L170 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            {/* Legs */}
            <path d="M80 250 L70 350 L60 450" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-accent" />
            <path d="M120 250 L130 350 L140 450" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-accent" />
          </g>
        )}
        {variant === "spine" && (
          <g transform="translate(160, 80)">
            {/* Vertebrae stack */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((y, i) => (
              <g key={i} transform={`translate(0, ${y})`}>
                <ellipse cx="40" cy="0" rx="25" ry="8" fill="currentColor" className="text-accent" />
                <rect x="35" y="-12" width="10" height="24" rx="2" fill="currentColor" className="text-accent" />
              </g>
            ))}
          </g>
        )}
        {variant === "joints" && (
          <g transform="translate(120, 150)">
            {/* Shoulder joints */}
            <circle cx="0" cy="0" r="15" fill="currentColor" className="text-accent" />
            <circle cx="160" cy="0" r="15" fill="currentColor" className="text-accent" />
            {/* Hip joints */}
            <circle cx="40" cy="200" r="18" fill="currentColor" className="text-accent" />
            <circle cx="120" cy="200" r="18" fill="currentColor" className="text-accent" />
            {/* Knee joints */}
            <circle cx="35" cy="300" r="12" fill="currentColor" className="text-accent" />
            <circle cx="125" cy="300" r="12" fill="currentColor" className="text-accent" />
          </g>
        )}
      </svg>
    </div>
  );
}