import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const voltage = Number(body.voltage);
    const current = Number(body.current);
    const power = Number(body.power);

    // Validasi data sensor
    if (
      !Number.isFinite(voltage) ||
      !Number.isFinite(current) ||
      !Number.isFinite(power)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data sensor tidak valid.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ========================================
    // CARI SESI YANG SEDANG BERJALAN
    // ========================================

    const { data: activeSession, error: sessionError } =
      await supabase
        .from("sessions")
        .select("id")
        .eq("status", "running")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (sessionError) {
      console.error("Gagal mencari sesi aktif:", sessionError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memeriksa sesi aktif.",
        },
        { status: 500 }
      );
    }

    // ========================================
    // TIDAK ADA SESI AKTIF
    // ========================================

    if (!activeSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada sesi yang sedang berjalan.",
        },
        { status: 409 }
      );
    }

    // ========================================
    // SIMPAN DATA SENSOR
    // ========================================

    const { data: reading, error: insertError } =
      await supabase
        .from("sensor_readings")
        .insert({
          session_id: activeSession.id,
          voltage,
          current,
          power,
        })
        .select()
        .single();

    if (insertError) {
      console.error("Gagal menyimpan data sensor:", insertError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal menyimpan data sensor.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data sensor berhasil disimpan.",
        session_id: activeSession.id,
        data: reading,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sensor API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Request tidak valid.",
      },
      { status: 400 }
    );
  }
}