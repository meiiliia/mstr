"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import type {
  Session,
  Substrate,
} from "@/lib/types/database";

type SessionWithSubstrate = Session & {
  substrates: Pick<
    Substrate,
    "id" | "name"
  > | null;
};

type Props = {
  session: SessionWithSubstrate;
};

export default function ActiveSession({
  session,
}: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session.started_at) {
      return;
    }

    function updateTimer() {
      const start = new Date(
        session.started_at as string
      ).getTime();

      const now = Date.now();

      setElapsed(
        Math.max(
          0,
          Math.floor((now - start) / 1000)
        )
      );
    }

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () => clearInterval(interval);
  }, [session.started_at]);

  function formatDuration(
    totalSeconds: number
  ) {
    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }

  async function handleFinish() {
    const confirmed = window.confirm(
      "Yakin ingin menyelesaikan sesi ini?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/sessions",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: session.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Gagal menyelesaikan sesi."
        );
      }

      window.location.reload();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyelesaikan sesi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <span className="text-sm font-semibold">
                Sesi Sedang Berjalan
              </span>
            </div>

            <h2 className="mt-2 text-xl font-bold">
              {session.substrates?.name ??
                "Substrat tidak ditemukan"}
            </h2>
          </div>

          <Badge variant="success">
            Running
          </Badge>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">
            pH
          </p>

          <p className="mt-2 text-2xl font-bold">
            {session.ph ?? "-"}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">
            Suhu
          </p>

          <p className="mt-2 text-2xl font-bold">
            {session.temperature != null
              ? `${session.temperature} °C`
              : "-"}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">
            Volume
          </p>

          <p className="mt-2 text-2xl font-bold">
            {session.volume != null
              ? `${session.volume} mL`
              : "-"}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">
            Resistor
          </p>

          <p className="mt-2 text-2xl font-bold">
            {session.load_resistance != null
              ? `${session.load_resistance} Ω`
              : "-"}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Clock3 size={18} />

            Durasi Sesi
          </div>

          <div className="mt-3 font-mono text-4xl font-bold tracking-wider text-[var(--primary)]">
            {formatDuration(elapsed)}
          </div>

          {session.started_at && (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Dimulai{" "}
              {new Date(
                session.started_at
              ).toLocaleString("id-ID")}
            </p>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2
            size={28}
            className="text-[var(--primary)]"
          />

          <div>
            <h3 className="font-semibold">
              Selesaikan Eksperimen
            </h3>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Pastikan pengambilan data sudah selesai
              sebelum mengakhiri sesi.
            </p>
          </div>

          <Button
            variant="danger"
            onClick={handleFinish}
            disabled={loading}
          >
            {loading
              ? "Menyelesaikan..."
              : "Selesaikan Sesi"}
          </Button>
        </div>
      </Card>
    </div>
  );
}