import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/AppointmentConfirmation.css'; // Optional: create this for styling

export default function AppointmentConfirmation() {
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId } = location.state || {}; // We expect appointmentId from the previous page

  useEffect(() => {
    if (!appointmentId) {
      setError('Appointment ID is missing');
      setLoading(false);
      return;
    }
  
    // Fetch appointment details from the backend API
    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`);

        
        // If the response is not 2xx, throw an error
        if (!response.ok) {
          const errorData = await response.text(); // Read the response text in case it's HTML
          throw new Error(errorData || 'Failed to fetch appointment details');
        }

        const data = await response.json(); // Parse JSON response

        setAppointment(data);
      } catch (error) {
        setError(error.message || 'Error fetching appointment details');
        console.error('Error:', error);
      } finally {
        setLoading(false); // Set loading to false after request completion
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  // Render loading state
  if (loading) {
    return (
      <div className="confirmation-container">
        <h2>Loading appointment details...</h2>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="confirmation-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  // Render appointment confirmation if data exists
  const { doctor_name, appointment_date, appointment_time } = appointment;

  return (
    <div className="confirmation-container">
      <h2>Appointment Confirmed!</h2>
      <p><strong>Doctor:</strong> {doctor_name}</p>
      <p><strong>Date:</strong> {appointment_date}</p>
      <p><strong>Time:</strong> {appointment_time}</p>

      <button onClick={() => navigate('/')}>Return to Home</button>
    </div>
  );
}
