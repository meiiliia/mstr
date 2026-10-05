import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("substrates")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

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
        error: "Gagal mengambil data substrat.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description ?? null;

    if (!name) {
      return NextResponse.json(
        {
          error: "Nama substrat wajib diisi.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("substrates")
      .insert({
        name,
        description,
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
  } catch {
    return NextResponse.json(
      {
        error: "Request tidak valid.",
      },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);
    const name = body.name?.trim();
    const description = body.description ?? null;

    if (!id || !name) {
      return NextResponse.json(
        {
          error: "ID dan nama substrat wajib diisi.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("substrates")
      .update({
        name,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
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
  } catch {
    return NextResponse.json(
      {
        error: "Request tidak valid.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          error: "ID substrat wajib diisi.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("substrates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Request tidak valid.",
      },
      { status: 400 }
    );
  }
}