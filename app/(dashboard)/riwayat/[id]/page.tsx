import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDuration(
  startedAt: string | null,
  endedAt: string | null
) {
  if (!startedAt) return "-";

  const start = new Date(startedAt).getTime();
  const end = endedAt
    ? new Date(endedAt).getTime()
    : Date.now();

  const totalSeconds = Math.max(
    0,
    Math.floor((end - start) / 1000)
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours} jam ${minutes} menit ${seconds} detik`;
}

export default async function SessionDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const sessionId = Number(id);

  if (Number.isNaN(sessionId)) {
    return (
      <div className="space-y-6">
        <Link href="/riwayat">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Kembali
          </Button>
        </Link>

        <Card>
          <p className="text-red-500">
            ID sesi tidak valid.
          </p>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();

  const { data: session, error: sessionError } =
    await supabase
      .from("sessions")
      .select(`
        *,
        substrates (
          id,
          name
        )
      `)
      .eq("id", sessionId)
      .single();

  if (sessionError || !session) {
    return (
      <div className="space-y-6">
        <Link href="/riwayat">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Kembali
          </Button>
        </Link>

        <Card>
          <p className="text-red-500">
            Sesi tidak ditemukan.
          </p>
        </Card>
      </div>
    );
  }

  const { data: readings, error: readingsError } =
    await supabase
      .from("sensor_readings")
      .select("*")
      .eq("session_id", sessionId)
      .order("recorded_at", {
        ascending: false,
      });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <Link href="/riwayat">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Riwayat
          </Button>
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">
            Detail Sesi #{session.id}
          </h1>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Detail eksperimen dan hasil pengukuran MFC.
          </p>
        </div>
      </div>

      {/* Informasi Sesi */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Substrat
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {session.substrates?.name ?? "-"}
            </h2>
          </div>

          <Badge
            variant={
              session.status === "running"
                ? "success"
                : "secondary"
            }
          >
            {session.status === "running"
              ? "Sedang Berjalan"
              : "Selesai"}
          </Badge>
        </div>
      </Card>

      {/* Parameter Eksperimen */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Parameter Eksperimen
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card>
            <p className="text-sm text-[var(--muted-foreground)]">
              pH
            </p>
            <p className="mt-2 text-xl font-semibold">
              {session.ph ?? "-"}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-[var(--muted-foreground)]">
              Suhu
            </p>
            <p className="mt-2 text-xl font-semibold">
              {session.temperature ?? "-"} °C
            </p>
          </Card>

          <Card>
            <p className="text-sm text-[var(--muted-foreground)]">
              Volume
            </p>
            <p className="mt-2 text-xl font-semibold">
              {session.volume ?? "-"} mL
            </p>
          </Card>

          <Card>
            <p className="text-sm text-[var(--muted-foreground)]">
              Resistor Beban
            </p>
            <p className="mt-2 text-xl font-semibold">
              {session.load_resistance ?? "-"} Ω
            </p>
          </Card>

        </div>
      </div>

      {/* Waktu Sesi */}
      <Card>
        <h2 className="text-lg font-semibold">
          Waktu Sesi
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">

          <div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Mulai
            </p>
            <p className="mt-1 font-medium">
              {formatDate(session.started_at)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Selesai
            </p>
            <p className="mt-1 font-medium">
              {formatDate(session.ended_at)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Durasi
            </p>
            <p className="mt-1 font-medium">
              {formatDuration(
                session.started_at,
                session.ended_at
              )}
            </p>
          </div>

        </div>
      </Card>

      {/* Data Sensor */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Data Pengukuran
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Data yang diterima dari sensor INA219.
            </p>
          </div>

          <span className="text-sm text-[var(--muted-foreground)]">
            {readings?.length ?? 0} data
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">

          {readingsError ? (
            <p className="text-sm text-red-500">
              Gagal mengambil data sensor.
            </p>
          ) : !readings || readings.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium">
                Belum ada data pengukuran
              </p>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Data INA219 akan muncul setelah ESP32
                mengirimkan hasil pengukuran.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Voltage</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Power</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {readings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>
                      {formatDate(reading.recorded_at)}
                    </TableCell>

                    <TableCell>
                      {Number(reading.voltage).toFixed(3)} V
                    </TableCell>

                    <TableCell>
                      {Number(reading.current).toFixed(3)} mA
                    </TableCell>

                    <TableCell>
                      {Number(reading.power).toFixed(3)} mW
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