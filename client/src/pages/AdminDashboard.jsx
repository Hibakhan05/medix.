import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { PageHeader, Stats, Loading, btn, btnGhost } from '../components/ui';

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/admin/stats').then((r) => setS(r.data)); }, []);
  if (!s) return <Loading />;
  return (
    <>
      <PageHeader title="Clinic overview" sub="A live summary of everyone and everything in the system." />
      <Stats items={[[s.patients, 'Registered patients'], [s.doctors, 'Doctors'], [s.appointments, 'Appointments'], [s.pending, 'Pending requests']]} />
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/users" className={btn}>Manage users</Link>
        <Link to="/admin/appointments" className={btnGhost}>View all appointments</Link>
      </div>
    </>
  );
}
