import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type Service,
  type TabKey,
  type PortfolioItem,
  useContent,
} from "../context/ContentContext";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/AdminDashboard.css";

type SectionKey = "hero" | "about" | "services" | "portfolio";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    draftContent,
    setDraftContent,
    loading,
    saving,
    error,
    applyChanges,
  } = useContent();

  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [activePortfolioTab, setActivePortfolioTab] = useState<TabKey>("brand");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    title: "",
    category: "",
    image: "",
    description: "",
  });
  const [newPortfolioItem, setNewPortfolioItem] = useState<Omit<PortfolioItem, "id">>({ title: "", image: "", details: "" });

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    const authed = localStorage.getItem("leyarss-admin-authed") === "true";
    if (!authed) {
      navigate("/adminlogin");
    }
  }, [navigate]);

  const handleLogout = () => {
    askConfirm("Log out?", "You will exit the admin console.", () => {
      localStorage.removeItem("leyarss-admin-authed");
      navigate("/adminlogin");
    });
  };

  const askConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({ open: true, title, message, onConfirm });
  };

  const closeConfirm = () =>
    setConfirmState((prev) => ({ ...prev, open: false }));

  const handleApply = () => {
    if (uploading) {
      setStatus("Please wait for image upload to finish.");
      setTimeout(() => setStatus(""), 2500);
      return;
    }

    askConfirm(
      "Apply changes?",
      "Push the current edits to the public view.",
      async () => {
        setStatus("");
        try {
          await applyChanges();
          setStatus("Changes applied to the main page preview.");
        } catch (saveError) {
          const message =
            saveError instanceof Error
              ? saveError.message
              : "Failed to apply changes. Please try again.";
          setStatus(message);
        }
        setTimeout(() => setStatus(""), 3000);
      }
    );
  };

  const uploadImageToBlob = async (file: File): Promise<string> => {
    const bytes = await file.arrayBuffer();

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-file-name": file.name,
      },
      body: bytes,
    });

    const payload = (await response.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null;

    if (!response.ok || !payload?.url) {
      throw new Error(payload?.error || "Image upload failed.");
    }

    return payload.url;
  };

  const handleSelectImage = (
    files: FileList | null,
    setter: (value: string) => void
  ) => {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      setStatus("Only JPG, PNG, and WEBP files are allowed.");
      setTimeout(() => setStatus(""), 2500);
      return;
    }

    setUploading(true);
    setStatus("Uploading image...");

    void uploadImageToBlob(file)
      .then((url) => {
        setter(url);
        setStatus("Image uploaded successfully.");
        setTimeout(() => setStatus(""), 1800);
      })
      .catch((uploadError) => {
        const message =
          uploadError instanceof Error ? uploadError.message : "Image upload failed.";
        setStatus(message);
        setTimeout(() => setStatus(""), 3000);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleAddService = () => {
    if (!newService.title.trim() || !newService.category.trim()) {
      return;
    }

    const newEntry: Service = {
      id: `srv-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: newService.title,
      category: newService.category,
      image: newService.image,
      description: newService.description,
    };

    setDraftContent((draft) => ({
      ...draft,
      services: [...draft.services, newEntry],
    }));

    setNewService({
      title: "",
      category: "",
      image: "",
      description: "",
    });
  };

  const updateServiceField = <K extends keyof Service>(
    index: number,
    field: K,
    value: Service[K]
  ) => {
    setDraftContent((draft) => {
      const services = [...draft.services];
      services[index] = { ...services[index], [field]: value };
      return { ...draft, services };
    });
  };

  const removeServiceById = (serviceId: string) => {
    setDraftContent((draft) => ({
      ...draft,
      services: draft.services.filter((service) => service.id !== serviceId),
    }));
  };

  const handleAddPortfolioItem = () => {
    if (!newPortfolioItem.title || !newPortfolioItem.image) {
      return;
    }

    setDraftContent((draft) => {
      const currentItems = draft.portfolio[activePortfolioTab].items;
      const newItem: PortfolioItem = {
        id: `pf-${Date.now()}`,
        title: newPortfolioItem.title,
        image: newPortfolioItem.image,
        details: newPortfolioItem.details,
      };

      return {
        ...draft,
        portfolio: {
          ...draft.portfolio,
          [activePortfolioTab]: {
            ...draft.portfolio[activePortfolioTab],
            items: [...currentItems, newItem],
          },
        },
      };
    });

    setNewPortfolioItem({ title: "", image: "", details: "" });
  };

  const updatePortfolioItem = <K extends keyof PortfolioItem>(
    category: TabKey,
    itemId: string,
    field: K,
    value: PortfolioItem[K]
  ) => {
    setDraftContent((draft) => ({
      ...draft,
      portfolio: {
        ...draft.portfolio,
        [category]: {
          ...draft.portfolio[category],
          items: draft.portfolio[category].items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
          ),
        },
      },
    }));
  };

  const removePortfolioItem = (category: TabKey, itemId: string) => {
    setDraftContent((draft) => ({
      ...draft,
      portfolio: {
        ...draft.portfolio,
        [category]: {
          ...draft.portfolio[category],
          items: draft.portfolio[category].items.filter((item) => item.id !== itemId),
        },
      },
    }));
  };

  const currentCategory = draftContent.portfolio[activePortfolioTab];

  const sectionNav = useMemo(
    () => [
      { key: "hero", label: "Hero Content" },
      { key: "about", label: "About Section" },
      { key: "services", label: "Services" },
      { key: "portfolio", label: "Portfolio" },
    ],
    []
  );

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <p className="brand-name">Leyarss</p>
            <p className="brand-sub">Admin Console</p>
          </div>
        </div>

        <nav className="nav">
          {sectionNav.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key as SectionKey)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-actions">
          <button className="primary-btn block" onClick={handleApply}>
            Publish changes
          </button>
          <button className="ghost-btn block" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-dashboard">
        <header className="admin-dash-header">
          <div>
            <p className="eyebrow">Leyarss Admin</p>
            <h1>Content Control Room</h1>
            <p className="subtitle">
              Tune the homepage content, imagery, and captions. All changes sync
              live to the public view.
            </p>
          </div>
          <div className="header-actions">
            <button className="ghost-btn" onClick={handleLogout}>
              Log out
            </button>
            <button className="primary-btn" onClick={handleApply}>
              Apply changes
            </button>
          </div>
        </header>

        {loading && <div className="status-banner">Loading content...</div>}
        {saving && <div className="status-banner">Saving changes...</div>}
        {error && <div className="status-banner error">{error}</div>}
        {status && <div className="status-banner">{status}</div>}

        <div className="page-map">
          {activeSection === "hero" && (
            <section className="section-block">
              <div className="section-header">
                <span className="section-tag">Hero</span>
                <h2>Top banner</h2>
                <p>Preview mirrors the homepage hero; edit lines and subtext.</p>
              </div>
              <div className="panel">
                <div className="dual-card">
                  <div className="preview-card hero-preview">
                    <div className="preview-body">
                      <p className="preview-tag">High velocity studio</p>
                      <h1 className="hero-preview-text">
                        {draftContent.hero.line1} <br />
                        <span className="build-text">{draftContent.hero.line2}</span> <br />
                        <span className="print-text">{draftContent.hero.line3}</span>
                      </h1>
                      <p className="preview-desc">{draftContent.hero.subtext}</p>
                    </div>
                    {draftContent.hero.image && (
                      <div className="preview-img hero-image">
                        <img src={draftContent.hero.image} alt="Hero visual" />
                      </div>
                    )}
                  </div>

                  <div className="edit-card">
                    <div className="field-pair">
                      <label>Line 1</label>
                      <input
                        value={draftContent.hero.line1}
                        onChange={(e) => setDraftContent(draft => ({ ...draft, hero: { ...draft.hero, line1: e.target.value } }))}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Line 2</label>
                      <input
                        value={draftContent.hero.line2}
                        onChange={(e) => setDraftContent(draft => ({ ...draft, hero: { ...draft.hero, line2: e.target.value } }))}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Line 3</label>
                      <input
                        value={draftContent.hero.line3}
                        onChange={(e) => setDraftContent(draft => ({ ...draft, hero: { ...draft.hero, line3: e.target.value } }))}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Subtext</label>
                      <textarea
                        value={draftContent.hero.subtext}
                        onChange={(e) => setDraftContent(draft => ({ ...draft, hero: { ...draft.hero, subtext: e.target.value } }))}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Image</label>
                      <div className="file-field">
                        <div className="file-display" title={draftContent.hero.image}>
                          {draftContent.hero.image || "Upload image (.jpg, .png)"}
                        </div>
                        <div className="file-actions">
                          <label className="file-btn">
                            Upload
                            <input
                              type="file"
                              accept="image/png, image/jpeg"
                              hidden
                              onChange={(e) =>
                                handleSelectImage(
                                  e.target.files,
                                  (val) => setDraftContent(draft => ({ ...draft, hero: { ...draft.hero, image: val } }))
                                )
                              }
                            />
                          </label>
                          {draftContent.hero.image && (
                            <button
                              className="ghost-btn file-remove"
                              type="button"
                              onClick={() =>
                                askConfirm(
                                  "Remove hero image?",
                                  "This will clear the hero image.",
                                  () => setDraftContent(draft => ({ ...draft, hero: { ...draft.hero, image: "" } }))
                                )
                              }
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "about" && (
            <section className="section-block">
              <div className="section-header">
                <span className="section-tag">About</span>
                <h2>Studio story</h2>
                <p>Edit the text and image used in the About section.</p>
              </div>
              <div className="panel">
                <div className="dual-card">
                  <div className="preview-card">
                    {draftContent.about.image && (
                      <div className="preview-img">
                        <img src={draftContent.about.image} alt="About preview" />
                      </div>
                    )}
                    <div className="preview-body">
                      <p className="preview-tag">Legacy & Energy</p>
                      <h4>{draftContent.about.title}</h4>
                      <p className="preview-desc">{draftContent.about.body}</p>
                    </div>
                  </div>
                  <div className="edit-card">
                    <div className="field-pair">
                      <label>Title</label>
                      <input
                        value={draftContent.about.title}
                        onChange={(e) => setDraftContent(draft => ({ ...draft, about: { ...draft.about, title: e.target.value } }))}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Body</label>
                      <textarea
                        value={draftContent.about.body}
                        onChange={(e) => setDraftContent(draft => ({ ...draft, about: { ...draft.about, body: e.target.value } }))}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Image</label>
                      <div className="file-field">
                        <div className="file-display" title={draftContent.about.image}>
                          {draftContent.about.image || "Upload image (.jpg, .png)"}
                        </div>
                        <div className="file-actions">
                          <label className="file-btn">
                            Upload
                            <input
                              type="file"
                              accept="image/png, image/jpeg"
                              hidden
                              onChange={(e) =>
                                handleSelectImage(
                                  e.target.files,
                                  (val) => setDraftContent(draft => ({ ...draft, about: { ...draft.about, image: val } }))
                                )
                              }
                            />
                          </label>
                          {draftContent.about.image && (
                            <button
                              className="ghost-btn file-remove"
                              type="button"
                              onClick={() =>
                                askConfirm(
                                  "Remove about image?",
                                  "This will clear the about image.",
                                  () => setDraftContent(draft => ({ ...draft, about: { ...draft.about, image: "" } }))
                                )
                              }
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "services" && (
            <section className="section-block services-block">
              <div className="section-header">
                <span className="section-tag">Services</span>
                <h2>Same cards you see on Home</h2>
                <p>Left: preview. Right: editable fields.</p>
              </div>
              <div className="panel">
                <div className="editable-list">
                  {draftContent.services.map((service, idx) => (
                    <div className="dual-card" key={service.id}>
                      <div className="preview-card">
                        {service.image && (
                          <div className="preview-img">
                            <img src={service.image} alt={service.title} />
                          </div>
                        )}
                        <div className="preview-body">
                          <p className="preview-tag">{service.category}</p>
                          <h4>{service.title}</h4>
                          <p className="preview-desc">{service.description}</p>
                        </div>
                      </div>

                      <div className="edit-card">
                        <div className="field-pair">
                          <label>Title</label>
                          <input
                            value={service.title}
                            onChange={(e) => updateServiceField(idx, "title", e.target.value)}
                          />
                        </div>
                        <div className="field-pair">
                          <label>Category</label>
                          <input
                            value={service.category}
                            onChange={(e) => updateServiceField(idx, "category", e.target.value)}
                          />
                        </div>
                        <div className="field-pair">
                          <label>Image</label>
                          <div className="file-field">
                            <div className="file-display" title={service.image}>
                              {service.image || "Upload image (.jpg, .png)"}
                            </div>
                            <div className="file-actions">
                              <label className="file-btn">
                                Upload
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  hidden
                                  onChange={(e) => handleSelectImage(
                                    e.target.files,
                                    (val) => updateServiceField(idx, "image", val)
                                  )}
                                />
                              </label>
                              {service.image && (
                                <button
                                  className="ghost-btn file-remove"
                                  type="button"
                                  onClick={() =>
                                    askConfirm(
                                      "Remove image?",
                                      "This will clear the service image.",
                                      () => updateServiceField(idx, "image", "")
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="field-pair">
                          <label>Caption</label>
                          <textarea
                            value={service.description}
                            onChange={(e) => updateServiceField(idx, "description", e.target.value)}
                          />
                        </div>
                        <div className="card-actions">
                          <span className="chip">{service.category}</span>
                          <button
                            className="danger-btn"
                            onClick={() =>
                              askConfirm(
                                "Remove service?",
                                "This will delete the service card from the homepage.",
                                () => removeServiceById(service.id)
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="add-row">
                  <h3>Add Service</h3>
                  <div className="inline-fields">
                    <input
                      placeholder="Title"
                      value={newService.title}
                      onChange={(e) =>
                        setNewService((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                    <input
                      placeholder="Category"
                      value={newService.category}
                      onChange={(e) =>
                        setNewService((prev) => ({ ...prev, category: e.target.value }))
                      }
                    />
                    <div className="file-field">
                      <div className="file-display" title={newService.image || "Upload image"}>
                        {newService.image ? newService.image : "Upload image (.jpg, .png)"}
                      </div>
                      <div className="file-actions">
                        <label className="file-btn">
                          Upload
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            hidden
                            onChange={(e) =>
                              handleSelectImage(
                                e.target.files,
                                (val) => setNewService((prev) => ({ ...prev, image: val }))
                              )
                            }
                          />
                        </label>
                        {newService.image && (
                          <button
                            className="ghost-btn file-remove"
                            type="button"
                            onClick={() =>
                              askConfirm(
                                "Remove uploaded image?",
                                "This will clear the pending image.",
                                () => setNewService((prev) => ({ ...prev, image: "" }))
                              )
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <textarea
                    placeholder="Description"
                    value={newService.description}
                    onChange={(e) =>
                      setNewService((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />

                  <button className="primary-btn small" onClick={handleAddService}>
                    Add service
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection === "portfolio" && (
            <section className="section-block portfolio-block">
              <div className="section-header">
                <span className="section-tag">Portfolio</span>
                <h2>Carousel items</h2>
                <p>Preview of the user-facing tile beside its editable fields.</p>
              </div>
              <div className="panel">
                <div className="tabs-row">
                  {(["brand", "event", "print", "product"] as TabKey[]).map((tab) => (
                    <button
                      key={tab}
                      className={`pill ${activePortfolioTab === tab ? "active" : ""}`}
                      onClick={() => setActivePortfolioTab(tab)}
                    >
                      {draftContent.portfolio[tab].title}
                    </button>
                  ))}
                </div>

                <div className="editable-list">
                  {currentCategory.items.map((item) => (
                    <div className="dual-card" key={item.id}>
                      <div className="preview-card">
                        {item.image && (
                          <div className="preview-img">
                            <img src={item.image} alt={item.title} />
                          </div>
                        )}
                        <div className="preview-body">
                          <p className="preview-tag">#{activePortfolioTab}</p>
                          <h4>{item.title}</h4>
                          <p className="preview-desc">{item.details}</p>
                        </div>
                      </div>

                      <div className="edit-card">
                        <div className="field-pair">
                          <label>Title</label>
                          <input
                            value={item.title}
                            onChange={(e) =>
                              updatePortfolioItem(activePortfolioTab, item.id, "title", e.target.value)
                            }
                          />
                        </div>
                        <div className="field-pair">
                          <label>Image</label>
                          <div className="file-field">
                            <div className="file-display" title={item.image}>
                              {item.image || "Upload image (.jpg, .png)"}
                            </div>
                            <div className="file-actions">
                              <label className="file-btn">
                                Upload
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  hidden
                                  onChange={(e) =>
                                    handleSelectImage(
                                      e.target.files,
                                      (val) =>
                                        updatePortfolioItem(
                                          activePortfolioTab,
                                          item.id,
                                          "image",
                                          val
                                        )
                                    )
                                  }
                                />
                              </label>
                              {item.image && (
                                <button
                                  className="ghost-btn file-remove"
                                  type="button"
                                  onClick={() =>
                                    askConfirm(
                                      "Remove image?",
                                      "This will clear the portfolio image.",
                                      () =>
                                        updatePortfolioItem(
                                          activePortfolioTab,
                                          item.id,
                                          "image",
                                          ""
                                        )
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="field-pair">
                          <label>Caption</label>
                          <textarea
                            value={item.details}
                            onChange={(e) =>
                              updatePortfolioItem(
                                activePortfolioTab,
                                item.id,
                                "details",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="card-actions">
                          <span className="chip">#{activePortfolioTab}</span>
                          <button
                            className="danger-btn"
                            onClick={() =>
                              askConfirm(
                                "Remove portfolio item?",
                                "This will delete the item from the portfolio carousel.",
                                () => removePortfolioItem(activePortfolioTab, item.id)
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="add-row">
                  <h3>Add Portfolio Item</h3>
                  <div className="inline-fields">
                    <input
                      placeholder="Title"
                      value={newPortfolioItem.title}
                      onChange={(e) =>
                        setNewPortfolioItem((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                    <div className="file-field">
                      <div
                        className="file-display"
                        title={newPortfolioItem.image || "Upload image"}
                      >
                        {newPortfolioItem.image
                          ? newPortfolioItem.image
                          : "Upload image (.jpg, .png)"}
                      </div>
                      <div className="file-actions">
                        <label className="file-btn">
                          Upload
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            hidden
                            onChange={(e) =>
                              handleSelectImage(
                                e.target.files,
                                (val) =>
                                  setNewPortfolioItem((prev) => ({
                                    ...prev,
                                    image: val,
                                  }))
                              )
                            }
                          />
                        </label>
                        {newPortfolioItem.image && (
                          <button
                            className="ghost-btn file-remove"
                            type="button"
                            onClick={() =>
                              askConfirm(
                                "Remove uploaded image?",
                                "This will clear the pending image.",
                                () =>
                                  setNewPortfolioItem((prev) => ({
                                    ...prev,
                                    image: "",
                                  }))
                              )
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <textarea
                    placeholder="Caption / details"
                    value={newPortfolioItem.details}
                    onChange={(e) =>
                      setNewPortfolioItem((prev) => ({
                        ...prev,
                        details: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="primary-btn small"
                    onClick={handleAddPortfolioItem}
                  >
                    Add item to {draftContent.portfolio[activePortfolioTab].title}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => {
          confirmState.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
    </div>
  );
}
