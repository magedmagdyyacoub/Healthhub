import "../style/Testimonials.css";

export default function Testimonials() {
  const reviews = [
    {
      name: "Sarah M.",
      feedback: "The service was amazing! Booking was fast and easy. Highly recommended!",
    },
    {
      name: "Ahmed R.",
      feedback: "Professional staff and smooth experience. I felt well taken care of.",
    },
    {
      name: "Lina T.",
      feedback: "I love how clear and user-friendly the platform is. Great job!",
    },
  ];

  return (
    <div className="testimonials-section">
      <h2 className="section-title">What Our Users Say</h2>
      <div className="testimonial-grid">
        {reviews.map((review, idx) => (
          <div key={idx} className="testimonial-card">
            <p className="feedback">“{review.feedback}”</p>
            <p className="name">— {review.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
