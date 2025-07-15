// app/api/history/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      "https://ruwaaywyobhsviwyxwfk.supabase.co",
      process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ summaries: [] }, { status: 500 });
    }

    return NextResponse.json({ summaries: data });
  } catch (error) {
    console.error("❌ Error in /api/history:", error);
    return NextResponse.json({ summaries: [] }, { status: 500 });
  }
}
