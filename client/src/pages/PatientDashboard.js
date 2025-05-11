import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      // Retrieve patient ID from localStorage
      const patientId = localStorage.getItem("patient_id");

      // Debugging: Check stored patient ID
      console.log("Stored Patient ID:", patientId);

      if (!patientId || isNaN(patientId)) {
        console.error("Invalid patient ID:", patientId);
        setError("Patient ID missing. Try logging in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/appointments/patient/${patientId}`);
        setAppointments(res.data.appointments);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Welcome to the Patient Dashboard</h1>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p>{error}</p>
      ) : appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <div>
          <h2>Your Appointments:</h2>
          <ul>
            {appointments.map((appt) => (
              <li key={appt.id}>
                <strong>Doctor:</strong> {appt.doctor_name} <br />
                <strong>Date:</strong> {appt.appointment_date} <br />
                <strong>Time:</strong> {appt.appointment_time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
