"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageIcon, Loader2, X } from "lucide-react";

import { uploadVarietyImage } from "@/actions/uploadVarietyImage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  adminKey: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function ImageUploader({ value, onChange, adminKey }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Дозволені формати: JPEG, PNG, WebP");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Файл не повинен перевищувати 10 МБ");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadVarietyImage(formData, adminKey);

    if (result.error) {
      toast.error(result.error);
    } else if (result.url) {
      onChange(result.url);
      toast.success("Зображення завантажено");
    }

    setUploading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleClear() {
    onChange("");
  }

  return (
    <div className="space-y-2">
      <Label>Зображення</Label>

      {value ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-border">
          <img
            src={value}
            alt="Preview"
            className="h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
            aria-label="Видалити зображення"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {uploading
              ? "Завантаження…"
              : "Перетягніть файл або оберіть з пристрою"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            Обрати файл
          </Button>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP — до 10 МБ
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
