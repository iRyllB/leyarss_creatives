export type HomepageContent = {
  heroTitle: string;
  heroSubtitle: string;
  buttonText: string;
  heroImage: string;
};

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  heroTitle: "",
  heroSubtitle: "",
  buttonText: "",
  heroImage: "",
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Server returned invalid JSON.");
  }
}

function ensureContentShape(data: Partial<HomepageContent> | null | undefined): HomepageContent {
  if (!data || typeof data !== "object") {
    return DEFAULT_HOMEPAGE_CONTENT;
  }

  return {
    heroTitle: typeof data.heroTitle === "string" ? data.heroTitle : "",
    heroSubtitle: typeof data.heroSubtitle === "string" ? data.heroSubtitle : "",
    buttonText: typeof data.buttonText === "string" ? data.buttonText : "",
    heroImage: typeof data.heroImage === "string" ? data.heroImage : "",
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const response = await fetch("/api/content", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load homepage content.");
  }

  const payload = await parseJsonResponse<Partial<HomepageContent>>(response);
  return ensureContentShape(payload);
}

export async function uploadHeroImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-file-name": file.name,
    },
    body: bytes,
  });

  const payload = await parseJsonResponse<{ url?: string; error?: string }>(response);

  if (!response.ok || typeof payload.url !== "string" || !payload.url) {
    throw new Error(payload.error || "Image upload failed.");
  }

  return payload.url;
}

export async function updateHomepageContent(content: HomepageContent): Promise<void> {
  const response = await fetch("/api/update-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      buttonText: content.buttonText,
      heroImage: content.heroImage,
    }),
  });

  if (response.ok) {
    return;
  }

  let payload: { error?: string } = {};

  try {
    payload = await parseJsonResponse<{ error?: string }>(response);
  } catch {
    payload = {};
  }

  throw new Error(payload.error || "Failed to save homepage content.");
}
