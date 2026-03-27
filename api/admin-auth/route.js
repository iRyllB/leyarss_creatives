const COOKIE_NAME = "admin_session";
const COOKIE_TTL_SECONDS = 60 * 60 * 12;

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) return acc;

    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function getExpectedSecret() {
  return process.env.ADMIN_PANEL_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

function buildCookie(value, maxAge) {
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${maxAge}`;
}

export async function GET(req) {
  const cookies = parseCookies(req.headers.get("cookie") || "");
  const expected = getExpectedSecret();

  if (!expected) {
    return Response.json({ authenticated: false, error: "ADMIN_PANEL_PASSWORD is not configured." }, { status: 500 });
  }

  const authenticated = cookies[COOKIE_NAME] === expected;
  return Response.json({ authenticated }, { status: authenticated ? 200 : 401 });
}

export async function POST(req) {
  const expected = getExpectedSecret();

  if (!expected) {
    return Response.json({ error: "ADMIN_PANEL_PASSWORD is not configured." }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || password !== expected) {
    return Response.json({ authenticated: false, error: "Invalid password." }, { status: 401 });
  }

  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildCookie(encodeURIComponent(expected), COOKIE_TTL_SECONDS),
    },
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({ authenticated: false }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildCookie("", 0),
    },
  });
}
