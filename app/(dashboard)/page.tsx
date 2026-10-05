import {
  Zap,
  Activity,
  Gauge,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import Card from "@/components/ui/Card";

import MetricCard from "@/components/dashboard/MetricCard";
import RunningTimeCard from "@/components/dashboard/RunningTimeCard";

import RealtimeChart, {
  type ChartData,
} from "@/components/dashboard/RealtimeChart";

import RealtimeMetrics from "@/components/dashboard/RealtimeMetrics";

import SessionInfo from "@/components/dashboard/SessionInfo";

type SensorReading = {
  id: number;
  session_id: number;
  voltage: number;
  current: number;
  power: number;
  recorded_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // ==========================================
  // AMBIL SESI AKTIF
  // ==========================================

  const { data: activeSession } =
    await supabase
      .from("sessions")
      .select(`
        *,
        substrates (
          id,
          name
        )
      `)
      .eq("status", "running")
      .order("started_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  // ==========================================
  // DATA SENSOR
  // ==========================================

  let readings: SensorReading[] = [];

  if (activeSession) {
    const { data } =
      await supabase
        .from("sensor_readings")
        .select("*")
        .eq(
          "session_id",
          activeSession.id
        )
        .order("recorded_at", {
          ascending: true,
        })
        .limit(30);

    readings =
      (data as SensorReading[]) ?? [];
  }

  // ==========================================
  // DATA SENSOR TERBARU
  // ==========================================

  const latestReading =
    readings.length > 0
      ? readings[readings.length - 1]
      : null;

  // ==========================================
  // DATA GRAFIK
  // ==========================================

  const chartData: ChartData[] =
    readings.map((reading) => ({
      time: new Date(
        reading.recorded_at
      ).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),

      voltage:
        Number(reading.voltage),

      current:
        Number(reading.current),

      power:
        Number(reading.power),
    }));

  // ==========================================
  // INFORMASI SESI
  // ==========================================

  const sessionInfo = activeSession
    ? {
        id: activeSession.id,

        substrate:
          activeSession.substrates?.name ??
          "-",

        ph:
          activeSession.ph,

        temperature:
          activeSession.temperature,

        volume:
          activeSession.volume,

        loadResistance:
          activeSession.load_resistance,

        startedAt:
          activeSession.started_at,
      }
    : null;

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Monitoring Microbial Fuel Cell secara realtime.
        </p>
      </div>

      {/* ========================================
          4 CARD METRIC
      ======================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* CARD 1 — TEGANGAN */}
        <RealtimeMetrics
          sessionId={
            activeSession?.id ?? null
          }
          initialReading={
            latestReading
          }
        />

        {/* CARD 4 — WAKTU BERJALAN */}
        <RunningTimeCard
          startedAt={
            activeSession?.started_at ??
            null
          }
        />

      </div>

      {/* ========================================
          GRAFIK
      ======================================== */}

      <RealtimeChart
        data={chartData}
        sessionId={activeSession?.id ?? null}
      />

      {/* ========================================
          INFORMASI SESI
      ======================================== */}

      <SessionInfo
        session={sessionInfo}
      />

      {/* ========================================
          STATUS SISTEM
      ======================================== */}

      <Card>
        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-semibold">
              Status Sistem
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Status koneksi data MFC.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                activeSession
                  ? "bg-[var(--success)]"
                  : "bg-[var(--muted-foreground)]"
              }`}
            />

            <span className="text-sm font-medium">
              {activeSession
                ? "Sesi Aktif"
                : "Standby"}
            </span>

          </div>

        </div>
      </Card>

    </div>
  );
}