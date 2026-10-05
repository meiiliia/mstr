"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SubstratTable from "@/components/substrat/SubstratTable";
import SubstratForm from "@/components/substrat/SubstratForm";
import type { Substrate } from "@/lib/types/database";
import { Plus, X } from "lucide-react";

export default function SubstratPage() {
  const [substrates, setSubstrates] = useState<Substrate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubstrate, setEditingSubstrate] =
    useState<Substrate | null>(null);

  async function loadSubstrates() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/substrates");

      if (!response.ok) {
        throw new Error("Gagal mengambil data substrat.");
      }

      const data = await response.json();

      setSubstrates(data);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat data substrat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubstrates();
  }, []);

  function handleAdd() {
    setEditingSubstrate(null);
    setShowForm(true);
  }

  function handleEdit(substrate: Substrate) {
    setEditingSubstrate(substrate);
    setShowForm(true);
  }

  async function handleDelete(substrate: Substrate) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus "${substrate.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/substrates", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: substrate.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Gagal menghapus substrat."
        );
      }

      await loadSubstrates();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus substrat."
      );
    }
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingSubstrate(null);
    loadSubstrates();
  }

  function handleCancel() {
    setShowForm(false);
    setEditingSubstrate(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Substrat
          </h1>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Kelola substrat yang digunakan dalam eksperimen MFC.
          </p>
        </div>

        {!showForm && (
          <Button onClick={handleAdd}>
            <Plus size={17} className="mr-2" />
            Tambah Substrat
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {editingSubstrate
                  ? "Edit Substrat"
                  : "Tambah Substrat"}
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {editingSubstrate
                  ? "Perbarui informasi substrat."
                  : "Masukkan informasi substrat baru."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--muted)]"
              aria-label="Tutup form"
            >
              <X size={18} />
            </button>
          </div>

          <SubstratForm
            substrate={editingSubstrate}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </Card>
      )}

      {/* Data */}
      <Card className="p-0">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">
            Daftar Substrat
          </h2>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {substrates.length} substrat terdaftar
          </p>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                Memuat data substrat...
              </p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[var(--danger)]">
                {error}
              </p>

              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={loadSubstrates}
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            <SubstratTable
              substrates={substrates}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </Card>
    </div>
  );
}