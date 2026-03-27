import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLE_NAME = "site_content";
const CONTENT_ROW_ID = 1;

async function testSupabaseConnection() {
  const { error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select("id")
    .limit(1);

  if (error) {
    console.error("[site-content] Supabase connection test failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return false;
  }

  console.log("Supabase connected successfully");
  return true;
}

function normalizeContent(input) {
  if (!input || typeof input !== "object") {
    return {};
  }

  return input;
}

export async function GET() {
  await testSupabaseConnection();

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select("content")
    .eq("id", CONTENT_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("[site-content][GET] Supabase read failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return NextResponse.json(
      { error: "Failed to fetch site content." },
      { status: 500 },
    );
  }

  return NextResponse.json(normalizeContent(data?.content), { status: 200 });
}

export async function POST(request) {
  await testSupabaseConnection();

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const content = normalizeContent(body);

  const { error } = await supabaseAdmin.from(TABLE_NAME).upsert(
    {
      id: CONTENT_ROW_ID,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("[site-content][POST] Supabase upsert failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return NextResponse.json(
      { error: "Failed to save site content." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
