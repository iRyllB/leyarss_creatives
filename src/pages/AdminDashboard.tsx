import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type TabKey,
  type Service,
  type PortfolioItem,
  useContent,
} from "../context/ContentContext";
import "../styles/AdminDashboard.css";

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
    applyChanges,
  } = useContent();

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

  const handleAddPortfolioItem = () => {
    if (!newPortfolioItem.title || !newPortfolioItem.image) return;
    addPortfolioItem(activePortfolioTab, newPortfolioItem);
    setNewPortfolioItem({ title: "", image: "", details: "" });
  };

  const currentCategory = content.portfolio[activePortfolioTab];

  return (
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
        <section className="section-block services-block">
          <div className="section-header">
            <span className="section-tag">Services</span>
            <h2>Same cards you see on Home</h2>
            <p>Left: live preview of the user-facing card. Right: editable fields.</p>
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
                      <label>Image URL</label>
                      <input
                        value={service.image}
                        onChange={(e) =>
                          updateService(service.id, { image: e.target.value })
                        }
                      />
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
                <input
                  placeholder="Image path e.g. /service-7.jpg"
                  value={newService.image}
                  onChange={(e) =>
                    setNewService((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
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
                      <label>Image URL</label>
                      <input
                        value={item.image}
                        onChange={(e) =>
                          updatePortfolioItem(activePortfolioTab, item.id, {
                            image: e.target.value,
                          })
                        }
                      />
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
                <input
                  placeholder="Image path e.g. /portfolio-new.jpg"
                  value={newPortfolioItem.image}
                  onChange={(e) =>
                    setNewPortfolioItem((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                />
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
      </div>
    </div>
  );
}
