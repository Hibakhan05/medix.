import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Stats, Loading, Empty, panel, btn, fmtDate, greeting } from '../components/ui';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [list, setList] = useState(null);
  useEffect(() => { api.get('/appointments/doctor').then((r) => setList(r.data)); }, []);
  if (!list) return <Loading />;

  const count = (s) => list.filter((a) => a.status === s).length;
  const pending = list.filter((a) => a.status === 'pending').slice(0, 5);

  return (
    <>
      <PageHeader title={`${greeting()}, ${user.name}`} sub={`${user.specialization}, ${user.experience} ${user.experience === 1 ? 'year' : 'years'} of experience`}
        action={<Link to="/doctor/requests" className={btn}>View requests</Link>} />
      <Stats items={[[list.length, 'Total appointments'], [count('pending'), 'Pending'], [count('approved'), 'Approved']]} />
      <h2 className="mb-3 font-serif text-2xl">Awaiting your decision</h2>
      <div className={panel}>
        {pending.length === 0 ? <Empty>You are all caught up. New requests will appear here.</Empty> :
          pending.map((a, i) => (
            <div key={a._id} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${i ? 'border-t border-line' : ''}`}>
              <div><div className="font-medium">{a.patient?.name}</div><div className="text-sm text-slate">{a.reason}</div></div>
              <div className="text-sm text-slate">{fmtDate(a.appointmentDate)} at {a.appointmentTime}</div>
            </div>
          ))}
      </div>
    </>
  );
}
