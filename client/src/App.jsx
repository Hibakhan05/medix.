import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, HOME } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import Requests from './pages/Requests';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import AllAppointments from './pages/AllAppointments';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? HOME[user.role] : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute roles={['patient']} />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/book" element={<BookAppointment />} />
            <Route path="/patient/appointments" element={<MyAppointments />} />
          </Route>
          <Route element={<ProtectedRoute roles={['doctor']} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/requests" element={<Requests />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/appointments" element={<AllAppointments />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
