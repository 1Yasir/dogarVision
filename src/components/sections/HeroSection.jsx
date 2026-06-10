import Button from "../common/Button";

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="container hero__grid">
        <div>
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Farm Fresh · Daily Delivery
          </div>

          <h1 className="hero__title">
            Fresh, Healthy &amp; Premium <span>Poultry Products</span> Direct From Our Farm
          </h1>

          <p className="hero__subtitle">
            Providing high-quality chicken, organic eggs, and day-old chicks raised with the highest biosecurity and hygiene standards.
          </p>

          <div className="hero__actions">
            <Button href="#products" variant="primary">View Products</Button>
            <Button href="#inquiry" variant="outline">Get a Quote / Contact Us</Button>
          </div>
        </div>

        <div className="hero__image-wrap">
          <div className="hero__float-card hero__float-card--top">
            <span>✅</span> 100% Organic Feed
          </div>

          <div className="hero__image">
            <span className="hero__image-emoji">🐔🥚</span>
            <span className="hero__image-text">Farm Image Placeholder</span>
          </div>

          <div className="hero__float-card hero__float-card--bottom">
            <span>🚚</span> Wholesale Delivery
          </div>
        </div>
      </div>
    </section>
  );
}
