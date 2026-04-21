"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { BodyRegion, BodyView } from "@/lib/types/body";
import { BODY_REGION_META } from "@/lib/types/body";

/**
 * Simplified anatomical body map. Each region is a rounded rectangle
 * positioned over a schematic silhouette. This is intentionally
 * abstract — the goal is reliable region selection on touch and mouse,
 * not photoreal anatomy.
 *
 * Coordinates are in a 240x520 viewBox per view.
 */

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
  { id: "shoulder_right",view: "posterior", x: 148, y: 82,  w: 34, h: 26, rx: 12 }, // mirrored
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
    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 items-start">
      <div>
        <ViewToggle view={view} onChange={setView} />
        <div className="mt-4 rounded-bento border border-black/5 bg-paper-sunk p-3">
          <svg
            viewBox="0 0 240 520"
            className="h-[420px] w-auto select-none"
            role="img"
            aria-label={`Body map — ${view} view`}
          >
            <Silhouette view={view} />
            {regions.map((r) => {
              const isPrimary = primary === r.id;
              const isSecondary = secondary.includes(r.id);
              return (
                <g key={`${r.view}-${r.id}`}>
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx={r.rx ?? 6}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isPrimary
                        ? "fill-halt/70 stroke-halt"
                        : isSecondary
                          ? "fill-accent/50 stroke-accent"
                          : hover === r.id
                            ? "fill-accent/20 stroke-accent/60"
                            : "fill-white/0 stroke-ink-muted/50"
                    )}
                    strokeWidth={1.25}
                    onClick={(e) => {
                      if (e.shiftKey || e.metaKey) onToggleSecondary(r.id);
                      else onPickPrimary(r.id);
                    }}
                    onMouseEnter={() => setHover(r.id)}
                    onMouseLeave={() => setHover(null)}
                    aria-label={BODY_REGION_META[r.id].label}
                  />
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-2 text-xs text-ink-muted">
          Tap to mark primary · <span className="font-mono">Shift</span>-tap to add a secondary area.
        </p>
      </div>
      <RegionSidebar
        primary={primary}
        secondary={secondary}
        hover={hover}
        onClearPrimary={() => primary && onPickPrimary(primary)}
        onRemoveSecondary={onToggleSecondary}
      />
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
    <div className="inline-flex rounded-full border border-black/10 bg-paper-raised p-1 text-sm">
      {(["anterior", "posterior"] as BodyView[]).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "rounded-full px-3 py-1 transition-colors",
            view === v ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
          )}
        >
          {v === "anterior" ? "Front" : "Back"}
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
    <div className="rounded-bento border border-black/5 bg-paper-raised p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        Selection
      </p>
      <div className="mt-3">
        <p className="text-sm text-ink-muted">Primary site</p>
        {primary ? (
          <div className="mt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-halt-soft px-3 py-1 text-sm font-medium text-halt">
              {BODY_REGION_META[primary].label}
            </span>
            <button
              onClick={onClearPrimary}
              type="button"
              className="text-xs text-ink-muted hover:text-ink underline underline-offset-2"
            >
              Clear
            </button>
          </div>
        ) : (
          <p className="mt-1 text-sm text-ink-muted italic">
            {hover
              ? `Tap to set ${BODY_REGION_META[hover].label}`
              : "Tap a region on the map."}
          </p>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-ink-muted">Also affected</p>
        {secondary.length === 0 ? (
          <p className="mt-1 text-sm text-ink-muted italic">
            Shift-tap other areas to add.
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {secondary.map((r) => (
              <li key={r}>
                <button
                  onClick={() => onRemoveSecondary(r)}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-sm text-accent hover:bg-accent/20"
                  aria-label={`Remove ${BODY_REGION_META[r].label}`}
                >
                  {BODY_REGION_META[r].label}
                  <span aria-hidden>×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Schematic silhouette — intentionally plain so attention stays on the regions. */
function Silhouette({ view }: { view: BodyView }) {
  return (
    <g
      fill="#E7ECF2"
      stroke="#C8D0DB"
      strokeWidth={1}
      aria-hidden
    >
      {/* head */}
      <ellipse cx={120} cy={40} rx={22} ry={26} />
      {/* torso */}
      <path d="M82,80 Q120,68 158,80 L168,200 Q120,214 72,200 Z" />
      {/* arms */}
      <path d="M72,90 L50,210 L40,260 L52,262 L66,212 L84,100 Z" />
      <path d="M168,90 L190,210 L200,260 L188,262 L174,212 L156,100 Z" />
      {/* pelvis */}
      <path d="M78,196 Q120,210 162,196 L160,240 Q120,250 80,240 Z" />
      {/* legs */}
      <path d="M82,238 L78,430 L106,470 L114,340 L112,238 Z" />
      <path d="M158,238 L162,430 L134,470 L126,340 L128,238 Z" />
      {/* feet */}
      <path d="M70,462 L118,462 L116,488 L72,488 Z" />
      <path d="M122,462 L170,462 L168,488 L124,488 Z" />
      {/* minimal visual difference between views — back shows a spine hint */}
      {view === "posterior" ? (
        <path d="M120,90 L120,206" stroke="#B8C2CF" strokeDasharray="2 3" />
      ) : null}
    </g>
  );
}
