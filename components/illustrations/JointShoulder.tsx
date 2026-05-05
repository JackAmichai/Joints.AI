interface JointShoulderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 50, md: 80, lg: 120 };

export function JointShoulder({ className = "", size = "md" }: JointShoulderProps) {
  const s = sizeMap[size];
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto h-auto ${className}`}
      style={{ width: s, height: s }}
    >
      {/* Scapula */}
      <path d="M15 20 Q20 15 40 18 L55 25 Q50 35 45 50 Q40 60 35 65 Q25 65 15 55 Z"
        fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="1" />
      <path d="M20 25 L40 50" stroke="currentColor" strokeWidth="0.5" className="text-accent/20" />
      
      {/* Acromion */}
      <path d="M45 20 Q55 15 65 20 Q68 25 60 30" stroke="currentColor" strokeWidth="1" className="text-accent/25" fill="none" />
      
      {/* Humerus head */}
      <circle cx="65" cy="40" r="18" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="65" cy="40" r="14" fill="currentColor" className="text-accent/10" />
      <circle cx="65" cy="40" r="10" fill="currentColor" className="text-accent/5" />
      
      {/* Joint capsule */}
      <path d="M50 25 Q65 18 80 28 Q85 35 80 45 Q75 55 65 58 Q55 55 48 48 Q42 38 48 28"
        stroke="currentColor" strokeWidth="0.75" className="text-teal/30" fill="none" strokeDasharray="3 2" />
      
      {/* Humerus shaft */}
      <path d="M55 58 L52 105 L60 115 L68 105 L65 58"
        fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="1" />
      <line x1="58" y1="58" x2="58" y2="110" stroke="currentColor" strokeWidth="0.5" className="text-accent/20" />
      
      {/* Clavicle hint */}
      <path d="M10 30 Q30 25 48 22" stroke="currentColor" strokeWidth="1.2" className="text-accent/30" strokeLinecap="round" fill="none" />
      
      {/* Rotator cuff tendons */}
      <path d="M52 35 Q60 28 68 32" stroke="currentColor" strokeWidth="0.5" className="text-accent/25" fill="none" />
      <path d="M48 45 Q55 38 62 40" stroke="currentColor" strokeWidth="0.5" className="text-accent/25" fill="none" />
    </svg>
  );
}
