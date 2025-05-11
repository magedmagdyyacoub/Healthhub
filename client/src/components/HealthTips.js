import "../style/HealthTips.css";

export default function HealthTips() {
  const tips = [
    "Stay hydrated by drinking at least 8 cups of water daily.",
    "Get 7–8 hours of sleep every night to support mental health.",
    "Incorporate at least 30 minutes of physical activity daily.",
    "Maintain a balanced diet rich in fruits and vegetables.",
    "Take breaks from screens to reduce eye strain and improve posture.",
  ];

  return (
    <div className="health-tips-container">
      <h2 className="section-title">Health Tips</h2>
      <ul className="tips-list">
        {tips.map((tip, index) => (
          <li key={index} className="tip-card">
            <span className="tip-index">#{index + 1}</span> {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
