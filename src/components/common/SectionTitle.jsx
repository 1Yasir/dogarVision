export default function SectionTitle({ label, title, desc, centered }) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <span className="text-success small text-uppercase fw-semibold">{label}</span>
      <h2 className="mt-2">{title}</h2>
      {desc && (
        <p
          className="text-muted mt-2"
          style={centered ? { maxWidth: "640px", margin: "0 auto" } : undefined}
        >
          {desc}
        </p>
      )}
    </div>
  );
}