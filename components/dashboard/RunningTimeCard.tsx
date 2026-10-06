"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import Card from "@/components/ui/Card";

type Props = {
  startedAt: string | null;
};

export default function RunningTimeCard({
  startedAt,
}: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt) {
      setElapsed(0);
      return;
    }

    const start = new Date(startedAt).getTime();

    function updateTimer() {
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
  }, [startedAt]);

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

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            Durasi Sesi
          </p>

          <p className="mt-3 text-2xl font-bold tabular-nums">
            {startedAt
              ? formatDuration(elapsed)
              : "00:00:00"}
          </p>

          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            {startedAt
              ? "Sesi sedang berjalan"
              : "Tidak ada sesi aktif"}
          </p>
        </div>

        <div className="rounded-lg bg-[var(--secondary)] p-2 text-[var(--primary)]">
          <Clock3 size={20} />
        </div>
      </div>
    </Card>
  );
}