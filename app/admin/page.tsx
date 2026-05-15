"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_HOMEPAGE_CONTENT,
  HomepageContent,
  getHomepageContent,
  updateHomepageContent,
  uploadHeroImage,
} from "./helpers.js";

export default function AdminPage() {
  const [content, setContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [initialContent, setInitialContent] =
    useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const isDirty = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(initialContent);
  }, [content, initialContent]);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      setAuthChecking(true);
      setAuthError("");

      try {
        const response = await fetch("/api/admin-auth", {
          method: "GET",
          cache: "no-store",
        });
        const authenticated = response.ok;

        if (isMounted) {
          setIsAuthenticated(authenticated);
        }
      } catch {
        if (isMounted) {
          setAuthError("Unable to verify admin session.");
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setAuthChecking(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadContent() {
      setLoading(true);
      setError("");

      try {
        const data = await getHomepageContent();

        if (!isMounted) {
          return;
        }

        setContent(data);
        setInitialContent(data);
        setImagePreview(data.heroImage);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        const message =
          loadError instanceof Error ? loadError.message : "Failed to load content.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthSubmitting(true);
    setAuthError("");

    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: authPassword }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error || "Invalid credentials.");
      }

      setIsAuthenticated(true);
      setAuthPassword("");
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : "Unable to sign in.";
      setAuthError(message);
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setAuthPassword("");
    setSuccess("");
    setError("");
  }

  function updateField<K extends keyof HomepageContent>(field: K, value: string) {
    setContent((prev: HomepageContent) => ({ ...prev, [field]: value }));
    setSuccess("");
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const uploadedImageUrl = await uploadHeroImage(file);
      setContent((prev: HomepageContent) => ({ ...prev, heroImage: uploadedImageUrl }));
      setImagePreview(uploadedImageUrl);
      setSuccess("Image uploaded successfully.");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      setError(message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateHomepageContent(content);
      setInitialContent(content);
      setSuccess("Homepage content saved successfully.");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Failed to save content.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Homepage Admin
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Update hero text and image, then save to Edge Config.
          </p>
        </header>

        {authChecking ? (
          <p className="text-sm text-slate-600">Checking admin session...</p>
        ) : !isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="space-y-2">
              <span className="block text-sm font-medium text-slate-800">Admin Password</span>
              <input
                type="password"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="Enter password"
                required
              />
            </label>

            {authError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : loading ? (
          <p className="text-sm text-slate-600">Loading content...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign Out
              </button>
            </div>

            <div className="grid gap-5">
              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-800">Hero Title</span>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(event) => updateField("heroTitle", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  placeholder="Design that turns heads"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-800">Hero Subtitle</span>
                <input
                  type="text"
                  value={content.heroSubtitle}
                  onChange={(event) => updateField("heroSubtitle", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  placeholder="Build trust with a clear, polished first impression"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-800">Button Text</span>
                <input
                  type="text"
                  value={content.buttonText}
                  onChange={(event) => updateField("buttonText", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  placeholder="See Our Work"
                  required
                />
              </label>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-800">Hero Image</label>
                  <p className="mt-1 text-xs text-slate-500">
                    Upload an image to Vercel Blob using /api/upload.
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700 disabled:opacity-70"
                />

                {uploading && <p className="text-sm text-slate-600">Uploading image...</p>}

                {imagePreview && (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={imagePreview}
                      alt="Hero image preview"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={saving || uploading || !isDirty}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Content"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
