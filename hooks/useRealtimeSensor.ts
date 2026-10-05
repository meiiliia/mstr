"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SensorReading } from "@/lib/types/database";

export function useRealtimeSensor(
  sessionId: number | null,
  initialReadings: SensorReading[] = []
) {
  const [readings, setReadings] =
    useState<SensorReading[]>(initialReadings);

  const [latestReading, setLatestReading] =
    useState<SensorReading | null>(
      initialReadings.length > 0
        ? initialReadings[initialReadings.length - 1]
        : null
    );

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
          const newReading = payload.new as SensorReading;

          setReadings((current) => {
            const updated = [...current, newReading];

            // Simpan maksimal 30 data terakhir
            return updated.slice(-30);
          });

          setLatestReading(newReading);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return {
    readings,
    latestReading,
  };
}