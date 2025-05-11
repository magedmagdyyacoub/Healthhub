import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const { doctorId } = useParams();  // Access the doctorId from the URL
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  // Fetch doctor information using doctorId from the URL
  useEffect(() => {
    if (doctorId) {
      fetch(`http://localhost:5000/api/doctors/${doctorId}`)
        .then((res) => res.json())
        .then((data) => setDoctor(data))
        .catch((error) => console.error('Error fetching doctor:', error));
    }
  }, [doctorId]);

  const handleBooking = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first to book an appointment.');
      return;
    }

    // Proceed with the booking logic (e.g., save in the database)
    const appointmentData = {
      doctorId,
      userId: user,
      day: 'selectedDay',  // Replace with the actual day logic
      time: 'selectedTime',  // Replace with the actual time logic
    };

    fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    })
      .then((res) => {
        if (res.ok) {
          alert('Appointment booked successfully!');
          navigate('/appointments'); // Redirect to the appointments list page
        } else {
          alert('Error booking appointment.');
        }
      })
      .catch((error) => console.error('Error booking appointment:', error));
  };

  if (!doctor) {
    return <p>Loading doctor information...</p>;
  }

  return (
    <div className="appointment-container">
      <h2>Book Appointment with Dr. {doctor.name}</h2>
      <div className="appointment-details">
        <p>
          <strong>Specialty:</strong> {doctor.specialty}
        </p>
        <p>
          <strong>Day:</strong> {/* Replace with selected day */}
        </p>
        <p>
          <strong>Time:</strong> {/* Replace with selected time */}
        </p>
      </div>

      <button className="appointment-button" onClick={handleBooking}>
        Confirm Appointment
      </button>
    </div>
  );
}
