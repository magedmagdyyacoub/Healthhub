import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SpecialtyList.css"; // Import CSS file

export default function SpecialtyList() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/specialties")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch specialties");
        }
        return res.json();
      })
      .then((data) => {
        setSpecialties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching specialties:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading specialties...</p>;
  }

  const handleSpecialtyClick = (id) => {
    navigate(`/specialty/${id}`);
  };

return (
  <div className="specialty-container">
    <h2 className="specialty-title">Specialties</h2>
    <div className="specialty-grid">
      {specialties.length === 0 ? (
        <p>No specialties found</p>
      ) : (
        specialties.map((specialty) => (
          <div
            key={specialty.id}
            className="specialty-card"
            onClick={() => handleSpecialtyClick(specialty.id)}
          >
            <h3>{specialty.name}</h3>
          </div>
        ))
      )}
    </div>
  </div>
);

}
