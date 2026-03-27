import { get } from "@vercel/edge-config";

const DEFAULT_HOMEPAGE_CONTENT = {
  heroTitle: "",
  heroSubtitle: "",
  buttonText: "",
  heroImage: "",
};

export async function GET() {
  try {
    const data = await get("homepage");

    if (!data || typeof data !== "object") {
      return Response.json(DEFAULT_HOMEPAGE_CONTENT, { status: 200 });
    }

    return Response.json(
      {
        heroTitle: typeof data.heroTitle === "string" ? data.heroTitle : "",
        heroSubtitle: typeof data.heroSubtitle === "string" ? data.heroSubtitle : "",
        buttonText: typeof data.buttonText === "string" ? data.buttonText : "",
        heroImage: typeof data.heroImage === "string" ? data.heroImage : "",
      },
      { status: 200 },
    );
  } catch {
    return Response.json(
      {
        error: "Failed to load homepage content.",
      },
      { status: 500 },
    );
  }
}
