import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../../data/siteData";
import { useCart } from "../../context/CartContext";

const SECTION_IDS = ["home", "about", "products", "contact"];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const hash = location.hash.replace("#", "");
    if (hash && SECTION_IDS.includes(hash)) {
      setActiveSection(hash);
    }

    const observers = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [location.pathname, location.hash]);

  const isLinkActive = (href, isCart) => {
    if (isCart) return location.pathname === "/cart";
    if (href === "/#home") {
      return location.pathname === "/" && activeSection === "home";
    }
    const sectionId = href.replace("/#", "");
    return location.pathname === "/" && activeSection === sectionId;
  };

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand">
          <span className="nav__brand-icon">🐔</span>
          DV
        </Link>

        <button
          className={`nav__toggle ${menuOpen ? "nav__toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav__links ${menuOpen ? "nav__links--open" : ""}`}>
          {navLinks.map(({ label, href, isCart }) =>
            isCart ? (
              <Link
                key={label}
                to="/cart"
                className={`nav__link nav__link--cart${isLinkActive(href, true) ? " nav__link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
                {itemCount > 0 && (
                  <span className="nav__cart-badge nav__cart-badge--inline">
                    {itemCount}
                  </span>
                )}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className={`nav__link${isLinkActive(href, false) ? " nav__link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
