interface JointSpineProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 60, md: 100, lg: 160 };

export function JointSpine({ className = "", size = "md" }: JointSpineProps) {
  const s = sizeMap[size];
  return (
    <svg
      viewBox="0 0 80 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-${s} h-auto ${className}`}
      style={{ width: s * 0.4 }}
    >
      {/* Cervical vertebrae */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={`c${i}`} transform={`translate(40, ${12 + i * 8})`}>
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="0.75" />
          <rect x="-2" y="-5" width="4" height="10" rx="1" fill="currentColor" className="text-accent/15" />
        </g>
      ))}
      {/* Thoracic vertebrae */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <g key={`t${i}`} transform={`translate(40, ${60 + i * 7})`}>
          <ellipse cx="0" cy="0" rx="9" ry="4.5" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="0.75" />
          <rect x="-2" y="-6" width="4" height="12" rx="1" fill="currentColor" className="text-accent/15" />
          {/* Spinous processes */}
          <line x1="0" y1="-6" x2="0" y2="-10" stroke="currentColor" strokeWidth="0.75" className="text-accent/25" />
        </g>
      ))}
      {/* Lumbar vertebrae - larger */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={`l${i}`} transform={`translate(40, ${145 + i * 8})`}>
          <ellipse cx="0" cy="0" rx="11" ry="5" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="0.75" />
          <rect x="-2" y="-7" width="4" height="14" rx="1" fill="currentColor" className="text-accent/15" />
        </g>
      ))}
      {/* Sacrum */}
      <path d="M28 188 L52 188 L50 195 L40 198 L30 195 Z" fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}
