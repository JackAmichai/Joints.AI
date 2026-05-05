interface JointHipProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 50, md: 80, lg: 120 };

export function JointHip({ className = "", size = "md" }: JointHipProps) {
  const s = sizeMap[size];
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-auto h-auto ${className}`}
      style={{ width: s, height: s }}
    >
      {/* Ilium */}
      <path d="M15 25 Q30 15 60 18 Q75 20 80 35 L75 55 Q65 50 50 50 Q35 50 25 55 L18 45 Z"
        fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="1" />
      
      {/* Acetabulum (socket) */}
      <circle cx="50" cy="55" r="14" fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="55" r="10" className="fill-teal/15" stroke="currentColor" strokeWidth="0.5" />
      
      {/* Cartilage ring */}
      <path d="M38 48 Q50 40 62 48" stroke="currentColor" strokeWidth="0.75" className="text-teal/30" fill="none" />
      <path d="M38 62 Q50 70 62 62" stroke="currentColor" strokeWidth="0.75" className="text-teal/30" fill="none" />
      
      {/* Femoral head */}
      <circle cx="50" cy="55" r="10" fill="currentColor" className="text-accent/25" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="55" r="6" fill="currentColor" className="text-accent/10" />
      
      {/* Femoral neck */}
      <path d="M42 63 L38 72 Q37 78 40 80 L45 82 L55 82 L60 80 Q63 78 62 72 L58 63"
        fill="currentColor" className="text-accent/15" stroke="currentColor" strokeWidth="0.75" />
      
      {/* Femur shaft */}
      <path d="M42 80 L38 115 L50 118 L62 115 L58 80"
        fill="currentColor" className="text-accent/12" stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="82" x2="50" y2="116" stroke="currentColor" strokeWidth="0.5" className="text-accent/20" />
      
      {/* Ischium */}
      <path d="M25 55 Q20 60 18 70 Q16 78 22 82 L28 78 L25 65 Z"
        fill="currentColor" className="text-accent/12" stroke="currentColor" strokeWidth="0.75" />
      
      {/* Pubis */}
      <path d="M72 45 Q80 48 82 55 L78 60 L72 58 Z"
        fill="currentColor" className="text-accent/12" stroke="currentColor" strokeWidth="0.75" />
      
      {/* Joint capsule */}
      <path d="M36 48 Q50 38 64 48 Q68 55 64 62 Q50 72 36 62 Q32 55 36 48"
        stroke="currentColor" strokeWidth="0.5" className="text-teal/25" fill="none" strokeDasharray="2 2" />
    </svg>
  );
}
