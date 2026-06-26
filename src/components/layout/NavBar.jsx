import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../../data/siteData";
import { navCopy } from "../../data/copy.js";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

const SECTION_IDS = ["home", "about", "products", "contact"];

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Scroll listener for nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock jab menu open ho
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  // Section observer
  useEffect(() => {
    const hash = location.hash.replace("#", "");

    if (location.pathname === "/") {
      if (hash && SECTION_IDS.includes(hash)) {
        setActiveSection(hash);
        const el = document.getElementById(hash);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      } else if (!hash) {
        setActiveSection("home");
      }

      const observers = [];
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const observer = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
          { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
        );
        observer.observe(el);
        observers.push(observer);
      });

      return () => observers.forEach((o) => o.disconnect());
    }
  }, [location.pathname, location.hash]);

  const isLinkActive = (href, isCart) => {
    if (isCart) return location.pathname === "/cart";
    if (href === "/#home") return location.pathname === "/" && activeSection === "home";
    const sectionId = href.replace("/#", "");
    return location.pathname === "/" && activeSection === sectionId;
  };

  const handleSectionClick = (e, href) => {
    setExpanded(false);
    const sectionId = href.replace("/#", "");
    if (location.pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, null, href);
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  // Sun / Moon SVG icons
  const SunIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 3a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 18.93 11H20a1 1 0 1 1 0 2h-1.07A7.002 7.002 0 0 1 13 18.93V20a1 1 0 1 1-2 0v-1.07A7.002 7.002 0 0 1 5.07 13H4a1 1 0 1 1 0-2h1.07A7.002 7.002 0 0 1 11 5.07V4a1 1 0 0 1 1-1zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
    </svg>
  );

  const MoonIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 19 14.5 8.38 8.38 0 0 1 21 14.5z" />
    </svg>
  );

  return (
    <nav className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="container">
        <div className="nav__inner">

          {/* Brand */}
          <Link to="/" className="nav__brand">
            <span className="nav__brand-icon" aria-hidden="true">🐔</span>
            DV
          </Link>

          {/* Desktop Links */}
          <div className={`nav__links${expanded ? " nav__links--open" : ""}`}>
            {navLinks.map(({ key, href, isCart }) =>
              isCart ? (
                <Link
                  key={key}
                  to="/cart"
                  className={`nav__link nav__link--cart${isLinkActive(href, true) ? " nav__link--active" : ""}`}
                  onClick={() => setExpanded(false)}
                >
                  {navCopy[key]}
                  {itemCount > 0 && (
                    <span className="nav__cart-badge nav__cart-badge--inline">
                      {itemCount}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  key={key}
                  to={href}
                  className={`nav__link${isLinkActive(href, false) ? " nav__link--active" : ""}`}
                  onClick={(e) => handleSectionClick(e, href)}
                >
                  {navCopy[key]}
                </Link>
              )
            )}
          </div>

          {/* Controls: Theme + Hamburger */}
          <div className="nav__controls">
            <button
              className="nav__theme-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              className={`nav__toggle${expanded ? " nav__toggle--open" : ""}`}
              onClick={() => setExpanded((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={expanded}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}