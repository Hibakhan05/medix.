import { useEffect, useState } from 'react';
import api from '../api';
import { PageHeader, Pill, Empty, Loading, panel, th, td, input, fmtDate } from '../components/ui';

export default function AllAppointments() {
  const [list, setList] = useState(null);
  const [q, setQ] = useState('');
  useEffect(() => { api.get('/admin/appointments').then((r) => setList(r.data)); }, []);

  const s = q.trim().toLowerCase();
  const shown = list ? list.filter((a) => !s || a.patient?.name.toLowerCase().includes(s) || a.doctor?.name.toLowerCase().includes(s)) : [];

  return (
    <>
      <PageHeader title="All appointments" sub="Every booking across all doctors and patients." />
      <input className={`${input} mb-5 max-w-md`} placeholder="Search by patient or doctor name" aria-label="Search appointments" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className={`${panel} overflow-x-auto`}>
        {!list ? <Loading /> : shown.length === 0 ? <Empty>No appointments found.</Empty> : (
          <table className="w-full min-w-[760px]">
            <thead><tr><th className={th}>Patient</th><th className={th}>Doctor</th><th className={th}>Date</th><th className={th}>Time</th><th className={th}>Reason</th><th className={th}>Status</th></tr></thead>
            <tbody>
              {shown.map((a) => (
                <tr key={a._id} className="border-t border-line">
                  <td className={td}><div className="font-medium">{a.patient?.name || 'Removed user'}</div><div className="text-xs text-slate">{a.patient?.email}</div></td>
                  <td className={td}><div className="font-medium">{a.doctor?.name || 'Removed user'}</div><div className="text-xs text-slate">{a.doctor?.specialization}</div></td>
                  <td className={td}>{fmtDate(a.appointmentDate)}</td>
                  <td className={td}>{a.appointmentTime}</td>
                  <td className={`${td} max-w-[200px] truncate text-slate`}>{a.reason}</td>
                  <td className={td}><Pill status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
