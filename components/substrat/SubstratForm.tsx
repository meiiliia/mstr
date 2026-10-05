"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Substrate } from "@/lib/types/database";

type Props = {
  substrate?: Substrate | null;
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function SubstratForm({
  substrate,
  onSuccess,
  onCancel,
}: Props) {
  const [name, setName] = useState(
    substrate?.name ?? ""
  );

  const [description, setDescription] = useState(
    substrate?.description ?? ""
  );

  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(substrate);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/substrates", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: substrate?.id,
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Gagal menyimpan substrat."
        );
      }

      setName("");
      setDescription("");

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan substrat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Nama Substrat"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        placeholder="Contoh: Ekoenzim Nanas"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium">
          Deskripsi
        </label>

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Deskripsi substrat..."
          rows={4}
          className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Batal
          </Button>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Tambah Substrat"}
        </Button>
      </div>
    </form>
  );
}