
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";
const CATEGORY_API = `${API}/api/categories`;
const FOOD_API = `${API}/api/foods`;

const imageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API}/${path.replace(/^\/+/, "")}`;
};

const emptyCategory = { name: "", description: "", image: null };
const emptyFood = {
  foodName: "",
  price: "",
  description: "",
  category: "",
  image: null,
};

function App() {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState("");
  const [editing, setEditing] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [foodForm, setFoodForm] = useState(emptyFood);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryResponse, foodResponse] = await Promise.all([
        axios.get(CATEGORY_API),
        axios.get(FOOD_API),
      ]);
      setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
      setFoods(Array.isArray(foodResponse.data) ? foodResponse.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Cannot connect to the backend. Make sure your server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  async function initializeData() {
    await loadData();
  }

  initializeData();
}, []);

  const visibleFoods = useMemo(() => {
    return foods.filter((food) => {
      const name = food.foodName || food.name || "";
      const categoryId =
        typeof food.category === "object"
          ? food.category?._id
          : food.category;

      const matchesCategory =
        activeCategory === "all" || categoryId === activeCategory;

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        (food.description || "").toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [foods, search, activeCategory]);

  const openCategoryForm = (category = null) => {
    setEditing(category);
    setCategoryForm(
      category
        ? { name: category.name || "", description: category.description || "", image: null }
        : { ...emptyCategory }
    );
    setNotice("");
    setModal("category");
  };

  const openFoodForm = (food = null) => {
    setEditing(food);
    setFoodForm(
      food
        ? {
            foodName: food.foodName || food.name || "",
            price: food.price ?? "",
            description: food.description || "",
            category:
              typeof food.category === "object"
                ? food.category?._id || ""
                : food.category || "",
            image: null,
          }
        : { ...emptyFood }
    );
    setNotice("");
    setModal("food");
  };

  const closeModal = () => {
    if (saving) return;
    setModal("");
    setEditing(null);
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    if (!categoryForm.name.trim() || !categoryForm.description.trim()) {
      setNotice("Please enter the category name and description.");
      return;
    }
    if (!editing && !categoryForm.image) {
      setNotice("Please select a category image.");
      return;
    }

    const data = new FormData();
    data.append("name", categoryForm.name.trim());
    data.append("description", categoryForm.description.trim());
    if (categoryForm.image) data.append("image", categoryForm.image);

    setSaving(true);
    try {
      if (editing) {
        await axios.put(`${CATEGORY_API}/${editing._id}`, data);
      } else {
        await axios.post(CATEGORY_API, data);
      }
      setModal("");
      setEditing(null);
      await loadData();
      setError("");
      setNotice(editing ? "Category updated successfully." : "Category added successfully.");
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  const saveFood = async (event) => {
    event.preventDefault();

    if (
      !foodForm.foodName.trim() ||
      !foodForm.description.trim() ||
      !foodForm.category ||
      foodForm.price === "" ||
      Number(foodForm.price) <= 0
    ) {
      setNotice("Enter all required fields and a price greater than zero.");
      return;
    }
    if (!editing && !foodForm.image) {
      setNotice("Please select a food image.");
      return;
    }

    const data = new FormData();
    data.append("foodName", foodForm.foodName.trim());
    data.append("price", String(foodForm.price));
    data.append("description", foodForm.description.trim());
    data.append("category", foodForm.category);
    if (foodForm.image) data.append("image", foodForm.image);

    setSaving(true);
    try {
      if (editing) {
        await axios.put(`${FOOD_API}/${editing._id}`, data);
      } else {
        await axios.post(FOOD_API, data);
      }
      setModal("");
      setEditing(null);
      await loadData();
      setError("");
      setNotice(editing ? "Food item updated successfully." : "Food item added successfully.");
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not save food item.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete "${category.name}" and its food items?`)) return;
    setError("");
    setNotice("");
    try {
      await axios.delete(`${CATEGORY_API}/${category._id}`);
      if (activeCategory === category._id) setActiveCategory("all");
      await loadData();
      setNotice("Category and its food items deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete category.");
    }
  };

  const deleteFood = async (food) => {
    if (!window.confirm(`Delete "${food.foodName || food.name}"?`)) return;
    setError("");
    setNotice("");
    try {
      await axios.delete(`${FOOD_API}/${food._id}`);
      await loadData();
      setNotice("Food item deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete food item.");
    }
  };

  return (
    <div className="swad-app" id="home">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-mark">♨</span>
          Swad<span className="brand-dot">.</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#menu">Our Menu</a>
          <a href="#footer">About</a>
        </nav>

        <button className="button button-primary nav-button" onClick={() => openFoodForm()}>
          + Add Food
        </button>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><span /> FRESH · HOT · DELICIOUS</span>
            <h1>Good Food.<br /><em>Great Mood.</em></h1>
            <p>
              Discover delicious flavors, explore our food menu and find
              something special for every craving. Freshly prepared and served with love.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#menu">Explore Our Menu ↗</a>
              <a className="button button-outline" href="#categories">Browse Categories</a>
            </div>
            <div className="hero-points">
              <span>✦ Fresh Ingredients</span>
              <span>✦ Made with Love</span>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85"
              alt="Freshly prepared colorful restaurant food"
            />
            <div className="floating-note">
              <span className="note-icon">✦</span>
              <span><b>Made fresh daily</b><small>Quality in every bite</small></span>
            </div>
            <span className="hero-spark spark-one">✳</span>
            <span className="hero-spark spark-two">✦</span>
          </div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-kicker">MADE FOR EVERY CRAVING</span>
              <h2>Food <em>Categories</em></h2>
              <p>Discover something delicious for every craving.</p>
            </div>
            <button className="button button-primary" onClick={() => openCategoryForm()}>
              + Add Category
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {notice && <div className="alert alert-success">{notice}</div>}

          {loading ? (
            <div className="empty-state">Preparing your menu...</div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✳</span>
              <h3>Your categories start here</h3>
              <p>Add your first category to organize your restaurant menu.</p>
              <button className="button button-primary" onClick={() => openCategoryForm()}>
                + Create First Category
              </button>
            </div>
          ) : (
            <div className="category-grid">
              {categories.map((category) => (
                <article className="category-card" key={category._id}>
                  <button
                    className="category-image-button"
                    onClick={() => {
                      setActiveCategory(category._id);
                      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    aria-label={`View ${category.name} foods`}
                  >
                    {category.image ? (
                      <img src={imageUrl(category.image)} alt={category.name}
                        onError={(event) => { event.currentTarget.style.opacity = "0.15"; }} />
                    ) : <div className="image-placeholder">🍽️</div>}
                    <span className="image-overlay">Explore category ↗</span>
                  </button>
                  <div className="category-card-body">
                    <div>
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                    <div className="card-actions">
                      <button className="text-button" onClick={() => openCategoryForm(category)}>Edit</button>
                      <button className="text-button danger-text" onClick={() => deleteCategory(category)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section menu-section" id="menu">
          <div className="section-heading menu-heading">
            <div>
              <span className="section-kicker">MADE FRESH FOR YOU</span>
              <h2>Our Delicious <em>Menu</em></h2>
              <p>Find your favorite food, freshly prepared with love.</p>
            </div>
            <button className="button button-primary" onClick={() => openFoodForm()}>
              + Add Food
            </button>
          </div>

          <div className="menu-toolbar">
            <div className="filter-list">
              <button
                className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >All Items</button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`filter-chip ${activeCategory === category._id ? "active" : ""}`}
                  onClick={() => setActiveCategory(category._id)}
                >{category.name}</button>
              ))}
            </div>
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search delicious food..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {loading ? (
            <div className="empty-state">Loading delicious food...</div>
          ) : visibleFoods.length === 0 ? (
            <div className="empty-state menu-empty">
              <span className="empty-icon">🍲</span>
              <h3>{foods.length === 0 ? "Your menu is waiting!" : "No matching food found"}</h3>
              <p>
                {foods.length === 0
                  ? "Add your first food item with its price, category and image."
                  : "Try another search or select a different category."}
              </p>
              {foods.length === 0 && (
                <button className="button button-primary" onClick={() => openFoodForm()}>
                  + Add Your First Food
                </button>
              )}
            </div>
          ) : (
            <div className="food-grid">
              {visibleFoods.map((food) => {
                const categoryName =
                  typeof food.category === "object"
                    ? food.category?.name
                    : categories.find((category) => category._id === food.category)?.name;

                return (
                  <article className="food-card" key={food._id}>
                    <div className="food-image-wrap">
                      {food.image ? (
                        <img src={imageUrl(food.image)} alt={food.foodName || food.name}
                          onError={(event) => { event.currentTarget.style.opacity = "0.15"; }} />
                      ) : <div className="image-placeholder">🍲</div>}
                      <span className="food-category-tag">{categoryName || "Restaurant Favorite"}</span>
                    </div>
                    <div className="food-card-body">
                      <div className="food-title-row">
                        <h3>{food.foodName || food.name}</h3>
                        <span className="food-price">
                          Rs. {Number(food.price).toLocaleString("en-PK")}
                        </span>
                      </div>
                      <p className="food-description">{food.description}</p>
                      <div className="food-card-bottom">
                        <span className="food-fresh">✦ Freshly prepared</span>
                        <div className="card-actions">
                          <button className="text-button" onClick={() => openFoodForm(food)}>Edit</button>
                          <button className="text-button danger-text" onClick={() => deleteFood(food)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand footer-logo" href="#home">
              <span className="brand-mark">♨</span> Swad<span className="brand-dot">.</span>
            </a>
            <p>Bringing people together through delicious food, fresh ingredients and unforgettable flavors.</p>
            <span className="footer-tagline">✦ Fresh ingredients · Made with love</span>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#home">Home</a>
            <a href="#categories">Categories</a>
            <a href="#menu">Our Menu</a>
          </div>
          <div className="footer-column">
            <h3>Our Promise</h3>
            <span>Fresh Ingredients</span>
            <span>Quality Food</span>
            <span>Made with Love</span>
          </div>
          <div className="footer-column">
            <h3>Made for Food Lovers</h3>
            <p>Explore our menu and discover your next favorite meal.</p>
            <a className="button button-primary footer-cta" href="#menu">Discover the Menu ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Swad Restaurant. All rights reserved.</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}>
          <div className="form-modal" role="dialog" aria-modal="true"
            aria-labelledby="modal-title">
            <div className="modal-header">
              <div>
                <span className="section-kicker">SWAD RESTAURANT</span>
                <h2 id="modal-title">
                  {modal === "category"
                    ? editing ? "Edit Category" : "Create Category"
                    : editing ? "Edit Food Item" : "Add New Food"}
                </h2>
              </div>
              <button className="modal-close" onClick={closeModal} disabled={saving} aria-label="Close">×</button>
            </div>

            <form className="management-form" onSubmit={modal === "category" ? saveCategory : saveFood}>
              {modal === "category" ? (
                <>
                  <label>Category Name *
                    <input required maxLength={80} value={categoryForm.name}
                      onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
                      placeholder="e.g. Fast Food" />
                  </label>
                  <label>Description *
                    <textarea required maxLength={500} rows={3} value={categoryForm.description}
                      onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })}
                      placeholder="Describe this category..." />
                  </label>
                  <label>Category Image {!editing && "*"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                      required={!editing}
                      onChange={(event) => setCategoryForm({ ...categoryForm, image: event.target.files?.[0] || null })} />
                    <small>JPG, PNG, WEBP or GIF. Maximum 5 MB.</small>
                  </label>
                  {editing?.image && !categoryForm.image && (
                    <div className="current-image">
                      <img src={imageUrl(editing.image)} alt="Current category" />
                      <span>Current image (upload a new one to replace it)</span>
                    </div>
                  )}
                  {categoryForm.image && <p className="file-selected">Selected: {categoryForm.image.name}</p>}
                </>
              ) : (
                <>
                  <label>Food Name *
                    <input required maxLength={100} value={foodForm.foodName}
                      onChange={(event) => setFoodForm({ ...foodForm, foodName: event.target.value })}
                      placeholder="e.g. Chicken Burger" />
                  </label>
                  <label>Price (Rs.) *
                    <input required type="number" min="0.01" step="0.01" value={foodForm.price}
                      onChange={(event) => setFoodForm({ ...foodForm, price: event.target.value })}
                      placeholder="e.g. 650" />
                  </label>
                  <label>Description *
                    <textarea required maxLength={1000} rows={3} value={foodForm.description}
                      onChange={(event) => setFoodForm({ ...foodForm, description: event.target.value })}
                      placeholder="Describe your delicious food..." />
                  </label>
                  <label>Food Category *
                    <select required value={foodForm.category}
                      onChange={(event) => setFoodForm({ ...foodForm, category: event.target.value })}>
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                      ))}
                    </select>
                  </label>
                  {categories.length === 0 && (
                    <p className="form-hint">Create a category before adding a food item.</p>
                  )}
                  <label>Food Image {!editing && "*"}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                      required={!editing}
                      onChange={(event) => setFoodForm({ ...foodForm, image: event.target.files?.[0] || null })} />
                    <small>JPG, PNG, WEBP or GIF. Maximum 5 MB.</small>
                  </label>
                  {editing?.image && !foodForm.image && (
                    <div className="current-image">
                      <img src={imageUrl(editing.image)} alt="Current food" />
                      <span>Current image (upload a new one to replace it)</span>
                    </div>
                  )}
                  {foodForm.image && <p className="file-selected">Selected: {foodForm.image.name}</p>}
                </>
              )}

              {notice && <div className="alert alert-error">{notice}</div>}
              <div className="modal-actions">
                <button type="button" className="button button-outline" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary"
                  disabled={saving || (modal === "food" && categories.length === 0)}>
                  {saving ? "Saving..." : editing ? "Save Changes" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
