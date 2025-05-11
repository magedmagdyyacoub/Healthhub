import React from "react";
import "../style/HealthNews.css";

const HealthNews = () => {
  return (
    <div className="health-news">
      <h2>Latest Health News</h2>
      <div className="news-card">
        <h3>Stay Hydrated for Better Health</h3>
        <p>Drinking at least 8 cups of water daily helps maintain energy levels and cognitive function.</p>
      </div>
      <div className="news-card">
        <h3>Importance of Quality Sleep</h3>
        <p>Getting 7-8 hours of sleep per night supports mental health and overall well-being.</p>
      </div>
    </div>
  );
};

export default HealthNews;
