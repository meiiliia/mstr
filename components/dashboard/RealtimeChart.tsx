"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

export type ChartData = {
  time: string;
  voltage: number;
  current: number;
  power: number;
};

type SensorReading = {
  id: number;
  session_id: number;
  voltage: number;
  current: number;
  power: number;
  recorded_at: string;
};

type Props = {
  data: ChartData[];
  sessionId: number | null;
};

export default function RealtimeChart({
  data,
  sessionId,
}: Props) {
  const [chartData, setChartData] =
    useState<ChartData[]>(data);

  // Sinkronkan data awal dari server
  useEffect(() => {
    setChartData(data);
  }, [data]);

  // Realtime Supabase
  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`chart-sensor-readings-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const reading =
            payload.new as SensorReading;

          const newPoint: ChartData = {
            time: new Date(
              reading.recorded_at
            ).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),

            voltage: Number(reading.voltage),

            current: Number(reading.current),

            power: Number(reading.power),
          };

          setChartData((current) => [
            ...current,
            newPoint,
          ].slice(-30));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold">
          Grafik Pengukuran
        </h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Perubahan voltage, current, dan power.
        </p>
      </div>

      <div className="mt-6 h-[350px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="font-medium">
                Belum ada data
              </p>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Data sensor akan muncul ketika ESP32
                mulai mengirimkan pengukuran.
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="voltage"
                name="Voltage (V)"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="current"
                name="Current (mA)"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="power"
                name="Power (mW)"
                stroke="#d97706"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}