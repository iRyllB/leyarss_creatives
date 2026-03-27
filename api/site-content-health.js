import { get as edgeGet } from "@vercel/edge-config";

const PRIMARY_CONTENT_KEY = "site-content";
const LEGACY_CONTENT_KEY = "site_content";

function parseEdgeConfigIdFromConnectionString() {
  const conn = process.env.EDGE_CONFIG;
  if (!conn || typeof conn !== "string") {
    return "";
  }

  try {
    const parsed = new URL(conn);
    return parsed.pathname.replace(/^\/+/, "") || "";
  } catch {
    return "";
  }
}

function getEnvInfo() {
  const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN || "";
  const edgeConfigId = process.env.EDGE_CONFIG_ID || parseEdgeConfigIdFromConnectionString();
  const edgeConfigConn = process.env.EDGE_CONFIG || "";

  return {
    token,
    edgeConfigId,
    hasToken: Boolean(token),
    hasEdgeConfigId: Boolean(edgeConfigId),
    hasEdgeConfigConnection: Boolean(edgeConfigConn),
  };
}

async function parseApiResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function checkRestRead(token, edgeConfigId, key) {
  const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items?key=${encodeURIComponent(key)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const payload = await parseApiResponse(response);

  return {
    ok: response.ok,
    status: response.status,
    payload,
  };
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
        hasToken: env.hasToken,
        hasEdgeConfigId: env.hasEdgeConfigId,
        hasEdgeConfigConnection: env.hasEdgeConfigConnection,
      },
      restReadPrimary: null,
      restReadLegacy: null,
      sdkReadPrimary: null,
      sdkReadLegacy: null,
    },
  };

  if (!env.hasToken || !env.hasEdgeConfigId) {
    return res.status(500).json({
      ...result,
      error: "Missing required env for write/read checks.",
      code: "CONFIG_MISSING",
    });
  }

  try {
    const [restPrimary, restLegacy] = await Promise.all([
      checkRestRead(env.token, env.edgeConfigId, PRIMARY_CONTENT_KEY),
      checkRestRead(env.token, env.edgeConfigId, LEGACY_CONTENT_KEY),
    ]);

    result.checks.restReadPrimary = {
      ok: restPrimary.ok,
      status: restPrimary.status,
    };
    result.checks.restReadLegacy = {
      ok: restLegacy.ok,
      status: restLegacy.status,
    };

    try {
      const value = await edgeGet(PRIMARY_CONTENT_KEY);
      result.checks.sdkReadPrimary = { ok: true, hasValue: Boolean(value) };
    } catch (error) {
      result.checks.sdkReadPrimary = {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }

    try {
      const legacyValue = await edgeGet(LEGACY_CONTENT_KEY);
      result.checks.sdkReadLegacy = { ok: true, hasValue: Boolean(legacyValue) };
    } catch (error) {
      result.checks.sdkReadLegacy = {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }

    const isRestHealthy = restPrimary.ok || restLegacy.ok;
    result.ok = isRestHealthy;

    return res.status(isRestHealthy ? 200 : 500).json(result);
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
