export default function SectionTitle({ label, title, desc, centered }) {
  return (
    <div className={centered ? "text-center" : undefined}>
      {label && <span className="section-label">{label}</span>}
      <h2 className="section-title">{title}</h2>
      {desc && (
        <p
          className="section-desc"
          style={centered ? { margin: "0 auto" } : undefined}
        >
          {desc}
        </p>
      )}
    </div>
  );
}