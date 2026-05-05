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

interface FileUploadProps {
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
    <div className="space-y-4">
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
          "rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300",
          dragging
            ? "border-brand-400 bg-brand-50 shadow-lg shadow-brand-100"
            : "border-slate-200 bg-slate-50/80 hover:border-brand-300 hover:bg-brand-50/50"
        )}
      >
        <div className="mx-auto w-16 h-16 rounded-3xl bg-white shadow-premium flex items-center justify-center mb-4">
          <Upload className="h-7 w-7 text-brand-600" />
        </div>
        <p className="text-base font-bold text-ink">
          Drop files here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-brand-600 font-black underline underline-offset-4"
          >
            browse
          </button>
        </p>
        <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
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

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm font-bold text-red-600" role="alert">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Lock className="h-4 w-4" />
        Files are scanned by an extractor agent; raw contents are not shown to other users
      </div>

      {files.length > 0 && (
        <ul className="mt-6 space-y-3">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-premium"
            >
              <FileIcon category={f.category} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-black text-ink">{f.filename}</p>
                  <StatusBadge status={f.status} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {UPLOAD_CATEGORY_LABELS[f.category]} · {humanSize(f.sizeBytes)}
                </p>
                {f.error && (
                  <p className="mt-1 text-xs font-bold text-red-600">{f.error}</p>
                )}
              </div>
              <CategorySelect
                value={f.category}
                onChange={(next) => updateFile(f.id, { category: next })}
              />
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label={`Remove ${f.filename}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FileIcon({ category }: { category: UploadedFileCategory }) {
  const isImage = category === "imaging_photo" || category === "imaging_dicom";
  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50 border border-slate-100 text-brand-600">
      {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
    </div>
  );
}

function StatusBadge({ status }: { status: UploadedFileMeta["status"] }) {
  const style =
    status === "uploaded"
      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
      : status === "failed"
        ? "bg-red-50 text-red-600 border border-red-100"
        : "bg-slate-100 text-slate-400";
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
    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest", style)}>
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
      className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-xs font-bold text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
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

async function simulateUpload(
  _file: File,
  meta: UploadedFileMeta
): Promise<{ storageKey: string }> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
  return { storageKey: `local-draft/${meta.id}` };
}
