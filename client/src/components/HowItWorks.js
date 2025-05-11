import "../style/HowItWorks.css";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Choose Specialty",
      description: "Browse and select the medical specialty you need.",
    },
    {
      title: "2. Book Appointment",
      description: "Pick a doctor and schedule your appointment easily.",
    },
    {
      title: "3. Get Treated",
      description: "Visit the clinic and receive professional care.",
    },
  ];

  return (
    <div className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <div className="steps">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
