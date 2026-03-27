import { get, put } from "@vercel/edge-config";

const CONTENT_KEY = "site_content";

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

export async function GET() {
  try {
    const data = await get(CONTENT_KEY);
    return Response.json(normalizeContent(data), { status: 200 });
  } catch {
    return Response.json({ error: "Failed to load site content." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const content = normalizeContent(body);

    await put(CONTENT_KEY, content);

    return Response.json({ success: true }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to save site content." }, { status: 500 });
  }
}
