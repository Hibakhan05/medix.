import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Stats, Loading, Empty, Pill, panel, btn, fmtDate, greeting } from '../components/ui';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/appointments/my').then((r) => setList(r.data)); }, []);
  if (!list) return <Loading />;

  const count = (s) => list.filter((a) => a.status === s).length;
  const today = new Date().toLocaleDateString('en-CA');
  const upcoming = list
    .filter((a) => ['pending', 'approved'].includes(a.status) && a.appointmentDate.slice(0, 10) >= today)
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate) || a.appointmentTime.localeCompare(b.appointmentTime))
    .slice(0, 4);

  return (
    <>
      <PageHeader title={`${greeting()}, ${user.name.split(' ')[0]}`} sub="Here is where your appointments stand today."
        action={<Link to="/patient/book" className={btn}>Book appointment</Link>} />
      <Stats items={[[list.length, 'Total appointments'], [count('pending'), 'Awaiting approval'], [count('approved'), 'Approved']]} />
      <h2 className="mb-3 font-serif text-2xl">Upcoming</h2>
      <div className={panel}>
        {upcoming.length === 0 ? <Empty>No upcoming appointments. Find a doctor and book your first visit.</Empty> :
          upcoming.map((a, i) => (
            <div key={a._id} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${i ? 'border-t border-line' : ''}`}>
              <div>
                <div className="font-medium">{a.doctor?.name}</div>
                <div className="text-sm text-slate">{a.doctor?.specialization}</div>
              </div>
              <div className="text-sm text-slate">{fmtDate(a.appointmentDate)} at {a.appointmentTime}</div>
              <Pill status={a.status} />
            </div>
          ))}
      </div>
    </>
  );
}
