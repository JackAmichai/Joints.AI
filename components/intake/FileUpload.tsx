"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Image as ImageIcon, Upload, X, Lock } from "lucide-react";
import { useIntakeStore } from "@/lib/store/intakeStore";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILES_PER_INTAKE,
  MAX_UPLOAD_BYTES,
  UPLOAD_CATEGORY_LABELS,
  humanSize,
  inferCategory
} from "@/lib/constants/uploads";
import type {
  UploadedFileCategory,
  UploadedFileMeta
} from "@/lib/types/intake";
import { uuid } from "@/lib/utils/uuid";
import { cn } from "@/lib/utils/cn";

/**
 * Handles selection, validation, and a simulated upload lifecycle.
 * The actual POST to object storage will be wired in step 2 of the
 * backend work — for now we transition metadata through status states
 * so the downstream review page and Extractor agent contract work today.
 */

interface FileUploadProps {
  /**
   * Optional upload handler. When omitted, we simulate a short async upload
   * so the UI can be exercised without a backend. Replace with the real
   * presigned-URL POST once the orchestrator endpoint is live.
   */
  uploadHandler?: (file: File, meta: UploadedFileMeta) => Promise<{ storageKey: string }>;
}

export function FileUpload({ uploadHandler }: FileUploadProps) {
  const { files, addFile, updateFile, removeFile } = useIntakeStore();
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);
      if (files.length + arr.length > MAX_FILES_PER_INTAKE) {
        setError(`You can upload up to ${MAX_FILES_PER_INTAKE} files per intake.`);
        return;
      }
      for (const file of arr) {
        if (file.size > MAX_UPLOAD_BYTES) {
          setError(`${file.name} exceeds the ${humanSize(MAX_UPLOAD_BYTES)} limit.`);
          continue;
        }
        const meta: UploadedFileMeta = {
          id: uuid(),
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          category: inferCategory(file),
          uploadedAt: new Date().toISOString(),
          status: "uploading"
        };
        addFile(meta);
        try {
          const handler = uploadHandler ?? simulateUpload;
          const { storageKey } = await handler(file, meta);
          updateFile(meta.id, { status: "uploaded", storageKey });
        } catch (err) {
          updateFile(meta.id, {
            status: "failed",
            error: err instanceof Error ? err.message : "Upload failed"
          });
        }
      }
    },
    [addFile, files.length, updateFile, uploadHandler]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files) void addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-bento border-2 border-dashed p-8 text-center transition-colors",
          dragging
            ? "border-accent bg-accent-soft"
            : "border-black/15 bg-paper-sunk"
        )}
      >
        <Upload className="mx-auto h-6 w-6 text-ink-muted" />
        <p className="mt-3 text-sm font-medium">
          Drop files here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-accent underline underline-offset-2"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          PDF, JPEG, PNG, WebP, HEIC, or DICOM · up to{" "}
          {humanSize(MAX_UPLOAD_BYTES)} each · max {MAX_FILES_PER_INTAKE} files
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error ? (
        <p className="mt-3 text-sm text-halt" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
        <Lock className="h-3.5 w-3.5" />
        Files are scanned by an extractor agent; raw contents are not shown to
        other users. You can remove any upload before submitting.
      </div>

      {files.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-bento border border-black/5 bg-paper-raised px-4 py-3"
            >
              <FileIcon category={f.category} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{f.filename}</p>
                  <StatusBadge status={f.status} />
                </div>
                <p className="text-xs text-ink-muted">
                  {UPLOAD_CATEGORY_LABELS[f.category]} · {humanSize(f.sizeBytes)}
                </p>
                {f.error ? (
                  <p className="mt-1 text-xs text-halt">{f.error}</p>
                ) : null}
              </div>
              <CategorySelect
                value={f.category}
                onChange={(next) => updateFile(f.id, { category: next })}
              />
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="rounded-full p-1.5 text-ink-muted hover:bg-paper-sunk hover:text-halt"
                aria-label={`Remove ${f.filename}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FileIcon({ category }: { category: UploadedFileCategory }) {
  const isImage = category === "imaging_photo" || category === "imaging_dicom";
  return (
    <div className="grid h-9 w-9 place-items-center rounded-lg bg-paper-sunk text-ink-muted">
      {isImage ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
    </div>
  );
}

function StatusBadge({ status }: { status: UploadedFileMeta["status"] }) {
  const style =
    status === "uploaded"
      ? "bg-accent-soft text-accent"
      : status === "failed"
        ? "bg-halt-soft text-halt"
        : "bg-paper-sunk text-ink-muted";
  const label =
    status === "uploaded"
      ? "Ready"
      : status === "uploading"
        ? "Uploading…"
        : status === "processing"
          ? "Processing"
          : status === "failed"
            ? "Failed"
            : "Queued";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", style)}>
      {label}
    </span>
  );
}

function CategorySelect({
  value,
  onChange
}: {
  value: UploadedFileCategory;
  onChange: (v: UploadedFileCategory) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as UploadedFileCategory)}
      className="rounded-lg border border-black/10 bg-paper-raised px-2 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
      aria-label="File category"
    >
      {Object.entries(UPLOAD_CATEGORY_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

/**
 * Placeholder upload — resolves after ~500ms with a fake storage key. The
 * real handler will request a presigned URL from the orchestrator, PUT the
 * blob, and return the resulting object key. Kept here so the UI is
 * exercisable without a live backend during initial scaffolding.
 */
async function simulateUpload(
  _file: File,
  meta: UploadedFileMeta
): Promise<{ storageKey: string }> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
  return { storageKey: `local-draft/${meta.id}` };
}
