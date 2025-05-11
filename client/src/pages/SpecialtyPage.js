import '../style/SpecialtyPage.css'; 
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SpecialtyPage() {
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/specialties/${id}/doctors`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch doctors');
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      });
  }, [id]);

  const handleAppointmentClick = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setSelectedDay('');
    setSelectedTime('');
    setTimeSlots([]);
  };

  const handleDayChange = (day, doctorId) => {
    setSelectedDay(day);
    setSelectedTime('');

    const doctor = doctors.find((doc) => doc.id === doctorId);
    const daySlot = doctor.schedule.find((slot) => slot.day === day);

    if (daySlot) {
      const slots = generateTimeSlots(daySlot.start, daySlot.end);
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
  };

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    while (
      startHour < endHour ||
      (startHour === endHour && startMinute < endMinute)
    ) {
      const formatted = `${String(startHour).padStart(2, '0')}:${String(
        startMinute
      ).padStart(2, '0')}`;
      slots.push(formatted);

      startMinute += 30;
      if (startMinute >= 60) {
        startHour += 1;
        startMinute = 0;
      }
    }

    return slots;
  };

  const getNextDateFromDay = (dayName) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const todayIndex = today.getDay();
    const targetIndex = daysOfWeek.indexOf(dayName);

    let diff = targetIndex - todayIndex;
    if (diff <= 0) diff += 7;

    const nextDate = new Date();
    nextDate.setDate(today.getDate() + diff);
    return nextDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const handleConfirmBooking = async () => {
    if (!selectedDay || !selectedTime) {
      alert('Please select a day and time.');
      return;
    }
  
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login first to make an appointment.');
      return;
    }
  
    const appointmentDate = getNextDateFromDay(selectedDay);
  
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user.id,
          doctor_id: selectedDoctorId,
          appointment_date: appointmentDate,
          appointment_time: selectedTime,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book appointment');
      }
  
      const appointment = await response.json();
      alert('Appointment booked successfully!');
  
      navigate('/appointments/confirmation', {
        state: { appointmentId: appointment.id },
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.message);
    }
  };
  
  

  if (loading) return <p className="specialty-container">Loading doctors...</p>;

  return (
    <div className="specialty-container">
      <h2 className="specialty-title">Doctors in Specialty</h2>
      {doctors.length === 0 ? (
        <p>No doctors available in this specialty.</p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
              <h3 className="doctor-name">{doctor.name}</h3>
              <h4 className="schedule-title">Available at:</h4>
              {doctor.schedule?.length > 0 ? (
                <ul className="schedule-list">
                  {doctor.schedule.map((slot, index) => (
                    <li key={index} className="schedule-item">
                      {slot.day}: {slot.start} - {slot.end}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Unavailable</p>
              )}

              <button
                className="appointment-button"
                onClick={() => handleAppointmentClick(doctor.id)}
              >
                Book Appointment
              </button>

              {selectedDoctorId === doctor.id && doctor.schedule.length > 0 && (
                <div className="appointment-form">
                  <label>
                    Choose Day:
                    <select
                      value={selectedDay}
                      onChange={(e) => handleDayChange(e.target.value, doctor.id)}
                    >
                      <option value="">-- Select a Day --</option>
                      {doctor.schedule.map((slot, index) => (
                        <option key={index} value={slot.day}>
                          {slot.day}
                        </option>
                      ))}
                    </select>
                  </label>

                  {timeSlots.length > 0 && (
                    <label>
                      Choose Time:
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">-- Select Time --</option>
                        {timeSlots.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <button
                    className="appointment-button confirm"
                    onClick={handleConfirmBooking}
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
