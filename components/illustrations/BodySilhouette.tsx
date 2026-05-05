interface BodySilhouetteProps {
  className?: string;
  animated?: boolean;
}

export function BodySilhouette({ className = "", animated = false }: BodySilhouetteProps) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 200 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Head / skull */}
        <ellipse cx="100" cy="38" rx="22" ry="28" stroke="currentColor" strokeWidth="1.5" className="text-accent/60" />
        <ellipse cx="100" cy="38" rx="18" ry="24" stroke="currentColor" strokeWidth="0.75" className="text-accent/30" />
        {/* Skull details */}
        <path d="M88 28 Q95 24 100 26 Q105 24 112 28" stroke="currentColor" strokeWidth="0.75" className="text-accent/30" fill="none" />
        <circle cx="94" cy="36" r="1.5" className="fill-accent/40" />
        <circle cx="106" cy="36" r="1.5" className="fill-accent/40" />
        <path d="M96 46 Q100 48 104 46" stroke="currentColor" strokeWidth="0.75" className="text-accent/30" fill="none" />

        {/* Cervical spine */}
        <path d="M100 66 L100 85" stroke="currentColor" strokeWidth="2" className="text-accent/50" strokeLinecap="round" />
        
        {/* Thoracic spine with vertebrae */}
        <path d="M100 85 L100 200" stroke="currentColor" strokeWidth="2" className="text-accent/50" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <g key={`thoracic-${i}`} transform={`translate(100, ${95 + i * 9})`}>
            <ellipse cx="0" cy="0" rx="3" ry="1.5" className="fill-accent/30" />
          </g>
        ))}

        {/* Lumbar spine */}
        <path d="M100 200 Q98 220 100 240" stroke="currentColor" strokeWidth="2.5" className="text-accent/60" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`lumbar-${i}`} transform={`translate(100, ${205 + i * 8})`}>
            <ellipse cx="0" cy="0" rx="4" ry="2" className="fill-accent/30" />
          </g>
        ))}

        {/* Sacrum */}
        <path d="M92 245 L108 245 L105 260 L100 265 L95 260 Z" stroke="currentColor" strokeWidth="1" className="text-accent/40" fill="currentColor" fillOpacity="0.1" />

        {/* Ribcage */}
        <g className="text-accent/20" stroke="currentColor" strokeWidth="1" fill="none">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={`rib-${i}`}>
              <path d={`M${100 - 2} ${100 + i * 10} Q${70 + i * 3} ${105 + i * 10} ${55 + i * 4} ${115 + i * 10}`} />
              <path d={`M${100 + 2} ${100 + i * 10} Q${130 - i * 3} ${105 + i * 10} ${145 - i * 4} ${115 + i * 10}`} />
            </g>
          ))}
        </g>

        {/* Clavicles */}
        <path d="M100 88 Q80 82 55 85" stroke="currentColor" strokeWidth="1.5" className="text-accent/40" strokeLinecap="round" fill="none" />
        <path d="M100 88 Q120 82 145 85" stroke="currentColor" strokeWidth="1.5" className="text-accent/40" strokeLinecap="round" fill="none" />

        {/* Pelvis */}
        <path d="M95 240 Q80 230 65 240 Q55 250 60 270 Q70 280 100 285 Q130 280 140 270 Q145 250 135 240 Q120 230 105 240"
          stroke="currentColor" strokeWidth="1.5" className="text-accent/40" fill="currentColor" fillOpacity="0.05" />

        {/* Left arm */}
        <g className="text-accent/50" stroke="currentColor" fill="none">
          {/* Humerus */}
          <path d="M55 85 L38 140" strokeWidth="2" strokeLinecap="round" />
          {/* Elbow */}
          <circle cx="38" cy="140" r="3" className="fill-accent/30" stroke="none" />
          {/* Forearm */}
          <path d="M38 140 L30 200" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 140 L42 200" strokeWidth="1.5" strokeLinecap="round" />
          {/* Wrist */}
          <circle cx="36" cy="200" r="2.5" className="fill-accent/30" stroke="none" />
          {/* Hand */}
          <ellipse cx="34" cy="212" rx="5" ry="8" strokeWidth="1" />
          <line x1="30" y1="220" x2="30" y2="228" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="34" y1="220" x2="34" y2="229" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="38" y1="220" x2="38" y2="227" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="26" y1="218" x2="26" y2="224" strokeWidth="0.75" strokeLinecap="round" />
        </g>

        {/* Right arm */}
        <g className="text-accent/50" stroke="currentColor" fill="none">
          {/* Humerus */}
          <path d="M145 85 L162 140" strokeWidth="2" strokeLinecap="round" />
          {/* Elbow */}
          <circle cx="162" cy="140" r="3" className="fill-accent/30" stroke="none" />
          {/* Forearm */}
          <path d="M162 140 L170 200" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M162 140 L158 200" strokeWidth="1.5" strokeLinecap="round" />
          {/* Wrist */}
          <circle cx="164" cy="200" r="2.5" className="fill-accent/30" stroke="none" />
          {/* Hand */}
          <ellipse cx="166" cy="212" rx="5" ry="8" strokeWidth="1" />
          <line x1="170" y1="220" x2="170" y2="228" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="166" y1="220" x2="166" y2="229" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="162" y1="220" x2="162" y2="227" strokeWidth="0.75" strokeLinecap="round" />
          <line x1="174" y1="218" x2="174" y2="224" strokeWidth="0.75" strokeLinecap="round" />
        </g>

        {/* Left leg */}
        <g className="text-accent/50" stroke="currentColor" fill="none">
          {/* Femur */}
          <path d="M80 270 L72 350" strokeWidth="2.5" strokeLinecap="round" />
          {/* Knee */}
          <circle cx="72" cy="350" r="5" className="fill-accent/20" strokeWidth="1" />
          <ellipse cx="72" cy="350" rx="6" ry="4" strokeWidth="0.75" />
          {/* Patella hint */}
          <circle cx="72" cy="348" r="2" className="fill-accent/10" stroke="none" />
          {/* Tibia */}
          <path d="M72 355 L68 430" strokeWidth="2" strokeLinecap="round" />
          <path d="M72 355 L76 425" strokeWidth="1.5" strokeLinecap="round" />
          {/* Ankle */}
          <circle cx="70" cy="432" r="3" className="fill-accent/20" stroke="none" />
          {/* Foot */}
          <path d="M68 435 L58 448 Q55 452 60 453 L78 453 Q82 450 78 445 L70 438" strokeWidth="1" strokeLinejoin="round" />
        </g>

        {/* Right leg */}
        <g className="text-accent/50" stroke="currentColor" fill="none">
          {/* Femur */}
          <path d="M120 270 L128 350" strokeWidth="2.5" strokeLinecap="round" />
          {/* Knee */}
          <circle cx="128" cy="350" r="5" className="fill-accent/20" strokeWidth="1" />
          <ellipse cx="128" cy="350" rx="6" ry="4" strokeWidth="0.75" />
          {/* Patella hint */}
          <circle cx="128" cy="348" r="2" className="fill-accent/10" stroke="none" />
          {/* Tibia */}
          <path d="M128 355 L132 430" strokeWidth="2" strokeLinecap="round" />
          <path d="M128 355 L124 425" strokeWidth="1.5" strokeLinecap="round" />
          {/* Ankle */}
          <circle cx="130" cy="432" r="3" className="fill-accent/20" stroke="none" />
          {/* Foot */}
          <path d="M132 435 L142 448 Q145 452 140 453 L122 453 Q118 450 122 445 L130 438" strokeWidth="1" strokeLinejoin="round" />
        </g>

        {/* Joint highlights */}
        {animated && (
          <g>
            {/* Shoulder joints */}
            <circle cx="55" cy="85" r="8" className="fill-accent/10">
              <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="145" cy="85" r="8" className="fill-accent/10">
              <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
            </circle>
            {/* Elbow joints */}
            <circle cx="38" cy="140" r="6" className="fill-accent/10">
              <animate attributeName="r" values="6;9;6" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
              <animate attributeName="opacity" values="0.1;0.15;0.1" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
            </circle>
            <circle cx="162" cy="140" r="6" className="fill-accent/10">
              <animate attributeName="r" values="6;9;6" dur="2.5s" repeatCount="indefinite" begin="0.9s" />
              <animate attributeName="opacity" values="0.1;0.15;0.1" dur="2.5s" repeatCount="indefinite" begin="0.9s" />
            </circle>
            {/* Knee joints */}
            <circle cx="72" cy="350" r="8" className="fill-accent/10">
              <animate attributeName="r" values="8;13;8" dur="2.5s" repeatCount="indefinite" begin="0.4s" />
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2.5s" repeatCount="indefinite" begin="0.4s" />
            </circle>
            <circle cx="128" cy="350" r="8" className="fill-accent/10">
              <animate attributeName="r" values="8;13;8" dur="2.5s" repeatCount="indefinite" begin="0.7s" />
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2.5s" repeatCount="indefinite" begin="0.7s" />
            </circle>
            {/* Hip joints */}
            <circle cx="80" cy="270" r="8" className="fill-accent/10">
              <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
              <animate attributeName="opacity" values="0.1;0.18;0.1" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle cx="120" cy="270" r="8" className="fill-accent/10">
              <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
              <animate attributeName="opacity" values="0.1;0.18;0.1" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
            </circle>
            {/* Spine points */}
            <circle cx="100" cy="100" r="5" className="fill-accent/10">
              <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" begin="1s" />
              <animate attributeName="opacity" values="0.1;0.15;0.1" dur="3s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="100" cy="160" r="5" className="fill-accent/10">
              <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" begin="1.3s" />
              <animate attributeName="opacity" values="0.1;0.15;0.1" dur="3s" repeatCount="indefinite" begin="1.3s" />
            </circle>
            <circle cx="100" cy="220" r="5" className="fill-accent/10">
              <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" begin="1.6s" />
              <animate attributeName="opacity" values="0.1;0.15;0.1" dur="3s" repeatCount="indefinite" begin="1.6s" />
            </circle>
            {/* Ankle joints */}
            <circle cx="70" cy="432" r="5" className="fill-accent/10">
              <animate attributeName="r" values="5;7;5" dur="2.5s" repeatCount="indefinite" begin="1s" />
              <animate attributeName="opacity" values="0.1;0.15;0.1" dur="2.5s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="130" cy="432" r="5" className="fill-accent/10">
              <animate attributeName="r" values="5;7;5" dur="2.5s" repeatCount="indefinite" begin="1.3s" />
              <animate attributeName="opacity" values="0.1;0.15;0.1" dur="2.5s" repeatCount="indefinite" begin="1.3s" />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}
