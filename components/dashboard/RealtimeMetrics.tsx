"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import MetricCard from "@/components/dashboard/MetricCard";

import { Zap, Activity, Gauge } from "lucide-react";

type SensorReading = {
  id: number;
  session_id: number;
  voltage: number;
  current: number;
  power: number;
  recorded_at: string;
};

type Props = {
  sessionId: number | null;
  initialReading: SensorReading | null;
};

export default function RealtimeMetrics({
  sessionId,
  initialReading,
}: Props) {
  const [reading, setReading] =
    useState<SensorReading | null>(initialReading);

  useEffect(() => {
    setReading(initialReading);
  }, [initialReading]);

  useEffect(() => {
    if (!sessionId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`sensor-readings-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setReading(payload.new as SensorReading);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return (
    <>
      <MetricCard
        title="Tegangan"
        value={
          reading
            ? Number(reading.voltage).toFixed(3)
            : "0.000"
        }
        unit="V"
        icon={<Zap size={20} />}
      />

      <MetricCard
        title="Arus"
        value={
          reading
            ? Number(reading.current).toFixed(3)
            : "0.000"
        }
        unit="mA"
        icon={<Activity size={20} />}
      />

      <MetricCard
        title="Daya"
        value={
          reading
            ? Number(reading.power).toFixed(3)
            : "0.000"
        }
        unit="mW"
        icon={<Gauge size={20} />}
      />
    </>
  );
}