import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../../data/siteData";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

const SECTION_IDS = ["home", "about", "products", "contact"];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t, languages } = useLanguage();
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

  // Handle scrolling when hash changes or on home page navigation
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    
    if (location.pathname === "/") {
      if (hash && SECTION_IDS.includes(hash)) {
        setActiveSection(hash);
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        }
      } else if (!hash) {
        setActiveSection("home");
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
    }
  }, [location.pathname, location.hash]);

  const isLinkActive = (href, isCart) => {
    if (isCart) return location.pathname === "/cart";
    if (href === "/#home") {
      return location.pathname === "/" && activeSection === "home";
    }
    const sectionId = href.replace("/#", "");
    return location.pathname === "/" && activeSection === sectionId;
  };

  // Smooth scroll handle for section links
  const handleSectionClick = (e, href) => {
    setMenuOpen(false);
    const sectionId = href.replace("/#", "");
    
    if (location.pathname === "/") {
      e.preventDefault(); // Browser refresh rokay ga
      window.history.pushState(null, null, href); // URL update kare ga bina refresh ke
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand">
          <span className="nav__brand-icon">🐔</span>
          DV
        </Link>

        <div className={`nav__links ${menuOpen ? "nav__links--open" : ""}`}>
          {navLinks.map(({ key, href, isCart }) =>
            isCart ? (
              <Link
                key={key}
                to="/cart"
                className={`nav__link nav__link--cart${isLinkActive(href, true) ? " nav__link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {t(`nav.${key}`)}
                {itemCount > 0 && (
                  <span className="nav__cart-badge nav__cart-badge--inline">
                    {itemCount}
                  </span>
                )}
              </Link>
            ) : (
              /* 🟢 FIXED: <a> tag ko <Link> se badal diya aur handleSectionClick attach kar diya */
              <Link
                key={key}
                to={href}
                className={`nav__link${isLinkActive(href, false) ? " nav__link--active" : ""}`}
                onClick={(e) => handleSectionClick(e, href)}
              >
                {t(`nav.${key}`)}
              </Link>
            )
          )}
        </div>

        <div className="nav__controls">
          <select
            className="nav__lang-select bg-white text-slate-800 dark:bg-slate-800 dark:text-white border border-slate-300 dark:border-slate-600"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Select language"
          >
            {languages.map(({ code, label }) => (
              <option key={code} value={code} className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white border border-slate-300 dark:border-slate-600">
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="nav__theme-btn"
            onClick={toggleTheme}
            aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M12 3a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 18.93 11H20a1 1 0 1 1 0 2h-1.07A7.002 7.002 0 0 1 13 18.93V20a1 1 0 1 1-2 0v-1.07A7.002 7.002 0 0 1 5.07 13H4a1 1 0 1 1 0-2h1.07A7.002 7.002 0 0 1 11 5.07V4a1 1 0 0 1 1-1zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 19 14.5 8.38 8.38 0 0 1 21 14.5z" />
              </svg>
            )}
          </button>

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
        </div>
      </div>
    </nav>
  );
}