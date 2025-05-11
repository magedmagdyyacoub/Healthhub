import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminPanel from './pages/AdminPanel';
import Users from './pages/Users';
import Doctors from './pages/Doctors';
import Specialties from './pages/Specialties';
import DoctorSpecialties from './pages/DoctorSpecialties';
import SpecialtyPage from './pages/SpecialtyPage';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import BookAppointment from './pages/BookAppointment';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/specialty/:id" element={<SpecialtyPage />} />

      {/* Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/book/:doctorId"
        element={
          <ProtectedRoute role="patient">
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/confirmation"
        element={
          <ProtectedRoute role="patient">
            <AppointmentConfirmation />
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute role="admin">
            <Doctors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/specialties"
        element={
          <ProtectedRoute role="admin">
            <Specialties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctor-specialties"
        element={
          <ProtectedRoute role="admin">
            <DoctorSpecialties />
          </ProtectedRoute>
        }
      />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
