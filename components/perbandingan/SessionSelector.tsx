"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { Session, Substrate } from "@/lib/types/database";

type SessionWithSubstrate = Session & {
  substrates: Pick<Substrate, "id" | "name"> | null;
};

type Props = {
  sessions: SessionWithSubstrate[];
};

export default function SessionSelector({
  sessions,
}: Props) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  function toggleSession(id: number) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      // Maksimal 4 sesi
      if (current.length >= 4) {
        return current;
      }

      return [...current, id];
    });
  }

  function handleCompare() {
    if (selectedIds.length < 2) {
      return;
    }

    router.push(
      `/perbandingan?ids=${selectedIds.join(",")}`
    );
  }

  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold">
          Pilih Sesi
        </h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Pilih minimal 2 dan maksimal 4 sesi untuk dibandingkan.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {sessions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-medium">
              Belum ada sesi selesai
            </p>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Selesaikan eksperimen terlebih dahulu untuk
              melakukan perbandingan.
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            const checked = selectedIds.includes(session.id);

            return (
              <label
                key={session.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                  checked
                    ? "border-[var(--primary)] bg-[var(--secondary)]"
                    : "border-[var(--border)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    toggleSession(session.id)
                  }
                  className="h-4 w-4 accent-green-600"
                />

                <div className="min-w-0">
                  <p className="font-medium">
                    Sesi #{session.id}
                  </p>

                  <p className="text-sm text-[var(--muted-foreground)]">
                    {session.substrates?.name ?? "-"}
                    {" • "}
                    {session.started_at
                      ? new Date(
                          session.started_at
                        ).toLocaleString("id-ID")
                      : "-"}
                  </p>
                </div>
              </label>
            );
          })
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          {selectedIds.length} sesi dipilih
        </p>

        <Button
          onClick={handleCompare}
          disabled={selectedIds.length < 2}
        >
          Bandingkan
        </Button>
      </div>
    </Card>
  );
}