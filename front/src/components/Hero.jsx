
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="hero-badge">
          <span className="badge-dot"></span>
          FRESH · HOT · DELICIOUS
        </span>

        <h1>
          Good Food.
          <br />
          <span>Great Mood.</span>
        </h1>

        <p className="hero-description">
          Discover delicious flavors, explore our food menu,
          and find something special for every craving.
          Freshly prepared and served with love.
        </p>

        <div className="hero-actions">
          <a href="#menu" className="hero-primary">
            Explore Our Menu <span>↗</span>
          </a>

          <a href="#categories" className="hero-secondary">
            Browse Categories
          </a>
        </div>

        <div className="hero-features">
          <div>
            <span className="feature-icon">✦</span>
            <span>Fresh Ingredients</span>
          </div>
          <div>
            <span className="feature-icon">♡</span>
            <span>Made with Love</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image"></div>

        <div className="hero-floating-card">
          <span className="floating-icon">♨</span>
          <div>
            <strong>Made Fresh Daily</strong>
            <p>Quality in every bite</p>
          </div>
          <span className="floating-star">✦</span>
        </div>

        <div className="hero-decoration decoration-one">✳</div>
        <div className="hero-decoration decoration-two">✦</div>
      </div>
    </section>
  );
}

export default Hero;
