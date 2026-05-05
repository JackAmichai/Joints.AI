"use client";

import { motion } from "framer-motion";

interface AnatomicalBackgroundProps {
  variant?: "skeleton" | "spine" | "joints" | "brain";
  className?: string;
}

export function AnatomicalBackground({
  variant = "skeleton",
  className = ""
}: AnatomicalBackgroundProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute w-full h-full opacity-[0.05] stroke-brand-600"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
           <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
              </feMerge>
           </filter>
        </defs>

        {variant === "skeleton" && (
          <g transform="translate(100, 50)" filter="url(#glow)">
            {/* Skull */}
            <motion.ellipse 
              initial="hidden" animate="visible" variants={pathVariants}
              cx="100" cy="40" rx="35" ry="42" strokeWidth="2" 
            />
            {/* Spine */}
            <motion.path
              initial="hidden" animate="visible" variants={pathVariants}
              d="M100 82 L100 280" strokeWidth="4" strokeLinecap="round"
            />
            {/* Ribs */}
            {[110, 145, 180].map((y, i) => (
              <g key={i}>
                <motion.path 
                  initial="hidden" animate="visible" variants={pathVariants}
                  d={`M100 ${y} L${60 - i*5} ${y + 30}`} strokeWidth="2" strokeLinecap="round" 
                />
                <motion.path 
                  initial="hidden" animate="visible" variants={pathVariants}
                  d={`M100 ${y} L${140 + i*5} ${y + 30}`} strokeWidth="2" strokeLinecap="round" 
                />
              </g>
            ))}
            {/* Pelvis */}
            <motion.path 
              initial="hidden" animate="visible" variants={pathVariants}
              d="M70 220 Q100 240 130 220" strokeWidth="4" strokeLinecap="round" 
            />
            {/* Arms */}
            <motion.path initial="hidden" animate="visible" variants={pathVariants} d="M60 140 L30 220" strokeWidth="2" />
            <motion.path initial="hidden" animate="visible" variants={pathVariants} d="M140 140 L170 220" strokeWidth="2" />
            {/* Legs */}
            <motion.path initial="hidden" animate="visible" variants={pathVariants} d="M80 250 L70 350 L60 450" strokeWidth="3" />
            <motion.path initial="hidden" animate="visible" variants={pathVariants} d="M120 250 L130 350 L140 450" strokeWidth="3" />
          </g>
        )}

        {variant === "spine" && (
          <g transform="translate(160, 80)" filter="url(#glow)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((y, i) => (
              <motion.g 
                key={i} 
                initial={{ opacity: 0, y: y + 20 }}
                animate={{ opacity: 1, y }}
                transition={{ delay: i * 0.1 }}
              >
                <ellipse cx="40" cy="0" rx="25" ry="8" strokeWidth="2" />
                <rect x="35" y="-12" width="10" height="24" rx="2" strokeWidth="2" />
              </motion.g>
            ))}
          </g>
        )}

        {variant === "joints" && (
          <g transform="translate(120, 150)" filter="url(#glow)">
            <motion.circle 
              animate={{ r: [15, 20, 15], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              cx="0" cy="0" r="15" strokeWidth="2" 
            />
            <motion.circle 
              animate={{ r: [15, 20, 15], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              cx="160" cy="0" r="15" strokeWidth="2" 
            />
            <motion.circle 
               animate={{ r: [18, 24, 18], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 4, repeat: Infinity, delay: 1 }}
               cx="40" cy="200" r="18" strokeWidth="2" 
            />
            <motion.circle 
               animate={{ r: [18, 24, 18], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
               cx="120" cy="200" r="18" strokeWidth="2" 
            />
          </g>
        )}
      </svg>
      
      {/* Decorative scanning line */}
      <motion.div 
         animate={{ top: ["0%", "100%", "0%"] }}
         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
         className="absolute left-0 right-0 h-[1px] bg-brand-500/20 shadow-[0_0_15px_brand-500] z-0"
      />
    </div>
  );
}