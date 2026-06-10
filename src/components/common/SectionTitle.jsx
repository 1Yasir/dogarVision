export default function SectionTitle({ label, title, desc, centered }) {
  return (
    <div style={centered ? { textAlign: "center" } : undefined}>
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
      {desc && (
        <p className="section-desc" style={centered ? { margin: "0 auto" } : undefined}>
          {desc}
        </p>
      )}
    </div>
  );
}
