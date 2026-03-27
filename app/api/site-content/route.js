import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_KEY = "site-content";

const defaultContent = {
  hero: {
    line1: "WE DESIGN",
    line2: "WE BUILD",
    line3: "WE PRINT",
    subtext: "Your Vision is Our Mission",
    image: "/logo-large.png",
  },
  about: {
    title: "About Leyarss Creatives",
    body: "At LEYARSS CREATIVES DESIGNS, our success is driven by a team of passionate creatives, strategic thinkers, and skilled professionals dedicated to bringing brands to life.",
    image: "/about.jpg",
  },
  services: [],
  portfolio: {
    brand: { title: "Brand Development", description: "Comprehensive brand identity solutions", items: [] },
    event: { title: "Event Branding", description: "From concept to execution with iconic branding", items: [] },
    print: { title: "Print Design", description: "Tangible designs that make an impression", items: [] },
    product: { title: "Product Design", description: "Innovation meets creativity in product solutions", items: [] },
  },
};

function getRequiredEnv() {
  const token = process.env.VERCEL_TOKEN;
  const edgeConfigId = process.env.EDGE_CONFIG_ID;

  if (!token || !edgeConfigId) {
    const missing = [];
    if (!token) missing.push("VERCEL_TOKEN");
    if (!edgeConfigId) missing.push("EDGE_CONFIG_ID");

    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return { token, edgeConfigId };
}

function normalizeContent(input) {
  if (!input || typeof input !== "object") {
    return defaultContent;
  }

  return {
    hero: {
      line1: typeof input.hero?.line1 === "string" ? input.hero.line1 : defaultContent.hero.line1,
      line2: typeof input.hero?.line2 === "string" ? input.hero.line2 : defaultContent.hero.line2,
      line3: typeof input.hero?.line3 === "string" ? input.hero.line3 : defaultContent.hero.line3,
      subtext:
        typeof input.hero?.subtext === "string"
          ? input.hero.subtext
          : defaultContent.hero.subtext,
      image: typeof input.hero?.image === "string" ? input.hero.image : defaultContent.hero.image,
    },
    about: {
      title: typeof input.about?.title === "string" ? input.about.title : defaultContent.about.title,
      body: typeof input.about?.body === "string" ? input.about.body : defaultContent.about.body,
      image: typeof input.about?.image === "string" ? input.about.image : defaultContent.about.image,
    },
    services: Array.isArray(input.services) ? input.services : defaultContent.services,
    portfolio:
      input.portfolio && typeof input.portfolio === "object"
        ? {
            brand:
              input.portfolio.brand && typeof input.portfolio.brand === "object"
                ? {
                    title:
                      typeof input.portfolio.brand.title === "string"
                        ? input.portfolio.brand.title
                        : defaultContent.portfolio.brand.title,
                    description:
                      typeof input.portfolio.brand.description === "string"
                        ? input.portfolio.brand.description
                        : defaultContent.portfolio.brand.description,
                    items: Array.isArray(input.portfolio.brand.items)
                      ? input.portfolio.brand.items
                      : [],
                  }
                : defaultContent.portfolio.brand,
            event:
              input.portfolio.event && typeof input.portfolio.event === "object"
                ? {
                    title:
                      typeof input.portfolio.event.title === "string"
                        ? input.portfolio.event.title
                        : defaultContent.portfolio.event.title,
                    description:
                      typeof input.portfolio.event.description === "string"
                        ? input.portfolio.event.description
                        : defaultContent.portfolio.event.description,
                    items: Array.isArray(input.portfolio.event.items)
                      ? input.portfolio.event.items
                      : [],
                  }
                : defaultContent.portfolio.event,
            print:
              input.portfolio.print && typeof input.portfolio.print === "object"
                ? {
                    title:
                      typeof input.portfolio.print.title === "string"
                        ? input.portfolio.print.title
                        : defaultContent.portfolio.print.title,
                    description:
                      typeof input.portfolio.print.description === "string"
                        ? input.portfolio.print.description
                        : defaultContent.portfolio.print.description,
                    items: Array.isArray(input.portfolio.print.items)
                      ? input.portfolio.print.items
                      : [],
                  }
                : defaultContent.portfolio.print,
            product:
              input.portfolio.product && typeof input.portfolio.product === "object"
                ? {
                    title:
                      typeof input.portfolio.product.title === "string"
                        ? input.portfolio.product.title
                        : defaultContent.portfolio.product.title,
                    description:
                      typeof input.portfolio.product.description === "string"
                        ? input.portfolio.product.description
                        : defaultContent.portfolio.product.description,
                    items: Array.isArray(input.portfolio.product.items)
                      ? input.portfolio.product.items
                      : [],
                  }
                : defaultContent.portfolio.product,
          }
        : defaultContent.portfolio,
  };
}

async function parseApiResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function getItemValue(payload, key) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (Array.isArray(payload.items)) {
    const item = payload.items.find((entry) => entry?.key === key);
    return item?.value ?? null;
  }

  if (payload.key === key && "value" in payload) {
    return payload.value;
  }

  return null;
}

async function callVercelApi({ token, edgeConfigId, method, key, body }) {
  const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${
    key ? `?key=${encodeURIComponent(key)}` : ""
  }`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await parseApiResponse(response);

  if (!response.ok) {
    console.error("[site-content] Vercel API request failed", {
      method,
      status: response.status,
      payload,
    });

    throw new Error(`Vercel API request failed with status ${response.status}`);
  }

  return payload;
}

export async function GET() {
  try {
    const { token, edgeConfigId } = getRequiredEnv();

    const payload = await callVercelApi({
      token,
      edgeConfigId,
      method: "GET",
      key: CONTENT_KEY,
    });

    const value = getItemValue(payload, CONTENT_KEY);
    const content = normalizeContent(value);

    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("[site-content][GET] Failed", {
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Failed to load site content." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { token, edgeConfigId } = getRequiredEnv();

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

    await callVercelApi({
      token,
      edgeConfigId,
      method: "PATCH",
      body: {
        items: [
          {
            operation: "upsert",
            key: CONTENT_KEY,
            value: content,
          },
        ],
      },
    });

    console.log("[site-content][POST] Updated Edge Config successfully");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[site-content][POST] Failed", {
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Failed to save site content." },
      { status: 500 },
    );
  }
}
