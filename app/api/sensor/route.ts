import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      session_id,
      voltage,
      current,
      power,
    } = body;

    // Validasi session_id
    if (
      session_id === undefined ||
      session_id === null ||
      Number.isNaN(Number(session_id))
    ) {
      return NextResponse.json(
        {
          error: "session_id wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    // Validasi data sensor
    if (
      voltage === undefined ||
      current === undefined ||
      power === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "voltage, current, dan power wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const voltageNumber = Number(voltage);
    const currentNumber = Number(current);
    const powerNumber = Number(power);

    if (
      Number.isNaN(voltageNumber) ||
      Number.isNaN(currentNumber) ||
      Number.isNaN(powerNumber)
    ) {
      return NextResponse.json(
        {
          error:
            "Nilai voltage, current, dan power harus berupa angka.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    // Pastikan sesi memang sedang berjalan
    const { data: session, error: sessionError } =
      await supabase
        .from("sessions")
        .select("id, status")
        .eq("id", Number(session_id))
        .single();

    if (sessionError || !session) {
      return NextResponse.json(
        {
          error: "Sesi tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    if (session.status !== "running") {
      return NextResponse.json(
        {
          error: "Sesi sudah tidak berjalan.",
        },
        {
          status: 400,
        }
      );
    }

    // Simpan data sensor
    const { data, error } = await supabase
      .from("sensor_readings")
      .insert({
        session_id: Number(session_id),
        voltage: voltageNumber,
        current: currentNumber,
        power: powerNumber,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase sensor error:", error);

      return NextResponse.json(
        {
          error: "Gagal menyimpan data sensor.",
          detail: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Data sensor berhasil disimpan.",
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Sensor API error:", error);

    return NextResponse.json(
      {
        error: "Request tidak valid.",
      },
      {
        status: 400,
      }
    );
  }
}