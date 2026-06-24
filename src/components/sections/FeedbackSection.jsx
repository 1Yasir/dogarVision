import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { db } from "../../firebase";
import SectionTitle from "../common/SectionTitle";

const initialForm = { name: "", rating: "", review: "" };

function StarRating({ rating }) {
  return (
    <div aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, n) => (
        <span key={n} className={n < rating ? "text-warning" : "text-muted"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function FeedbackSection() {
  const [form, setForm] = useState(initialForm);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "feedbacks"), where("approved", "==", true));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setReviews(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Firestore feedback error:", err);
        setError("Unable to load feedback. Please try again later.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await addDoc(collection(db, "feedbacks"), {
        name: form.name.trim(),
        rating: Number(form.rating),
        review: form.review.trim(),
        approved: true,
        createdAt: serverTimestamp(),
      });
      setForm(initialForm);
      setSubmitted(true);
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-5 bg-light">
      <Container>
        <SectionTitle
          label="Customer Reviews"
          title="What Our Customers Say"
          desc="Share your experience with us. Your reviews appear below instantly for everyone to see."
          centered
        />

        <Card className="shadow-sm border-0 mb-5">
          <Card.Body className="p-4">
            <h3 className="h5 mb-3">Leave a Feedback</h3>
            {submitted ? (
              <Alert variant="success">
                Thank you! Your feedback has been successfully submitted and added below.
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="feedbackName">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="feedbackRating">
                      <Form.Label>Rating *</Form.Label>
                      <Form.Select
                        name="rating"
                        required
                        value={form.rating}
                        onChange={handleChange}
                      >
                        <option value="">Select rating</option>
                        <option value="5">5 — Excellent</option>
                        <option value="4">4 — Very Good</option>
                        <option value="3">3 — Good</option>
                        <option value="2">2 — Fair</option>
                        <option value="1">1 — Poor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="feedbackReview">
                      <Form.Label>Review *</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="review"
                        required
                        rows={4}
                        placeholder="Tell us about your experience with our natural products..."
                        value={form.review}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="success"
                  className="mt-3"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>

        <h3 className="h5 mb-3">Customer Reviews</h3>
        {loading ? (
          <p className="text-muted">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          <Row className="g-3">
            {reviews.map((review) => (
              <Col key={review.id} sm={6} lg={4}>
                <Card className="shadow-sm h-100 border-0">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div
                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                        style={{ width: 40, height: 40, fontWeight: 600 }}
                      >
                        {review.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <Card.Title as="h4" className="h6 mb-0">
                          {review.name}
                        </Card.Title>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <Card.Text className="small text-muted">{review.review}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
}