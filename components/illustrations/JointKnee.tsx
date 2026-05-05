interface JointKneeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 50, md: 80, lg: 120 };

export function JointKnee({ className = "", size = "md" }: JointKneeProps) {
  const s = sizeMap[size];
  return (
    <svg
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto h-auto ${className}`}
      style={{ width: s, height: s * 1.4 }}
    >
      {/* Femur (upper bone) */}
      <path d="M50 5 L42 5 L38 55 Q35 60 40 65 L40 68" fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="1.2" />
      <path d="M50 5 L58 5 L62 55 Q65 60 60 65 L60 68" fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="1.2" />
      {/* Femoral condyles */}
      <ellipse cx="40" cy="70" rx="10" ry="8" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="60" cy="70" rx="10" ry="8" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="1" />
      
      {/* Cartilage / joint space */}
      <ellipse cx="40" cy="78" rx="8" ry="3" className="fill-teal/20" stroke="currentColor" strokeWidth="0.5" />
      <ellipse cx="60" cy="78" rx="8" ry="3" className="fill-teal/20" stroke="currentColor" strokeWidth="0.5" />
      
      {/* Patella */}
      <ellipse cx="50" cy="65" rx="7" ry="9" fill="currentColor" className="text-accent/25" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="50" cy="65" rx="5" ry="7" fill="currentColor" className="text-accent/10" />
      
      {/* Tibia (lower bone) */}
      <path d="M42 82 L40 135 L52 135 L55 82 Q50 78 42 82 Z" fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="50" cy="82" rx="8" ry="4" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="0.75" />
      
      {/* Ligaments */}
      <line x1="42" y1="68" x2="44" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" className="text-accent/30" />
      <line x1="58" y1="68" x2="56" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" className="text-accent/30" />
      
      {/* Meniscus hint */}
      <path d="M42 78 Q50 82 58 78" stroke="currentColor" strokeWidth="0.75" className="text-teal/40" fill="none" />
    </svg>
  );
}
