"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { Substrate } from "@/lib/types/database";

type Props = {
  substrates: Substrate[];
};

export default function SessionForm({
  substrates,
}: Props) {
  const router = useRouter();

  const [substrateId, setSubstrateId] = useState("");
  const [ph, setPh] = useState("");
  const [temperature, setTemperature] = useState("");
  const [volume, setVolume] = useState("");
  const [loadResistance, setLoadResistance] =
    useState("1000");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!substrateId) {
      setError("Silakan pilih substrat.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          substrate_id: Number(substrateId),
          ph,
          temperature,
          volume,
          load_resistance: loadResistance,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Gagal memulai sesi."
        );
      }

      router.refresh();
      router.push("/sesi");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal memulai sesi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <Select
        label="Substrat"
        value={substrateId}
        onChange={(event) =>
          setSubstrateId(event.target.value)
        }
        options={substrates.map((substrate) => ({
          label: substrate.name,
          value: String(substrate.id),
        }))}
        required
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="pH"
          type="number"
          step="0.01"
          min="0"
          max="14"
          value={ph}
          onChange={(event) =>
            setPh(event.target.value)
          }
          placeholder="Contoh: 6.50"
        />

        <Input
          label="Suhu (°C)"
          type="number"
          step="0.01"
          value={temperature}
          onChange={(event) =>
            setTemperature(event.target.value)
          }
          placeholder="Contoh: 27.50"
        />

        <Input
          label="Volume (mL)"
          type="number"
          step="0.01"
          min="0"
          value={volume}
          onChange={(event) =>
            setVolume(event.target.value)
          }
          placeholder="Contoh: 500"
        />

        <Input
          label="Resistor Beban (Ω)"
          type="number"
          step="0.01"
          min="0"
          value={loadResistance}
          onChange={(event) =>
            setLoadResistance(event.target.value)
          }
          placeholder="Contoh: 1000"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={loading}
        >
          {loading
            ? "Memulai Sesi..."
            : "Mulai Sesi"}
        </Button>
      </div>
    </form>
  );
}