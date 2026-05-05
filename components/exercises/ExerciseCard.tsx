"use client";

import { useState } from "react";
import { Play, CheckCircle2, Clock, Info, ChevronRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExercisePlayer } from "./ExercisePlayer";
import { motion, AnimatePresence } from "framer-motion";

interface Exercise {
  id: string;
  name: string;
  description: string;
  video_url?: string;
  sets?: number;
  reps?: string;
  duration_seconds?: number;
}

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  onComplete: () => void;
}

export function ExerciseCard({ exercise, isCompleted, onComplete }: ExerciseCardProps) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <Card variant="default" className={`overflow-hidden border-none shadow-premium transition-all duration-300 ${isCompleted ? "opacity-75" : ""}`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
           {/* Info Section */}
           <div className="flex-1 p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <h3 className={`text-xl font-black tracking-tight ${isCompleted ? "text-slate-400 line-through" : "text-ink"}`}>
                          {exercise.name}
                       </h3>
                       {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {exercise.sets && (
                         <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-md">
                            {exercise.sets} Sets
                         </span>
                       )}
                       {exercise.reps && (
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                            {exercise.reps}
                         </span>
                       )}
                       {exercise.duration_seconds && (
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {exercise.duration_seconds}s
                         </span>
                       )}
                    </div>
                 </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                 {exercise.description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                 {exercise.video_url && (
                   <Button 
                     variant={showVideo ? "premium" : "outline"} 
                     size="sm" 
                     className="rounded-xl h-10 px-4 font-bold"
                     onClick={() => setShowVideo(!showVideo)}
                   >
                      <Play className={`h-4 w-4 mr-2 ${showVideo ? "fill-white" : ""}`} />
                      {showVideo ? "Close Video" : "Watch Form"}
                   </Button>
                 )}
                 <Button 
                   variant={isCompleted ? "ghost" : "default"} 
                   size="sm" 
                   className={`rounded-xl h-10 px-4 font-bold ${isCompleted ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" : ""}`}
                   onClick={onComplete}
                 >
                    {isCompleted ? (
                      <><Check className="h-4 w-4 mr-2" /> Completed</>
                    ) : (
                      "Mark Complete"
                    )}
                 </Button>
              </div>
           </div>

           {/* Video Section / Placeholder */}
           {exercise.video_url && (
             <div className={`md:w-72 bg-slate-50 relative group transition-all ${showVideo ? "md:w-[400px]" : ""}`}>
                <AnimatePresence mode="wait">
                   {showVideo ? (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full min-h-[200px]"
                     >
                        <ExercisePlayer videoUrl={exercise.video_url} title={exercise.name} />
                     </motion.div>
                   ) : (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full min-h-[200px] flex flex-col items-center justify-center p-8 text-center cursor-pointer"
                        onClick={() => setShowVideo(true)}
                     >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-premium mb-3 group-hover:scale-110 transition-transform">
                           <Play className="h-6 w-6 fill-brand-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview Video</span>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}