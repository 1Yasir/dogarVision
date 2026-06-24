import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { navLinks } from "../../data/siteData";
import { navCopy } from "../../data/copy.js";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

const SECTION_IDS = ["home", "about", "products", "contact"];

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

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

  const handleSectionClick = (e, href) => {
    setExpanded(false);
    const sectionId = href.replace("/#", "");

    if (location.pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, null, href);
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setActiveSection(sectionId);
    }
  };

  return (
    <Navbar
      expand="lg"
      bg="body-tertiary"
      variant={isDark ? "dark" : "light"}
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span aria-hidden="true">🐔</span> DV
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {navLinks.map(({ key, href, isCart }) =>
              isCart ? (
                <Nav.Link
                  key={key}
                  as={Link}
                  to="/cart"
                  active={isLinkActive(href, true)}
                  onClick={() => setExpanded(false)}
                  className="d-flex align-items-center gap-1"
                >
                  {navCopy[key]}
                  {itemCount > 0 && (
                    <Badge bg="danger" pill>{itemCount}</Badge>
                  )}
                </Nav.Link>
              ) : (
                <Nav.Link
                  key={key}
                  as={Link}
                  to={href}
                  active={isLinkActive(href, false)}
                  onClick={(e) => handleSectionClick(e, href)}
                >
                  {navCopy[key]}
                </Nav.Link>
              )
            )}
          </Nav>

          <div className="d-flex align-items-center gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 3a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 18.93 11H20a1 1 0 1 1 0 2h-1.07A7.002 7.002 0 0 1 13 18.93V20a1 1 0 1 1-2 0v-1.07A7.002 7.002 0 0 1 5.07 13H4a1 1 0 1 1 0-2h1.07A7.002 7.002 0 0 1 11 5.07V4a1 1 0 0 1 1-1zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 19 14.5 8.38 8.38 0 0 1 21 14.5z" />
                </svg>
              )}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}