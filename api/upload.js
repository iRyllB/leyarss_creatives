import { put } from "@vercel/blob";

function sanitizeFilename(name) {
  const fallback = `upload-${Date.now()}.bin`;
  if (!name || typeof name !== "string") return fallback;

  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || fallback;
}

async function readRequestBuffer(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const rawName = req.headers["x-file-name"];
    const fileName = sanitizeFilename(
      Array.isArray(rawName) ? rawName[0] : rawName || ""
    );
    const contentTypeHeader = req.headers["content-type"];
    const contentType = Array.isArray(contentTypeHeader)
      ? contentTypeHeader[0]
      : contentTypeHeader || "application/octet-stream";

    const fileBuffer = await readRequestBuffer(req);

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: "No file bytes received." });
    }

    const finalName = `${Date.now()}-${fileName}`;

    const blob = await put(finalName, fileBuffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error("[upload] failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ error: "Upload failed." });
  }
}
