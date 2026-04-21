import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/intake/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const plan = data.plan;

    if (!plan) {
      return NextResponse.json(
        { error: "No plan found" },
        { status: 404 }
      );
    }

    const PHASE_TITLES: Record<string, string> = {
      isometric_stabilization: "Phase 1: Stabilization",
      controlled_range_of_motion: "Phase 2: Range of Motion",
      loaded_mobility: "Phase 3: Loaded Mobility",
      integrated_movement: "Phase 4: Integrated Movement",
    };

    const lines: string[] = [
      "TECHPHYSIO - EXERCISE PLAN",
      "=".repeat(40),
      "",
      `Generated: ${new Date().toLocaleDateString()}`,
      `Plan ID: ${plan.id}`,
      "",
    ];

    if (plan.probabilistic_framing) {
      lines.push("NOTE: " + plan.probabilistic_framing.pattern);
      lines.push("");
    }

    for (const phase of plan.phases) {
      lines.push("=".repeat(40));
      lines.push(PHASE_TITLES[phase.phase] || phase.phase);
      lines.push("=".repeat(40));
      lines.push("");
      lines.push(phase.summary);
      lines.push("");

      for (let i = 0; i < phase.exercises.length; i++) {
        const ex = phase.exercises[i];
        lines.push(`${i + 1}. ${ex.name}`);
        lines.push(`   Dose: ${ex.dose}`);
        lines.push(`   Instructions:\n    - ${ex.instructions.join("\n    - ")}`);
        lines.push(`   Stop if: ${ex.stop_conditions.join(", ")}`);
        lines.push("");
      }
      lines.push("");
    }

    lines.push("=".repeat(40));
    lines.push("IMPORTANT SAFETY NOTES");
    lines.push("=".repeat(40));
    lines.push("");
    lines.push("This system does not provide a diagnosis.");
    lines.push("If your condition changes, stop exercising and consult a clinician.");
    lines.push("Only perform exercises within a pain-free range.");
    lines.push("");

    const pdfContent = lines.join("\n");

    const encoder = new TextEncoder();
    const pdfBytes = encoder.encode(pdfContent);

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="exercise-plan-${id}.txt"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}