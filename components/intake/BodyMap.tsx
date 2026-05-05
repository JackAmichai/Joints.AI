"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { BodyRegion, BodyView } from "@/lib/types/body";
import { BODY_REGION_META } from "@/lib/types/body";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, Search, Info, X, Check } from "lucide-react";

interface RegionHit {
  id: BodyRegion;
  view: BodyView;
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
}

const ANTERIOR: RegionHit[] = [
  { id: "jaw",           view: "anterior", x: 105, y: 38,  w: 30, h: 14, rx: 7 },
  { id: "cervical_spine",view: "anterior", x: 100, y: 58,  w: 40, h: 18, rx: 8 },
  { id: "shoulder_right",view: "anterior", x: 58,  y: 82,  w: 34, h: 26, rx: 12 },
  { id: "shoulder_left", view: "anterior", x: 148, y: 82,  w: 34, h: 26, rx: 12 },
  { id: "chest",         view: "anterior", x: 88,  y: 96,  w: 64, h: 46, rx: 14 },
  { id: "abdomen",       view: "anterior", x: 92,  y: 150, w: 56, h: 46, rx: 12 },
  { id: "elbow_right",   view: "anterior", x: 42,  y: 162, w: 22, h: 22, rx: 10 },
  { id: "elbow_left",    view: "anterior", x: 176, y: 162, w: 22, h: 22, rx: 10 },
  { id: "wrist_right",   view: "anterior", x: 30,  y: 216, w: 20, h: 18, rx: 8 },
  { id: "wrist_left",    view: "anterior", x: 190, y: 216, w: 20, h: 18, rx: 8 },
  { id: "hand_right",    view: "anterior", x: 22,  y: 238, w: 26, h: 30, rx: 10 },
  { id: "hand_left",     view: "anterior", x: 192, y: 238, w: 26, h: 30, rx: 10 },
  { id: "hip_right",     view: "anterior", x: 82,  y: 204, w: 32, h: 26, rx: 10 },
  { id: "hip_left",      view: "anterior", x: 126, y: 204, w: 32, h: 26, rx: 10 },
  { id: "knee_right",    view: "anterior", x: 82,  y: 316, w: 30, h: 26, rx: 10 },
  { id: "knee_left",     view: "anterior", x: 128, y: 316, w: 30, h: 26, rx: 10 },
  { id: "ankle_right",   view: "anterior", x: 84,  y: 430, w: 26, h: 20, rx: 8 },
  { id: "ankle_left",    view: "anterior", x: 130, y: 430, w: 26, h: 20, rx: 8 },
  { id: "foot_right",    view: "anterior", x: 78,  y: 456, w: 36, h: 28, rx: 10 },
  { id: "foot_left",     view: "anterior", x: 126, y: 456, w: 36, h: 28, rx: 10 }
];

const POSTERIOR: RegionHit[] = [
  { id: "cervical_spine",view: "posterior", x: 100, y: 58,  w: 40, h: 18, rx: 8 },
  { id: "shoulder_right",view: "posterior", x: 148, y: 82,  w: 34, h: 26, rx: 12 },
  { id: "shoulder_left", view: "posterior", x: 58,  y: 82,  w: 34, h: 26, rx: 12 },
  { id: "thoracic_spine",view: "posterior", x: 105, y: 102, w: 30, h: 60, rx: 10 },
  { id: "lumbar_spine",  view: "posterior", x: 102, y: 168, w: 36, h: 36, rx: 10 },
  { id: "sacroiliac",    view: "posterior", x: 94,  y: 206, w: 52, h: 18, rx: 8 },
  { id: "elbow_right",   view: "posterior", x: 176, y: 162, w: 22, h: 22, rx: 10 },
  { id: "elbow_left",    view: "posterior", x: 42,  y: 162, w: 22, h: 22, rx: 10 },
  { id: "hip_right",     view: "posterior", x: 126, y: 204, w: 32, h: 26, rx: 10 },
  { id: "hip_left",      view: "posterior", x: 82,  y: 204, w: 32, h: 26, rx: 10 },
  { id: "knee_right",    view: "posterior", x: 128, y: 316, w: 30, h: 26, rx: 10 },
  { id: "knee_left",     view: "posterior", x: 82,  y: 316, w: 30, h: 26, rx: 10 },
  { id: "ankle_right",   view: "posterior", x: 130, y: 430, w: 26, h: 20, rx: 8 },
  { id: "ankle_left",    view: "posterior", x: 84,  y: 430, w: 26, h: 20, rx: 8 }
];

interface BodyMapProps {
  primary: BodyRegion | null;
  secondary: BodyRegion[];
  onPickPrimary: (r: BodyRegion) => void;
  onToggleSecondary: (r: BodyRegion) => void;
}

export function BodyMap({
  primary,
  secondary,
  onPickPrimary,
  onToggleSecondary
}: BodyMapProps) {
  const [view, setView] = useState<BodyView>("anterior");
  const [hover, setHover] = useState<BodyRegion | null>(null);
  const regions = view === "anterior" ? ANTERIOR : POSTERIOR;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
        <ViewToggle view={view} onChange={setView} />
        
        <div className="mt-8 relative w-full flex justify-center group">
          {/* Glass background container */}
          <div className="absolute inset-0 bg-slate-50/50 rounded-[3rem] border border-slate-200/50 backdrop-blur-sm -z-10" />
          
          <div className="relative p-8">
             <motion.svg
               viewBox="0 0 240 520"
               className="h-[500px] w-auto select-none drop-shadow-2xl"
               initial={false}
               animate={{ rotateY: view === "anterior" ? 0 : 180 }}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
             >
               <Silhouette view={view} />
               
               {/* Scanning Line Effect */}
               <motion.rect 
                 animate={{ y: [0, 520, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 x="20" y="0" width="200" height="1" 
                 className="fill-brand-500/30 shadow-[0_0_10px_brand-500]"
               />

               {regions.map((r) => {
                 const isPrimary = primary === r.id;
                 const isSecondary = secondary.includes(r.id);
                 const isHovered = hover === r.id;
                 
                 return (
                   <g key={`${r.view}-${r.id}`} className="cursor-pointer">
                      <AnimatePresence>
                         {isPrimary && (
                           <motion.circle 
                              initial={{ r: 0, opacity: 0 }}
                              animate={{ r: [15, 30, 15], opacity: [0, 0.4, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              cx={r.x + r.w/2} cy={r.y + r.h/2}
                              className="fill-halt/40"
                           />
                         )}
                      </AnimatePresence>
                      
                      <motion.rect
                        whileHover={{ scale: 1.1 }}
                        x={r.x}
                        y={r.y}
                        width={r.w}
                        height={r.h}
                        rx={r.rx ?? 10}
                        className={cn(
                          "transition-all duration-300 stroke-[2px]",
                          isPrimary
                            ? "fill-halt/60 stroke-halt shadow-[0_0_15px_halt]"
                            : isSecondary
                              ? "fill-brand-500/50 stroke-brand-600 shadow-[0_0_15px_brand-500]"
                              : isHovered
                                ? "fill-brand-500/20 stroke-brand-400"
                                : "fill-white/10 stroke-slate-300/50"
                        )}
                        onClick={(e) => {
                          if (e.shiftKey || e.metaKey) onToggleSecondary(r.id);
                          else onPickPrimary(r.id);
                        }}
                        onMouseEnter={() => setHover(r.id)}
                        onMouseLeave={() => setHover(null)}
                      />
                   </g>
                 );
               })}
             </motion.svg>
             
             {/* HUD elements */}
             <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="p-2 bg-white/60 backdrop-blur-md rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   Resolution: 0.1mm
                </div>
                <div className="p-2 bg-white/60 backdrop-blur-md rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                   System Active
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 xl:col-span-4 h-full">
         <RegionSidebar
           primary={primary}
           secondary={secondary}
           hover={hover}
           onClearPrimary={() => primary && onPickPrimary(primary)}
           onRemoveSecondary={onToggleSecondary}
         />
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  onChange
}: {
  view: BodyView;
  onChange: (v: BodyView) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border-2 border-slate-100 bg-white p-1.5 shadow-sm">
      {(["anterior", "posterior"] as BodyView[]).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "rounded-xl px-6 py-2.5 text-sm font-black uppercase tracking-wider transition-all",
            view === v 
              ? "bg-brand-600 text-white shadow-lg shadow-brand-100" 
              : "text-slate-400 hover:text-ink"
          )}
        >
          {v === "anterior" ? "Frontal" : "Posterior"}
        </button>
      ))}
    </div>
  );
}

function RegionSidebar({
  primary,
  secondary,
  hover,
  onClearPrimary,
  onRemoveSecondary
}: {
  primary: BodyRegion | null;
  secondary: BodyRegion[];
  hover: BodyRegion | null;
  onClearPrimary: () => void;
  onRemoveSecondary: (r: BodyRegion) => void;
}) {
  return (
    <div className="flex flex-col gap-6 h-full">
      <motion.div 
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         className="bg-white rounded-3xl border-none shadow-premium p-8 flex-1"
      >
        <div className="flex items-center gap-2 mb-8">
           <Activity className="h-5 w-5 text-brand-600" />
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Analysis Engine</h3>
        </div>

        <div className="space-y-8">
           <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Primary Focus Area</p>
              {primary ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-between p-4 bg-halt/5 border-2 border-halt/20 rounded-2xl group"
                >
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-halt animate-pulse" />
                     <span className="text-lg font-black text-halt">
                       {BODY_REGION_META[primary].label}
                     </span>
                  </div>
                  <button
                    onClick={onClearPrimary}
                    className="p-2 hover:bg-halt/10 rounded-xl transition-colors text-halt"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ) : (
                <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                   <p className="text-sm font-medium text-slate-400 italic">
                     {hover ? `Click to target ${BODY_REGION_META[hover].label}` : "Target a region on the HUD"}
                   </p>
                </div>
              )}
           </div>

           <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Secondary Impact</p>
              <div className="flex flex-wrap gap-2">
                 <AnimatePresence mode="popLayout">
                    {secondary.length === 0 ? (
                       <motion.p 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-sm text-slate-400 font-medium italic"
                       >
                          Shift-click to add related pain areas.
                       </motion.p>
                    ) : (
                       secondary.map((r) => (
                         <motion.button
                           layout
                           key={r}
                           initial={{ scale: 0.8, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           exit={{ scale: 0.8, opacity: 0 }}
                           onClick={() => onRemoveSecondary(r)}
                           className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-xl font-bold text-sm border-2 border-brand-100 hover:bg-brand-100 transition-colors"
                         >
                           {BODY_REGION_META[r].label}
                           <X className="h-3 w-3" />
                         </motion.button>
                       ))
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </motion.div>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="bg-brand-600 rounded-3xl p-8 text-white shadow-xl shadow-brand-100"
      >
         <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-5 w-5 text-brand-200" />
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-200">Validation Status</h4>
         </div>
         <p className="text-sm font-medium text-brand-50 leading-relaxed">
            Targeting specific clinical patterns based on your anatomical selection.
         </p>
         <div className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
               animate={{ x: ["-100%", "100%"] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="h-full w-1/3 bg-white/40"
            />
         </div>
      </motion.div>
    </div>
  );
}

function Silhouette({ view }: { view: BodyView }) {
  return (
    <g
      fill="#F8FAFC"
      stroke="#E2E8F0"
      strokeWidth={2}
      aria-hidden
    >
      {/* Schematic silhouette with medical style */}
      <ellipse cx={120} cy={40} rx={22} ry={26} className="fill-slate-100" />
      <path d="M82,80 Q120,68 158,80 L168,200 Q120,214 72,200 Z" className="fill-slate-50" />
      <path d="M72,90 L50,210 L40,260 L52,262 L66,212 L84,100 Z" />
      <path d="M168,90 L190,210 L200,260 L188,262 L174,212 L156,100 Z" />
      <path d="M78,196 Q120,210 162,196 L160,240 Q120,250 80,240 Z" />
      <path d="M82,238 L78,430 L106,470 L114,340 L112,238 Z" />
      <path d="M158,238 L162,430 L134,470 L126,340 L128,238 Z" />
      <path d="M70,462 L118,462 L116,488 L72,488 Z" />
      <path d="M122,462 L170,462 L168,488 L124,488 Z" />
      
      {view === "posterior" ? (
        <path d="M120,90 L120,206" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={1} />
      ) : (
        <path d="M100,100 Q120,110 140,100" stroke="#E2E8F0" fill="none" />
      )}
    </g>
  );
}
