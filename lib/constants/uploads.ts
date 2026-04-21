import type { UploadedFileCategory } from "@/lib/types/intake";

/** 25 MB per file — tuned for typical radiology PDF / phone-camera JPEG. */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
export const MAX_FILES_PER_INTAKE = 8;

export const ACCEPTED_MIME_TYPES: Record<UploadedFileCategory, string[]> = {
  imaging_report: ["application/pdf"],
  imaging_dicom: ["application/dicom", "application/octet-stream"],
  imaging_photo: ["image/jpeg", "image/png", "image/webp", "image/heic"],
  clinical_note: ["application/pdf", "text/plain"],
  lab_report: ["application/pdf"],
  other: ["application/pdf", "image/jpeg", "image/png"]
};

/** Accept string for <input type="file">. Union of every category. */
export const ACCEPT_ATTRIBUTE =
  Array.from(
    new Set(Object.values(ACCEPTED_MIME_TYPES).flat())
  ).join(",") + ",.pdf,.jpg,.jpeg,.png,.webp,.heic,.dcm";

export const UPLOAD_CATEGORY_LABELS: Record<UploadedFileCategory, string> = {
  imaging_report: "Imaging report (MRI/CT/X-ray narrative)",
  imaging_dicom: "Raw DICOM imaging",
  imaging_photo: "Photo of a printed scan or report",
  clinical_note: "Clinical note or referral letter",
  lab_report: "Lab report",
  other: "Other clinical document"
};

export function inferCategory(file: File): UploadedFileCategory {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (mime === "application/dicom" || name.endsWith(".dcm")) return "imaging_dicom";
  if (mime.startsWith("image/")) return "imaging_photo";
  if (mime === "application/pdf") return "imaging_report";
  if (mime === "text/plain") return "clinical_note";
  return "other";
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
