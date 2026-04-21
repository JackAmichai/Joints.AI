"""Seed corpus of safe mobility exercises.

This is NOT clinical advice frozen in code — it is a minimal scaffold corpus
so the retrieval pipeline can be exercised end-to-end against real vectors.
The production corpus will be populated from a clinician-reviewed content
pipeline and versioned in its own CMS.

Tagging conventions:
  - `kinematic_group` matches `BodyRegionMeta.kinematic_group`, so the
    retriever can filter by the user's body-map selection without needing
    per-side duplicates.
  - `contraindication_tags` is the vocabulary the Extractor emits when it
    sees terms the clinician-authored ruleset says to avoid. Any exercise
    whose tags INTERSECT the user's active contraindications is excluded
    from retrieval.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class SeedExercise:
    id: str
    name: str
    phase: str
    kinematic_group: str
    summary: str
    instructions: list[str]
    dose: str
    stop_conditions: list[str]
    contraindication_tags: list[str] = field(default_factory=list)
    source_title: str = "TechPhysio internal corpus (scaffold)"
    youtube_id: str = ""


YOUTUBE_EXERCISE_IDS = {
    "hip-iso-glute-bridge": "UIat2_1V3XU",
    "hip-rom-90-90-rotation": "8I5-OGPkK9M",
    "spine-iso-dead-bug": "dw6x2y4FPlA",
    "spine-rom-cat-cow": "kx2i5M-0qyk",
    "knee-iso-wall-sit": "西北8C8G1F0",
    "knee-rom-heel-slides": "西北6C8G1F5",
    "shoulder-iso-scap-retract-wall": "w8-YP4B7K4",
    "shoulder-rom-wall-slides": "C3F2Ix5E1V0",
}


SEED_EXERCISES: list[SeedExercise] = [
    # ─── Hip complex ─────────────────────────────────────────────────────────
    SeedExercise(
        id="hip-iso-glute-bridge",
        name="Supine Glute Bridge — Isometric Hold",
        phase="isometric_stabilization",
        kinematic_group="hip_complex",
        summary=(
            "Isometric gluteal activation for hip extensors. "
            "Reinforces posterior-chain recruitment without loaded motion."
        ),
        instructions=[
            "Lie on your back, knees bent at ~90°, feet flat, hip-width apart.",
            "Press through your heels and lift your hips until your torso makes a straight line from shoulder to knee.",
            "Hold the top position without arching your lower back — squeeze your glutes, not your lumbar spine.",
        ],
        dose="3 sets of 5 holds, 10 seconds each, 30-second rest.",
        stop_conditions=[
            "Sharp hip or low-back pain during the hold",
            "Any paresthesia (tingling, numbness) into the legs",
        ],
        contraindication_tags=["active_lumbar_radiculopathy"],
        youtube_id="UIat2_1V3XU",
    ),
    # ─── Hip complex ─────────────────────────────────────────────────────────
    SeedExercise(
        id="hip-iso-glute-bridge",
        name="Supine Glute Bridge — Isometric Hold",
        phase="isometric_stabilization",
        kinematic_group="hip_complex",
        summary=(
            "Isometric gluteal activation for hip extensors. "
            "Reinforces posterior-chain recruitment without loaded motion."
        ),
        instructions=[
            "Lie on your back, knees bent at ~90°, feet flat, hip-width apart.",
            "Press through your heels and lift your hips until your torso makes a straight line from shoulder to knee.",
            "Hold the top position without arching your lower back — squeeze your glutes, not your lumbar spine.",
        ],
        dose="3 sets of 5 holds, 10 seconds each, 30-second rest.",
        stop_conditions=[
            "Sharp hip or low-back pain during the hold",
            "Any paresthesia (tingling, numbness) into the legs",
        ],
        contraindication_tags=["active_lumbar_radiculopathy"],
    ),
    SeedExercise(
        id="hip-rom-90-90-rotation",
        name="Seated 90/90 Hip Rotation",
        phase="controlled_range_of_motion",
        kinematic_group="hip_complex",
        summary=(
            "Bilateral hip internal and external rotation mobility in a seated 90/90 position. "
            "Low-load exploration of hip capsular range."
        ),
        instructions=[
            (
                "Sit on the floor with the front leg bent at 90° in front of you "
                "and the rear leg bent at 90° to the side."
            ),
            (
                "Keep your trunk upright and slowly switch sides by pivoting "
                "both knees over to the other direction."
            ),
            "Move slowly — this is a range-of-motion exploration, not a stretch.",
        ],
        dose="2 sets of 8 alternating reps, rest 30 seconds between sets.",
        stop_conditions=[
            "Pinching pain in the front of the hip",
            "Low-back pain that intensifies with rotation",
        ],
        contraindication_tags=["post_hip_replacement_early", "active_labral_flare"],
    ),
    SeedExercise(
        id="hip-load-goblet-squat-tempo",
        name="Tempo Goblet Squat to Box",
        phase="loaded_mobility",
        kinematic_group="hip_complex",
        summary=(
            "Loaded bilateral hip flexion/extension to a depth-limited box. "
            "Tempo enforces control and reinforces safe squat mechanics."
        ),
        instructions=[
            "Hold a light dumbbell at chest height.",
            "Descend to a box in 3 seconds, pause 1 second, stand in 2 seconds.",
            "Keep knees tracking over toes, maintain neutral spine throughout.",
        ],
        dose="3 sets of 6 reps. Start with body weight only.",
        stop_conditions=[
            "Pain during the descent or at the bottom",
            "Loss of neutral spine (lumbar rounding)",
        ],
        contraindication_tags=["active_knee_effusion"],
    ),
    # ─── Lower limb (knee-dominant) ──────────────────────────────────────────
    SeedExercise(
        id="knee-iso-wall-sit",
        name="Short-Duration Wall Sit",
        phase="isometric_stabilization",
        kinematic_group="lower_limb",
        summary=(
            "Bilateral quadriceps isometric loading in a knee-friendly 60° bend. "
            "Safe starting-point activation without repetitive knee flexion."
        ),
        instructions=[
            "Stand with your back against a wall, feet shoulder-width apart, about 40 cm from the wall.",
            "Slide down until your knees are bent roughly 60° — NOT 90°.",
            "Keep knees tracking over toes; hold without bouncing.",
        ],
        dose="3 sets of 20-second holds.",
        stop_conditions=[
            "Sharp pain at the kneecap or joint line",
            "Loss of knee-over-toe alignment",
        ],
        contraindication_tags=["acute_patellar_tendinopathy"],
    ),
    SeedExercise(
        id="knee-rom-heel-slides",
        name="Supine Heel Slides",
        phase="controlled_range_of_motion",
        kinematic_group="lower_limb",
        summary=(
            "Low-load knee flexion range restoration. Gentle, end-range-respecting motion."
        ),
        instructions=[
            "Lie on your back with both legs straight.",
            "Slowly slide one heel toward your glute, bending the knee as far as is comfortable.",
            "Hold briefly at end range, then slide back out.",
        ],
        dose="2 sets of 10 per side.",
        stop_conditions=["Sharp pinching in the front of the knee", "Swelling that worsens"],
        contraindication_tags=["post_op_hinge_restriction"],
    ),
    SeedExercise(
        id="knee-load-step-down-tempo",
        name="Tempo Eccentric Step-Down",
        phase="loaded_mobility",
        kinematic_group="lower_limb",
        summary=(
            "Single-limb eccentric control of knee flexion. "
            "Builds quadriceps-glute coordination in a functional range."
        ),
        instructions=[
            "Stand on a low step (10-15 cm) with one foot just hanging off the edge.",
            "Lower the hanging heel to the floor over 3 seconds, tapping lightly.",
            "Return to the top in 1 second. Keep the knee tracking over the second toe.",
        ],
        dose="3 sets of 8 reps per leg.",
        stop_conditions=["Sharp anterior knee pain", "Knee collapsing inward"],
        contraindication_tags=["acute_knee_effusion"],
    ),
    # ─── Spine (lumbar-dominant) ─────────────────────────────────────────────
    SeedExercise(
        id="spine-iso-dead-bug",
        name="Dead Bug — Slow Tempo",
        phase="isometric_stabilization",
        kinematic_group="spine",
        summary=(
            "Anti-extension trunk stability with contralateral limb motion. "
            "Protects the lumbar spine while building deep-core endurance."
        ),
        instructions=[
            "Lie on your back, arms straight up, knees bent at 90° above the hips.",
            "Keep your low back pressed gently against the floor throughout.",
            "Slowly lower the opposite arm and leg toward the floor, then return.",
        ],
        dose="2 sets of 8 alternating reps.",
        stop_conditions=[
            "Low-back pain that increases during the rep",
            "Inability to keep the low back flat",
        ],
        contraindication_tags=["acute_lumbar_flare", "spondylolisthesis_symptomatic"],
    ),
    SeedExercise(
        id="spine-rom-cat-cow",
        name="Quadruped Cat-Cow",
        phase="controlled_range_of_motion",
        kinematic_group="spine",
        summary=(
            "Segmental spinal flexion and extension, unloaded. "
            "Restores mobility throughout the thoracic and lumbar spine."
        ),
        instructions=[
            "Start on hands and knees, wrists under shoulders, knees under hips.",
            "Slowly round your back toward the ceiling, tucking your tailbone.",
            "Then slowly arch, lifting your chest and tailbone. Move smoothly, not to end range.",
        ],
        dose="2 sets of 10 reps, breathing with the movement.",
        stop_conditions=["Sharp low-back pain", "Dizziness or light-headedness"],
        contraindication_tags=["acute_disc_herniation_flexion_intolerant"],
    ),
    SeedExercise(
        id="spine-load-hip-hinge-dowel",
        name="Hip Hinge with Dowel Feedback",
        phase="loaded_mobility",
        kinematic_group="spine",
        summary=(
            "Teaches spine-neutral hinging from the hips. "
            "Dowel provides kinaesthetic feedback against lumbar rounding."
        ),
        instructions=[
            "Hold a dowel along your spine — touching the back of your head, mid-back, and sacrum.",
            "Soften your knees and hinge at the hips, pushing your hips back.",
            "Keep all three contact points on the dowel throughout the movement.",
        ],
        dose="3 sets of 8 reps, unloaded.",
        stop_conditions=["Loss of contact with the dowel (loss of neutral spine)", "Low-back pain"],
        contraindication_tags=["acute_lumbar_radiculopathy"],
    ),
    # ─── Shoulder complex ────────────────────────────────────────────────────
    SeedExercise(
        id="shoulder-iso-scap-retract-wall",
        name="Wall Scapular Retraction — Isometric",
        phase="isometric_stabilization",
        kinematic_group="shoulder_complex",
        summary=(
            "Activates lower/mid trapezius and rhomboids without glenohumeral loading. "
            "Baseline scapular control before adding motion."
        ),
        instructions=[
            (
                "Stand an arm's length from a wall. Place your palms flat "
                "against it at shoulder height."
            ),
            (
                "Without moving your arms, gently pull your shoulder blades "
                "down and back toward each other."
            ),
            "Hold without shrugging your shoulders up toward your ears.",
        ],
        dose="3 sets of 5 holds, 8 seconds each.",
        stop_conditions=["Sharp shoulder pain", "Radiating pain into the arm"],
        contraindication_tags=["acute_rotator_cuff_tear"],
    ),
    SeedExercise(
        id="shoulder-rom-wall-slides",
        name="Wall Slides",
        phase="controlled_range_of_motion",
        kinematic_group="shoulder_complex",
        summary=(
            "Guided scapulohumeral elevation within a pain-free range. "
            "Supports safe overhead motion restoration."
        ),
        instructions=[
            "Stand with your back against a wall, arms bent at 90° like a goalpost.",
            "Slide your arms up the wall as high as you can without pain and without losing contact.",
            "Lower slowly. The wall provides feedback against shrugging.",
        ],
        dose="2 sets of 10 reps.",
        stop_conditions=["Pinching pain at end range", "Loss of wall contact to chase range"],
        contraindication_tags=["post_op_overhead_restriction"],
    ),
    SeedExercise(
        id="shoulder-load-banded-row",
        name="Banded Row with Scapular Lead",
        phase="loaded_mobility",
        kinematic_group="shoulder_complex",
        summary=(
            "Horizontal pulling emphasizing scapular retraction first, then elbow drive. "
            "Reinforces posterior-shoulder strength."
        ),
        instructions=[
            "Anchor a light resistance band at chest height. Hold one end in each hand.",
            "Step back so the band is taut. Initiate by squeezing your shoulder blades together.",
            "Then pull your elbows back, keeping them close to your ribs.",
        ],
        dose="3 sets of 10 reps, slow controlled tempo.",
        stop_conditions=["Sharp shoulder pain", "Loss of neutral neck (chin jutting forward)"],
        contraindication_tags=["acute_rotator_cuff_tear"],
    ),
    # ─── Neck ───────────────────────────────────────────────────────────
    SeedExercise(
        id="neck-iso-chin-tuck",
        name="Chin Tuck — Isometric Hold",
        phase="isometric_stabilization",
        kinematic_group="spine",
        summary="Cervical deep flexor activation. Foundation for neck stability.",
        instructions=[
            "Sit or stand with your spine straight.",
            "Gently draw your chin straight back, as if making a double chin.",
            "Hold for the count, keeping your eyes level — don't tilt your head.",
        ],
        dose="3 sets of 8 holds, 10 seconds each.",
        stop_conditions=["Dizziness", "Sharp neck pain", "Numbness or tingling in arms"],
        contraindication_tags=["acute_whiplash", "cervical_fracture"],
    ),
    SeedExercise(
        id="neck-rom-rotation",
        name="Seated Cervical Rotation",
        phase="controlled_range_of_motion",
        kinematic_group="spine",
        summary="Gentle neck rotation within comfortable range.",
        instructions=[
            "Sit tall with shoulders relaxed.",
            "Slowly turn your head to look over one shoulder.",
            "Move slowly and smoothly — never force the range.",
            "Return to center and repeat to the other side.",
        ],
        dose="2 sets of 8 reps per side.",
        stop_conditions=["Sharp pain", "Dizziness", "Radiating arm pain"],
        contraindication_tags=["acute_whiplash", "cervical_radiculopathy"],
    ),
    # ─── Elbow ─────────────────────────────────────────────────────────
    SeedExercise(
        id="elbow-iso-wrist flexion",
        name="Wrist Flexor Isometric",
        phase="isometric_stabilization",
        kinematic_group="upper_limb",
        summary="Load-free forearm flexor activation for elbow health.",
        instructions=[
            "Extend your arm in front, palm up.",
            "With your other hand, gently press down on your fingers.",
            "Resist without actually letting your fingers move down.",
        ],
        dose="3 sets of 5 holds, 10 seconds each.",
        stop_conditions=["Elbow pain during the hold", "Tingling in fingers"],
        contraindication_tags=["medial_epicondylitis_acute"],
    ),
    SeedExercise(
        id="elbow-rom-supination",
        name="Seated Supination-Pronation",
        phase="controlled_range_of_motion",
        kinematic_group="upper_limb",
        summary="Forearm rotation without loading the elbow.",
        instructions=[
            "Sit with elbow at 90 degrees, held at your side.",
            "Rotate your palm up (supination) then down (pronation).",
            "Keep the movement slow and controlled.",
        ],
        dose="2 sets of 12 reps.",
        stop_conditions=["Elbow pain during movement", "Clicking or catching"],
        contraindication_tags=["tennis_elbow_acute", "golfer_elbow_acute"],
    ),
    # ─── Ankle ─────────────────────────────────────────────────────────
    SeedExercise(
        id="ankle-iso-calf-raise",
        name="Double-Leg Calf Raise",
        phase="isometric_stabilization",
        kinematic_group="lower_limb",
        summary="Low-load calf activation for ankle stability.",
        instructions=[
            "Stand holding a wall or chair for balance.",
            "Rise up onto the balls of your feet.",
            "Hold at the top, then lower slowly.",
        ],
        dose="3 sets of 12 reps.",
        stop_conditions=["Sharp ankle pain", "Loss of balance"],
        contraindication_tags=["acute_ankle_sprain_moderate", "achilles_tendinopathy_acute"],
    ),
    SeedExercise(
        id="ankle-rom-alphabet",
        name="Ankle Alphabet",
        phase="controlled_range_of_motion",
        kinematic_group="lower_limb",
        summary="Trace the alphabet with your toes to restore ankle mobility.",
        instructions=[
            "Sit with leg extended, pen strapped to your big toe (or imagine drawing).",
            "Trace each letter of the alphabet with your foot.",
            "Move only at the ankle — keep your leg still.",
            "Use large letters for more range.",
        ],
        dose="2-3 times through the full alphabet.",
        stop_conditions=["Sharp pain", "Excessive swelling"],
        contraindication_tags=["ankle_fracture", "post_ankle_surgery"],
    ),
    # ─── Wrist ─────────────────────────────────────────────────────────
    SeedExercise(
        id="wrist-iso-prayer-stretch",
        name="Prayer Stretch — Wrist Extension",
        phase="isometric_stabilization",
        kinematic_group="upper_limb",
        summary="Gentle wrist extensor stretch with activation.",
        instructions=[
            "Press palms together in front of chest, fingers pointing up.",
            "Slowly lower hands while keeping palms pressed together.",
            "Stop when you feel a stretch in your inner forearms/wrists.",
        ],
        dose="3 sets of 30 seconds.",
        stop_conditions=["Sharp wrist pain", "Numbness in fingers"],
        contraindication_tags=["carpal_tunnel_acute", "wrist_fracture"],
    ),
    SeedExercise(
        id="wrist-rom-circles",
        name="Wrist Circles",
        phase="controlled_range_of_motion",
        kinematic_group="upper_limb",
        summary="Gentle full-range wrist mobility.",
        instructions=[
            "Extend arms in front, make fists.",
            "Slowly rotate wrists in circles — clockwise, then counter.",
            "Keep movements smooth and controlled.",
        ],
        dose="2 sets of 10 circles each direction.",
        stop_conditions=["Pain during circles", "Clicking"],
        contraindication_tags=["wrist_fracture", "post_carpal_tunnel_release"],
    ),
]
