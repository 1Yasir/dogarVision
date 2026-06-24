import Card from "react-bootstrap/Card";

export default function FeatureCard({ icon, title, desc }) {
  return (
    <Card className="shadow-sm h-100 border-0 text-center">
      <Card.Body className="p-4">
        <div className="mb-3" style={{ fontSize: "2.5rem" }} aria-hidden="true">
          {icon}
        </div>
        <Card.Title as="h3" className="h5">{title}</Card.Title>
        <Card.Text className="text-muted small">{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
}