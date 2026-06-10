export default function Button({ children, variant = "primary", size, href, onClick, type = "button", disabled, className: extraClass = "" }) {
  const className = [
    "btn",
    variant === "primary" && "btn--primary",
    variant === "outline" && "btn--outline",
    variant === "accent" && "btn--accent",
    size === "sm" && "btn--sm",
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
