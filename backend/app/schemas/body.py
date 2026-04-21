from enum import Enum
from typing import Literal

from pydantic import BaseModel

"""Anatomical taxonomy. MUST stay in lockstep with the frontend
`lib/types/body.ts` file — the string values are used as vector-DB metadata
filter keys at retrieval time.
"""


class BodyRegion(str, Enum):
    cervical_spine = "cervical_spine"
    thoracic_spine = "thoracic_spine"
    lumbar_spine = "lumbar_spine"
    sacroiliac = "sacroiliac"
    shoulder_left = "shoulder_left"
    shoulder_right = "shoulder_right"
    elbow_left = "elbow_left"
    elbow_right = "elbow_right"
    wrist_left = "wrist_left"
    wrist_right = "wrist_right"
    hand_left = "hand_left"
    hand_right = "hand_right"
    hip_left = "hip_left"
    hip_right = "hip_right"
    knee_left = "knee_left"
    knee_right = "knee_right"
    ankle_left = "ankle_left"
    ankle_right = "ankle_right"
    foot_left = "foot_left"
    foot_right = "foot_right"
    jaw = "jaw"
    chest = "chest"
    abdomen = "abdomen"


KinematicGroup = Literal[
    "spine",
    "shoulder_complex",
    "upper_limb",
    "hip_complex",
    "lower_limb",
    "axial",
]


class BodyRegionMeta(BaseModel):
    id: BodyRegion
    label: str
    kinematic_group: KinematicGroup


BODY_REGION_META: dict[BodyRegion, BodyRegionMeta] = {
    BodyRegion.cervical_spine: BodyRegionMeta(id=BodyRegion.cervical_spine, label="Neck", kinematic_group="spine"),
    BodyRegion.thoracic_spine: BodyRegionMeta(id=BodyRegion.thoracic_spine, label="Upper back", kinematic_group="spine"),
    BodyRegion.lumbar_spine: BodyRegionMeta(id=BodyRegion.lumbar_spine, label="Lower back", kinematic_group="spine"),
    BodyRegion.sacroiliac: BodyRegionMeta(id=BodyRegion.sacroiliac, label="SI joint", kinematic_group="spine"),
    BodyRegion.shoulder_left: BodyRegionMeta(id=BodyRegion.shoulder_left, label="Left shoulder", kinematic_group="shoulder_complex"),
    BodyRegion.shoulder_right: BodyRegionMeta(id=BodyRegion.shoulder_right, label="Right shoulder", kinematic_group="shoulder_complex"),
    BodyRegion.elbow_left: BodyRegionMeta(id=BodyRegion.elbow_left, label="Left elbow", kinematic_group="upper_limb"),
    BodyRegion.elbow_right: BodyRegionMeta(id=BodyRegion.elbow_right, label="Right elbow", kinematic_group="upper_limb"),
    BodyRegion.wrist_left: BodyRegionMeta(id=BodyRegion.wrist_left, label="Left wrist", kinematic_group="upper_limb"),
    BodyRegion.wrist_right: BodyRegionMeta(id=BodyRegion.wrist_right, label="Right wrist", kinematic_group="upper_limb"),
    BodyRegion.hand_left: BodyRegionMeta(id=BodyRegion.hand_left, label="Left hand", kinematic_group="upper_limb"),
    BodyRegion.hand_right: BodyRegionMeta(id=BodyRegion.hand_right, label="Right hand", kinematic_group="upper_limb"),
    BodyRegion.hip_left: BodyRegionMeta(id=BodyRegion.hip_left, label="Left hip", kinematic_group="hip_complex"),
    BodyRegion.hip_right: BodyRegionMeta(id=BodyRegion.hip_right, label="Right hip", kinematic_group="hip_complex"),
    BodyRegion.knee_left: BodyRegionMeta(id=BodyRegion.knee_left, label="Left knee", kinematic_group="lower_limb"),
    BodyRegion.knee_right: BodyRegionMeta(id=BodyRegion.knee_right, label="Right knee", kinematic_group="lower_limb"),
    BodyRegion.ankle_left: BodyRegionMeta(id=BodyRegion.ankle_left, label="Left ankle", kinematic_group="lower_limb"),
    BodyRegion.ankle_right: BodyRegionMeta(id=BodyRegion.ankle_right, label="Right ankle", kinematic_group="lower_limb"),
    BodyRegion.foot_left: BodyRegionMeta(id=BodyRegion.foot_left, label="Left foot", kinematic_group="lower_limb"),
    BodyRegion.foot_right: BodyRegionMeta(id=BodyRegion.foot_right, label="Right foot", kinematic_group="lower_limb"),
    BodyRegion.jaw: BodyRegionMeta(id=BodyRegion.jaw, label="Jaw (TMJ)", kinematic_group="axial"),
    BodyRegion.chest: BodyRegionMeta(id=BodyRegion.chest, label="Chest", kinematic_group="axial"),
    BodyRegion.abdomen: BodyRegionMeta(id=BodyRegion.abdomen, label="Abdomen", kinematic_group="axial"),
}
