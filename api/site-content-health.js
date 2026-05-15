import { createClient } from "@supabase/supabase-js";

const SUPABASE_CONTENT_TABLE = process.env.SUPABASE_CONTENT_TABLE || "site_content";

function getEnvInfo() {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasServiceRoleKey: Boolean(supabaseServiceRoleKey),
  };
}

function getSupabaseClient() {
  const env = getEnvInfo();

  if (!env.hasSupabaseUrl || !env.hasServiceRoleKey) {
    const missing = [];
    if (!env.hasSupabaseUrl) missing.push("SUPABASE_URL");
    if (!env.hasServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export default async function handler(req, res) {
  const trace = req.headers["x-vercel-id"] || "no-trace";

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const env = getEnvInfo();

  const result = {
    ok: false,
    trace,
    checks: {
      env: {
        hasSupabaseUrl: env.hasSupabaseUrl,
        hasServiceRoleKey: env.hasServiceRoleKey,
      },
      tableRead: null,
      tableWrite: null,
    },
  };

  if (!env.hasSupabaseUrl || !env.hasServiceRoleKey) {
    return res.status(500).json({
      ...result,
      error: "Missing required env for Supabase checks.",
      code: "CONFIG_MISSING",
    });
  }

  try {
    const supabase = getSupabaseClient();

    const { error: readError } = await supabase
      .from(SUPABASE_CONTENT_TABLE)
      .select("id")
      .limit(1);

    result.checks.tableRead = readError
      ? {
          ok: false,
          message: readError.message,
          details: readError.details,
          hint: readError.hint,
        }
      : { ok: true };

    const { error: writeError } = await supabase.from(SUPABASE_CONTENT_TABLE).upsert(
      {
        id: 1,
        content: {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    result.checks.tableWrite = writeError
      ? {
          ok: false,
          message: writeError.message,
          details: writeError.details,
          hint: writeError.hint,
        }
      : { ok: true };

    result.ok = Boolean(result.checks.tableRead?.ok && result.checks.tableWrite?.ok);

    return res.status(result.ok ? 200 : 500).json(result);
  } catch (error) {
    console.error("[site-content-health] failed", {
      trace,
      message: error instanceof Error ? error.message : String(error),
    });

    return res.status(500).json({
      ...result,
      error: "Health check failed.",
      code: "HEALTH_CHECK_FAILED",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
