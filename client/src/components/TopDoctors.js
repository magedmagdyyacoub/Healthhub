// src/components/TopDoctors.js
import { useEffect, useState } from 'react';
import '../style/TopDoctor.css';

export default function TopDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch('/api/users/random-doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error('Failed to fetch doctors:', err));
  }, []);

  return (
    <section className="top-doctors-section">
      <h2 className="top-doctors-title">Top Rated Doctors</h2>
      <div className="doctor-cards">
        {doctors.map((doc, index) => (
          <div className="doctor-card" key={index}>
            <img
              src={doc.image || '/images/default-doctor.jpg'}
              alt={doc.name}
              className="doctor-image"
            />
            <h3>{doc.name}</h3>
            <p>{doc.specialty}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
