import Link from "next/link";
import { Eye } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { createClient } from "@/lib/supabase/server";

function formatDuration(
  startedAt: string | null,
  endedAt: string | null
) {
  if (!startedAt || !endedAt) {
    return "-";
  }

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  const totalSeconds = Math.max(
    0,
    Math.floor((end - start) / 1000)
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }

  return `${minutes}m`;
}

function formatDate(date: string | null) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleString(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

export default async function RiwayatPage() {
  const supabase = await createClient();

  const { data: sessions, error } =
    await supabase
      .from("sessions")
      .select(`
        *,
        substrates (
          id,
          name
        )
      `)
      .order("started_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Riwayat Sesi
          </h1>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Riwayat seluruh eksperimen MFC.
          </p>
        </div>

        <Card>
          <p className="text-sm text-[var(--danger)]">
            Gagal mengambil data riwayat sesi.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Riwayat Sesi
        </h1>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Lihat seluruh riwayat eksperimen MFC yang telah dilakukan.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">
            Total Sesi
          </p>

          <p className="mt-2 text-3xl font-bold">
            {sessions?.length ?? 0}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">
            Sesi Selesai
          </p>

          <p className="mt-2 text-3xl font-bold text-[var(--primary)]">
            {sessions?.filter(
              (session) =>
                session.status === "completed"
            ).length ?? 0}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-0">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">
            Daftar Sesi
          </h2>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Klik detail untuk melihat informasi lengkap sesi.
          </p>
        </div>

        <div className="p-5">
          {!sessions ||
          sessions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium">
                Belum ada riwayat sesi
              </p>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Sesi eksperimen yang telah dilakukan akan muncul di sini.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>

                  <TableHead>
                    Substrat
                  </TableHead>

                  <TableHead>
                    pH
                  </TableHead>

                  <TableHead>
                    Suhu
                  </TableHead>

                  <TableHead>
                    Volume
                  </TableHead>

                  <TableHead>
                    Durasi
                  </TableHead>

                  <TableHead>
                    Mulai
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      #{session.id}
                    </TableCell>

                    <TableCell>
                      {session.substrates?.name ??
                        "-"}
                    </TableCell>

                    <TableCell>
                      {session.ph ?? "-"}
                    </TableCell>

                    <TableCell>
                      {session.temperature != null
                        ? `${session.temperature} °C`
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {session.volume != null
                        ? `${session.volume} mL`
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {formatDuration(
                        session.started_at,
                        session.ended_at
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(
                        session.started_at
                      )}
                    </TableCell>

                    <TableCell>
                      {session.status ===
                      "completed" ? (
                        <Badge variant="success">
                          Selesai
                        </Badge>
                      ) : (
                        <Badge variant="warning">
                          Berjalan
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end">
                        <Link
                          href={`/riwayat/${session.id}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye
                              size={16}
                              className="mr-1.5"
                            />

                            Detail
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}