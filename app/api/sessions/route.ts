import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
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

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal mengambil sesi aktif.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const substrateId = Number(body.substrate_id);
    const ph = body.ph !== "" ? Number(body.ph) : null;
    const temperature =
      body.temperature !== ""
        ? Number(body.temperature)
        : null;
    const volume =
      body.volume !== ""
        ? Number(body.volume)
        : null;
    const loadResistance =
      body.load_resistance !== ""
        ? Number(body.load_resistance)
        : null;

    if (!substrateId) {
      return NextResponse.json(
        {
          error: "Substrat wajib dipilih.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    /*
     * Cek apakah masih ada sesi yang sedang berjalan.
     */
    const { data: activeSession, error: activeError } =
      await supabase
        .from("sessions")
        .select("id")
        .eq("status", "running")
        .limit(1)
        .maybeSingle();

    if (activeError) {
      console.error(activeError);

      return NextResponse.json(
        {
          error: activeError.message,
        },
        { status: 500 }
      );
    }

    if (activeSession) {
      return NextResponse.json(
        {
          error:
            "Masih ada sesi yang sedang berjalan. Selesaikan sesi tersebut terlebih dahulu.",
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        substrate_id: substrateId,
        ph,
        temperature,
        volume,
        load_resistance: loadResistance,
        started_at: new Date().toISOString(),
        status: "running",
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Request tidak valid.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          error: "ID sesi wajib diisi.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sessions")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "running")
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal menyelesaikan sesi.",
      },
      { status: 500 }
    );
  }
}