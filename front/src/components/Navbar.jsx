
import { useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a href="#home" className="nav-logo" onClick={closeMenu}>
        <span className="logo-icon">♨</span>
        <span>Swad<span className="logo-orange">.</span></span>
      </a>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#categories" onClick={closeMenu}>Categories</a>
        <a href="#menu" onClick={closeMenu}>Our Menu</a>
        <a href="#about" onClick={closeMenu}>About</a>
      </nav>

      <a href="#menu" className="nav-button">
        Explore Menu <span>↗</span>
      </a>
    </header>
  );
}

export default Navbar;
