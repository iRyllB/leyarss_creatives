import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  content: ContentState;
  updateHero: (data: Partial<HeroContent>) => void;
  updateAbout: (data: Partial<AboutContent>) => void;
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  removeService: (id: string) => void;
  addPortfolioItem: (category: TabKey, item: Omit<PortfolioItem, "id">) => void;
  updatePortfolioItem: (
    category: TabKey,
    id: string,
    data: Partial<PortfolioItem>
  ) => void;
  removePortfolioItem: (category: TabKey, id: string) => void;
  applyChanges: () => void;
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

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(() => {
    if (typeof window === "undefined") return defaultContent;
    try {
      const stored = localStorage.getItem("leyarss-content");
      if (!stored) return defaultContent;
      const parsed = JSON.parse(stored) as Partial<ContentState>;
      return {
        ...defaultContent,
        ...parsed,
        hero: { ...defaultContent.hero, ...(parsed.hero || {}) },
        about: { ...defaultContent.about, ...(parsed.about || {}) },
        services: parsed.services ?? defaultContent.services,
        portfolio: { ...defaultContent.portfolio, ...(parsed.portfolio || {}) },
      };
    } catch (e) {
      console.warn("Failed to parse stored content, falling back to defaults", e);
      return defaultContent;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("leyarss-content", JSON.stringify(content));
    }
  }, [content]);

  const value = useMemo<ContentContextValue>(() => {

    const addService = async (service: Omit<Service, "id">) => {
      try {
        const res = await fetch("http://localhost:5000/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(service),
        });
        if (!res.ok) throw new Error("Failed to add service");
        const newService = await res.json();
        setContent((prev) => ({
          ...prev,
          services: [...prev.services, newService],
        }));
      } catch (err) {
        console.error(err);
      }
    };


    const updateHero = async (data: Partial<HeroContent>) => {
      try {
        const res = await fetch("http://localhost:5000/api/content/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update hero");
        const updated = await res.json();
        setContent((prev) => ({ ...prev, hero: updated.hero }));
      } catch (err) {
        console.error(err);
      }
    };


    const updateAbout = async (data: Partial<AboutContent>) => {
      try {
        const res = await fetch("http://localhost:5000/api/content/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update about");
        const updated = await res.json();
        setContent((prev) => ({ ...prev, about: updated.about }));
      } catch (err) {
        console.error(err);
      }
    };


    const updateService = async (id: string, data: Partial<Service>) => {
      try {
        const res = await fetch(`http://localhost:5000/api/content/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update service");
        const updated = await res.json();
        setContent((prev) => ({
          ...prev,
          services: prev.services.map((srv) =>
            srv.id === id ? updated : srv
          ),
        }));
      } catch (err) {
        console.error(err);
      }
    };


    const removeService = async (id: string) => {
      try {
        const res = await fetch(`http://localhost:5000/api/content/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Failed to delete service");
        setContent((prev) => ({
          ...prev,
          services: prev.services.filter((srv) => srv.id !== id),
        }));
      } catch (err) {
        console.error(err);
      }
    };


    const addPortfolioItem = async (category: TabKey, item: Omit<PortfolioItem, "id">) => {
      try {
        const res = await fetch(`http://localhost:5000/api/content/portfolio/${category}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error("Failed to add portfolio item");
        const newItem = await res.json();
        setContent((prev) => ({
          ...prev,
          portfolio: {
            ...prev.portfolio,
            [category]: {
              ...prev.portfolio[category],
              items: [...prev.portfolio[category].items, newItem],
            },
          },
        }));
      } catch (err) {
        console.error(err);
      }
    };


    const updatePortfolioItem = async (
      category: TabKey,
      id: string,
      data: Partial<PortfolioItem>
    ) => {
      try {
        const res = await fetch(`http://localhost:5000/api/content/portfolio/${category}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update portfolio item");
        const updated = await res.json();
        setContent((prev) => ({
          ...prev,
          portfolio: {
            ...prev.portfolio,
            [category]: {
              ...prev.portfolio[category],
              items: prev.portfolio[category].items.map((itm) =>
                itm.id === id ? updated : itm
              ),
            },
          },
        }));
      } catch (err) {
        console.error(err);
      }
    };


    const removePortfolioItem = async (category: TabKey, id: string) => {
      try {
        const res = await fetch(`http://localhost:5000/api/content/portfolio/${category}/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Failed to delete portfolio item");
        setContent((prev) => ({
          ...prev,
          portfolio: {
            ...prev.portfolio,
            [category]: {
              ...prev.portfolio[category],
              items: prev.portfolio[category].items.filter((itm) => itm.id !== id),
            },
          },
        }));
      } catch (err) {
        console.error(err);
      }
    };

    const applyChanges = () => {
      // State is already synced to localStorage via the effect, but keeping the method
      // allows the UI to provide an explicit "Apply" action for admins.
      if (typeof window !== "undefined") {
        localStorage.setItem("leyarss-content", JSON.stringify(content));
      }
    };

    return {
      content,
      addService,
      updateService,
      removeService,
      addPortfolioItem,
      updatePortfolioItem,
      removePortfolioItem,
      applyChanges,
      updateHero,
      updateAbout,
    };
  }, [content]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
