import { put } from "@vercel/edge-config";

function normalizeContent(input) {
  if (!input || typeof input !== "object") {
    return {
      heroTitle: "",
      heroSubtitle: "",
      buttonText: "",
      heroImage: "",
    };
  }

  return {
    heroTitle: typeof input.heroTitle === "string" ? input.heroTitle : "",
    heroSubtitle: typeof input.heroSubtitle === "string" ? input.heroSubtitle : "",
    buttonText: typeof input.buttonText === "string" ? input.buttonText : "",
    heroImage: typeof input.heroImage === "string" ? input.heroImage : "",
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const content = normalizeContent(body);

    await put("homepage", content);

    return Response.json({ success: true }, { status: 200 });
  } catch {
    return Response.json(
      {
        error: "Failed to save homepage content.",
      },
      { status: 500 },
    );
  }
}
