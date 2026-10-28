
import { useEffect, useState } from "react";
import { getCategories, getImageUrl } from "../services/api";
import "../styles/Sections.css";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((response) => {
        const data = response.data;
        setCategories(
          Array.isArray(data)
            ? data
            : data.categories || data.data || []
        );
      })
      .catch(() => {
        setError("Unable to load categories. Please check your backend.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="categories-section" id="categories">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">EXPLORE OUR COLLECTION</span>
          <h2>Food <span>Categories</span></h2>
          <p>Discover something delicious for every craving.</p>
        </div>
        <span className="section-sparkle">✳</span>
      </div>

      {loading && <p className="section-message">Loading categories...</p>}

      {!loading && error && (
        <p className="section-error">{error}</p>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="section-message">
          No categories added yet. Add categories through your management system.
        </p>
      )}

      <div className="category-grid">
        {categories.map((category, index) => {
          const name = category.categoryName || category.name || "Category";
          const description =
            category.description || "Explore delicious items in this category.";
          const image =
            category.image || category.imagePath || category.categoryImage;

          return (
            <a
              href="#menu"
              className="category-card"
              key={category._id || category.id || index}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("swad-category-select", {
                    detail: name,
                  })
                );
              }}
            >
              <div className="category-image-wrap">
                {image ? (
                  <img
                    src={getImageUrl(image)}
                    alt={name}
                    className="category-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="image-placeholder">🍽️</div>
                )}
                <span className="category-arrow">↗</span>
              </div>

              <div className="category-info">
                <h3>{name}</h3>
                <p>{description}</p>
                <span className="category-link">Explore items →</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default CategorySection;
