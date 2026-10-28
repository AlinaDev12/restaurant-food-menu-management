
import { getImageUrl } from "../services/api";

function FoodCard({ food, categoryName = "Our Menu" }) {
  const name = food.foodName || food.name || "Delicious Food";
  const price = Number(food.price);
  const image = food.image || food.imagePath || food.foodImage;

  return (
    <article className="food-card">
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
        <span className="food-category-tag">{categoryName}</span>
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

        <p className="food-description">
          {food.description || "Prepared fresh with care."}
        </p>

        <div className="food-card-bottom">
          <span className="food-fresh">✦ Freshly prepared</span>
          <span className="food-card-arrow">↗</span>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
