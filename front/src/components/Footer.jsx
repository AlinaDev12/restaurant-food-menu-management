
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            <span className="footer-logo-icon">♨</span>
            Swad<span>.</span>
          </a>
          <p>
            Bringing people together through delicious food,
            fresh ingredients, and unforgettable flavors.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
            <a href="https://facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
            <a href="https://youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
          </div>
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

        <div className="footer-contact">
          <h3>Made for Food Lovers</h3>
          <p>Explore our menu and discover your next favorite meal.</p>
          <a href="#menu" className="footer-cta">Discover the Menu ↗</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Swad Restaurant. All rights reserved.</p>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default Footer;
