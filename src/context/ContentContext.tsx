/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type TabKey = "brand" | "event" | "print" | "product";

export type Service = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  image: string;
  details: string;
};

export type PortfolioCategory = {
  title: string;
  description: string;
  items: PortfolioItem[];
};

export type HeroContent = {
  line1: string;
  line2: string;
  line3: string;
  subtext: string;
  image: string;
};

export type AboutContent = {
  title: string;
  body: string;
  image: string;
};

type ContentState = {
  hero: HeroContent;
  about: AboutContent;
  services: Service[];
  portfolio: Record<TabKey, PortfolioCategory>;
};

type ContentContextValue = {
  publishedContent: ContentState;
  draftContent: ContentState;
  setDraftContent: React.Dispatch<React.SetStateAction<ContentState>>;
  loading: boolean;
  saving: boolean;
  error: string | null;
  applyChanges: () => Promise<void>;
  resetDraft: () => void;
};

const defaultContent: ContentState = {
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
  services: [
    {
      id: "srv-1",
      title: "Brand Identity Design",
      category: "Branding",
      image: "/service-1.jpg",
      description: "Create a distinctive brand identity that stands out in the market.",
    },
    {
      id: "srv-2",
      title: "Digital Design & UX",
      category: "Digital",
      image: "/service-2.jpg",
      description: "Modern, user-centric digital designs for web and mobile platforms.",
    },
    {
      id: "srv-3",
      title: "Print & Packaging",
      category: "Print",
      image: "/service-3.jpg",
      description: "Professional print design solutions including packaging and marketing materials.",
    },
    {
      id: "srv-4",
      title: "Event Branding",
      category: "Events",
      image: "/service-4.jpg",
      description: "Complete branding solutions for corporate events and special occasions.",
    },
    {
      id: "srv-5",
      title: "Marketing Materials",
      category: "Marketing",
      image: "/service-5.jpg",
      description: "Engaging marketing collateral that drives brand awareness and conversions.",
    },
    {
      id: "srv-6",
      title: "Consultation & Strategy",
      category: "Consulting",
      image: "/service-6.jpg",
      description: "Expert guidance on brand strategy and creative direction for your projects.",
    },
  ],
  portfolio: {
    brand: {
      title: "Brand Development",
      description: "Comprehensive brand identity solutions",
      items: [
        {
          id: "pf-1",
          title: "Tech Startup Identity",
          image: "/portfolio-brand-1.jpg",
          details: "Full brand identity with logo, guidelines, and digital coloring system",
        },
        {
          id: "pf-2",
          title: "Luxury Cosmetics Branding",
          image: "/portfolio-brand-2.jpg",
          details: "Elegant brand identity for premium beauty line",
        },
        {
          id: "pf-3",
          title: "Eco-Friendly Brand",
          image: "/portfolio-brand-3.jpg",
          details: "Sustainable and eco-conscious brand identity system",
        },
        {
          id: "pf-4",
          title: "Restaurant Brand Design",
          image: "/portfolio-brand-4.jpg",
          details: "Complete restaurant branding with packaging and collateral",
        },
      ],
    },
    event: {
      title: "Event Branding",
      description: "From concept to execution with iconic branding",
      items: [
        {
          id: "pf-5",
          title: "Tech Conference 2026",
          image: "/portfolio-event-1.jpg",
          details: "Complete event branding including signage and digital assets",
        },
        {
          id: "pf-6",
          title: "Music Festival Branding",
          image: "/portfolio-event-2.jpg",
          details: "Festival identity with posters, merchandise, and stage design",
        },
        {
          id: "pf-7",
          title: "Corporate Gala Design",
          image: "/portfolio-event-3.jpg",
          details: "Elegant branding for high-end corporate event",
        },
        {
          id: "pf-8",
          title: "Charity Fundraiser Event",
          image: "/portfolio-event-4.jpg",
          details: "Impactful branding for annual charity fundraiser",
        },
      ],
    },
    print: {
      title: "Print Design",
      description: "Tangible designs that make an impression",
      items: [
        {
          id: "pf-9",
          title: "Premium Business Cards",
          image: "/portfolio-print-1.jpg",
          details: "Luxury business card design with special finishes",
        },
        {
          id: "pf-10",
          title: "Annual Report Design",
          image: "/portfolio-print-2.jpg",
          details: "Professional annual report with photography and typography",
        },
        {
          id: "pf-11",
          title: "Brochure & Catalog",
          image: "/portfolio-print-3.jpg",
          details: "Comprehensive brochure design with product showcase",
        },
        {
          id: "pf-12",
          title: "Packaging Design",
          image: "/portfolio-print-4.jpg",
          details: "Eye-catching packaging that reflects brand values",
        },
      ],
    },
    product: {
      title: "Product Design",
      description: "Innovation meets creativity in product solutions",
      items: [
        {
          id: "pf-13",
          title: "Mobile App Interface",
          image: "/portfolio-product-1.jpg",
          details: "User-centric mobile app design with intuitive interface",
        },
        {
          id: "pf-14",
          title: "Web Platform Design",
          image: "/portfolio-product-2.jpg",
          details: "Complete web platform design with responsive layouts",
        },
        {
          id: "pf-15",
          title: "Product Packaging Mockup",
          image: "/portfolio-product-3.jpg",
          details: "3D product design and packaging visualization",
        },
        {
          id: "pf-16",
          title: "Interactive Dashboard",
          image: "/portfolio-product-4.jpg",
          details: "Analytics dashboard with data visualization and UX design",
        },
      ],
    },
  },
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [publishedContent, setPublishedContent] = useState<ContentState>(defaultContent);
  const [draftContent, setDraftContent] = useState<ContentState>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/site-content", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load content");
        }

        const loaded = (await response.json()) as ContentState;
        setPublishedContent(loaded);
        setDraftContent(loaded);
      } catch {
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save draft to backend
  const applyChanges = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftContent),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      setPublishedContent(draftContent);
    } catch (err) {
      setError("Failed to save changes.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Reset draft to last published
  const resetDraft = () => setDraftContent(publishedContent);

  return (
    <ContentContext.Provider value={{
      publishedContent,
      draftContent,
      setDraftContent,
      loading,
      saving,
      error,
      applyChanges,
      resetDraft,
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
