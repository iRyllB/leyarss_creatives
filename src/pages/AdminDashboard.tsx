import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type TabKey,
  type Service,
  type PortfolioItem,
  useContent,
} from "../context/ContentContext";
import "../styles/AdminDashboard.css";

type SectionKey = "hero" | "about" | "services" | "portfolio";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    content,
    addService,
    updateService,
    removeService,
    addPortfolioItem,
    updatePortfolioItem,
    removePortfolioItem,
    updateHero,
    updateAbout,
    applyChanges,
  } = useContent();

  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [activePortfolioTab, setActivePortfolioTab] = useState<TabKey>("brand");
  const [status, setStatus] = useState("");

  const [newService, setNewService] = useState<Omit<Service, "id">>({
    title: "",
    category: "",
    image: "",
    description: "",
  });

  const [newPortfolioItem, setNewPortfolioItem] = useState<
    Omit<PortfolioItem, "id">
  >({
    title: "",
    image: "",
    details: "",
  });

  useEffect(() => {
    const authed = localStorage.getItem("leyarss-admin-authed") === "true";
    if (!authed) {
      navigate("/adminlogin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("leyarss-admin-authed");
    navigate("/adminlogin");
  };

  const handleApply = () => {
    applyChanges();
    setStatus("Changes applied to the main page preview.");
    setTimeout(() => setStatus(""), 3000);
  };

  const handleAddService = () => {
    if (!newService.title || !newService.category) return;
    addService(newService);
    setNewService({ title: "", category: "", image: "", description: "" });
  };

  const handleSelectImage = (
    files: FileList | null,
    setter: (value: string) => void
  ) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) return;
    const url = URL.createObjectURL(file);
    setter(url);
  };

  const handleAddPortfolioItem = () => {
    if (!newPortfolioItem.title || !newPortfolioItem.image) return;
    addPortfolioItem(activePortfolioTab, newPortfolioItem);
    setNewPortfolioItem({ title: "", image: "", details: "" });
  };

  const currentCategory = content.portfolio[activePortfolioTab];

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
                        {content.hero.line1} <br />
                        <span className="build-text">{content.hero.line2}</span> <br />
                        <span className="print-text">{content.hero.line3}</span>
                      </h1>
                      <p className="preview-desc">{content.hero.subtext}</p>
                    </div>
                    {content.hero.image && (
                      <div className="preview-img hero-image">
                        <img src={content.hero.image} alt="Hero visual" />
                      </div>
                    )}
                  </div>

                  <div className="edit-card">
                    <div className="field-pair">
                      <label>Line 1</label>
                      <input
                        value={content.hero.line1}
                        onChange={(e) => updateHero({ line1: e.target.value })}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Line 2</label>
                      <input
                        value={content.hero.line2}
                        onChange={(e) => updateHero({ line2: e.target.value })}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Line 3</label>
                      <input
                        value={content.hero.line3}
                        onChange={(e) => updateHero({ line3: e.target.value })}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Subtext</label>
                      <textarea
                        value={content.hero.subtext}
                        onChange={(e) => updateHero({ subtext: e.target.value })}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Image</label>
                      <div className="file-field">
                        <div className="file-display" title={content.hero.image}>
                          {content.hero.image || "Upload image (.jpg, .png)"}
                        </div>
                        <label className="file-btn">
                          Upload
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            hidden
                            onChange={(e) =>
                              handleSelectImage(
                                e.target.files,
                                (val) => updateHero({ image: val })
                              )
                            }
                          />
                        </label>
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
                    {content.about.image && (
                      <div className="preview-img">
                        <img src={content.about.image} alt="About preview" />
                      </div>
                    )}
                    <div className="preview-body">
                      <p className="preview-tag">Legacy & Energy</p>
                      <h4>{content.about.title}</h4>
                      <p className="preview-desc">{content.about.body}</p>
                    </div>
                  </div>
                  <div className="edit-card">
                    <div className="field-pair">
                      <label>Title</label>
                      <input
                        value={content.about.title}
                        onChange={(e) => updateAbout({ title: e.target.value })}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Body</label>
                      <textarea
                        value={content.about.body}
                        onChange={(e) => updateAbout({ body: e.target.value })}
                      />
                    </div>
                    <div className="field-pair">
                      <label>Image</label>
                      <div className="file-field">
                        <div className="file-display" title={content.about.image}>
                          {content.about.image || "Upload image (.jpg, .png)"}
                        </div>
                        <label className="file-btn">
                          Upload
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            hidden
                            onChange={(e) =>
                              handleSelectImage(
                                e.target.files,
                                (val) => updateAbout({ image: val })
                              )
                            }
                          />
                        </label>
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
                  {content.services.map((service) => (
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
                            onChange={(e) =>
                              updateService(service.id, { title: e.target.value })
                            }
                          />
                        </div>
                        <div className="field-pair">
                          <label>Category</label>
                          <input
                            value={service.category}
                            onChange={(e) =>
                              updateService(service.id, { category: e.target.value })
                            }
                          />
                        </div>
                        <div className="field-pair">
                          <label>Image</label>
                          <div className="file-field">
                            <div className="file-display" title={service.image}>
                              {service.image || "Upload image (.jpg, .png)"}
                            </div>
                            <label className="file-btn">
                              Upload
                              <input
                                type="file"
                                accept="image/png, image/jpeg"
                                hidden
                                onChange={(e) =>
                                  handleSelectImage(
                                    e.target.files,
                                    (val) => updateService(service.id, { image: val })
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                        <div className="field-pair">
                          <label>Caption</label>
                          <textarea
                            value={service.description}
                            onChange={(e) =>
                              updateService(service.id, { description: e.target.value })
                            }
                          />
                        </div>
                        <div className="card-actions">
                          <span className="chip">{service.category}</span>
                          <button
                            className="danger-btn"
                            onClick={() => removeService(service.id)}
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
                      <div
                        className="file-display"
                        title={newService.image || "Upload image"}
                      >
                        {newService.image
                          ? newService.image
                          : "Upload image (.jpg, .png)"}
                      </div>
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
                      {content.portfolio[tab].title}
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
                              updatePortfolioItem(activePortfolioTab, item.id, {
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="field-pair">
                          <label>Image</label>
                          <div className="file-field">
                            <div className="file-display" title={item.image}>
                              {item.image || "Upload image (.jpg, .png)"}
                            </div>
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
                                      updatePortfolioItem(activePortfolioTab, item.id, {
                                        image: val,
                                      })
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                        <div className="field-pair">
                          <label>Caption</label>
                          <textarea
                            value={item.details}
                            onChange={(e) =>
                              updatePortfolioItem(activePortfolioTab, item.id, {
                                details: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="card-actions">
                          <span className="chip">#{activePortfolioTab}</span>
                          <button
                            className="danger-btn"
                            onClick={() => removePortfolioItem(activePortfolioTab, item.id)}
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
                    Add item to {content.portfolio[activePortfolioTab].title}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
