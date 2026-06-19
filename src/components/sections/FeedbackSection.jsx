import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import Button from "../common/Button";
import SectionTitle from "../common/SectionTitle";

const initialForm = { name: "", rating: "", review: "" };

function StarRating({ rating }) {
  return (
    <div className="feedback-card__stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, n) => (
        <span key={n} className={n < rating ? "feedback-card__star--filled" : ""}>
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
    // 🟢 Kyunki reviews direct show ho rahe hain, query par 'approved == true' ab bhi kaam karega kyunki hum submit true hi kar rahe hain
    const q = query(collection(db, "feedbacks"), where("approved", "==", true));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Firestore Error Detailed:", err);
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
        approved: true, // 🟢 Direct display ke liye pehle se hi true ja raha hai
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
    <section id="feedback" className="section feedback">
      <div className="container">
        {/* 🟢 FIXED: Desc text badal kar instant show hone ka message de diya */}
        <SectionTitle
          label="Customer Reviews"
          title="What Our Customers Say"
          desc="Share your experience with us. Your reviews appear below instantly for everyone to see."
          centered
        />

        <div className="feedback__form-wrap">
          <h3 className="feedback__form-title">Leave a Feedback</h3>
          {submitted ? (
            /* 🟢 FIXED: Approval text yahan se khatam kar diya */
            <div className="form-success">
              Thank you! Your feedback has been successfully submitted and added below.
            </div>
          ) : (
            <form className="feedback__form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="feedbackName">
                    Name *
                  </label>
                  <input
                    className="form-input"
                    id="feedbackName"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="feedbackRating">
                    Rating *
                  </label>
                  <select
                    className="form-select"
                    id="feedbackRating"
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
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="feedbackReview">
                  Review *
                </label>
                <textarea
                  className="form-textarea"
                  id="feedbackReview"
                  name="review"
                  required
                  rows={4}
                  placeholder="Tell us about your experience with our natural products..."
                  value={form.review}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="feedback__error">{error}</p>}

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          )}
        </div>

        <div className="feedback__list">
          {/* 🟢 FIXED: Title se 'Approved' lafz hata kar direct kar diya */}
          <h3 className="feedback__list-title">Customer Reviews</h3>
          {loading ? (
            <p className="feedback__status">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="feedback__status">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            <div className="feedback-grid">
              {reviews.map((review) => (
                <article key={review.id} className="feedback-card">
                  <div className="feedback-card__header">
                    <div className="feedback-card__avatar">
                      {review.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h4 className="feedback-card__name">{review.name}</h4>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="feedback-card__review">{review.review}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}