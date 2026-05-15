import { createClient } from "@supabase/supabase-js";

const CONTENT_ROW_ID = 1;
const SUPABASE_CONTENT_TABLE = process.env.SUPABASE_CONTENT_TABLE || "site_content";

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

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("SUPABASE_URL");
    if (!supabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export default async function handler(req, res) {
  const trace = req.headers["x-vercel-id"] || "no-trace";

  try {
    if (req.method === "GET") {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from(SUPABASE_CONTENT_TABLE)
        .select("content")
        .eq("id", CONTENT_ROW_ID)
        .maybeSingle();

      if (error) {
        throw new Error(`Supabase read failed: ${error.message}`);
      }

      const value = data?.content || null;

      return res.status(200).json(normalizeContent(value));
    }

    if (req.method === "POST") {
      let body;

      try {
        body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      } catch {
        return res.status(400).json({ error: "Invalid JSON body." });
      }

      const content = normalizeContent(body);

      const supabase = getSupabaseClient();
      const { error } = await supabase.from(SUPABASE_CONTENT_TABLE).upsert(
        {
          id: CONTENT_ROW_ID,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        return res.status(500).json({
          error: "Failed to write site content to Supabase.",
          code: "WRITE_FAILED",
          trace,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
      }

      console.log("[site-content][POST] Updated successfully", { trace });

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("[site-content] Function failed", {
      trace,
      method: req.method,
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({
      error: "Site content API failed.",
      code: "SITE_CONTENT_API_FAILED",
      trace,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
