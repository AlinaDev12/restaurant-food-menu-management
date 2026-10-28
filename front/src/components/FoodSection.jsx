
import { useEffect, useState } from "react";
import { getFoods, getCategories, getImageUrl } from "../services/api";
import "../styles/Sections.css";

function FoodSection() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getFoods(), getCategories()])
      .then(([foodResponse, categoryResponse]) => {
        const foodData = foodResponse.data;
        const categoryData = categoryResponse.data;

        setFoods(
          Array.isArray(foodData)
            ? foodData
            : foodData.foods || foodData.data || []
        );

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.categories || categoryData.data || []
        );
      })
      .catch(() => {
        setError("Unable to load the menu. Please check your backend connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleCategory = (event) => {
      setSelectedCategory(event.detail);
    };

    window.addEventListener("swad-category-select", handleCategory);

    return () => {
      window.removeEventListener("swad-category-select", handleCategory);
    };
  }, []);

  const getCategoryName = (food) => {
    const category = food.category;

    if (category && typeof category === "object") {
      return category.categoryName || category.name || "";
    }

    const categoryId = String(
      category?._id || category || food.categoryId || ""
    );

    const match = categories.find(
      (item) => String(item._id || item.id) === categoryId
    );

    return match
      ? match.categoryName || match.name || ""
      : food.categoryName || "";
  };

  const filteredFoods = foods.filter((food) => {
    const name = food.foodName || food.name || "";
    const categoryName = getCategoryName(food);

    const matchesCategory =
      selectedCategory === "All" || categoryName === selectedCategory;

    const matchesSearch = name
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="food-section" id="menu">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">MADE FRESH FOR YOU</span>
          <h2>Our Delicious <span>Menu</span></h2>
          <p>Find your favorite food, freshly prepared with love.</p>
        </div>
        <span className="section-sparkle">✦</span>
      </div>

      <div className="menu-toolbar">
        <div className="category-filters">
          <button
            className={`filter-btn ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            All Items
          </button>

          {categories.map((category) => {
            const name = category.categoryName || category.name;

            return (
              <button
                key={category._id || category.id || name}
                className={`filter-btn ${selectedCategory === name ? "active" : ""}`}
                onClick={() => setSelectedCategory(name)}
              >
                {name}
              </button>
            );
          })}
        </div>

        <label className="food-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search delicious food..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      {loading && <p className="section-message">Preparing your menu...</p>}

      {!loading && error && (
        <p className="section-error">{error}</p>
      )}

      {!loading && !error && filteredFoods.length === 0 && (
        <p className="section-message">
          No food items found. Try another search or add food items to your menu.
        </p>
      )}

      <div className="food-grid">
        {filteredFoods.map((food, index) => {
          const name = food.foodName || food.name || "Delicious Food";
          const description = food.description || "Prepared fresh with care.";
          const price = Number(food.price);
          const image =
            food.image || food.imagePath || food.foodImage;

          return (
            <article
              className="food-card"
              key={food._id || food.id || index}
              style={{ "--card-index": index }}
            >
              <div className="food-image-wrap">
                {image ? (
                  <img
                    src={getImageUrl(image)}
                    alt={name}
                    className="food-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="image-placeholder">🍲</div>
                )}
                <span className="food-category-tag">
                  {getCategoryName(food) || "Our Menu"}
                </span>
              </div>

              <div className="food-card-body">
                <div className="food-title-row">
                  <h3>{name}</h3>
                  <span className="food-price">
                    {Number.isFinite(price)
                      ? `Rs. ${price.toLocaleString("en-PK")}`
                      : "Price unavailable"}
                  </span>
                </div>

                <p className="food-description">{description}</p>

                <div className="food-card-bottom">
                  <span className="food-fresh">✦ Freshly prepared</span>
                  <span className="food-card-arrow">↗</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default FoodSection;
