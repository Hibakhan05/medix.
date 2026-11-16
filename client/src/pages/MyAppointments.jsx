import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { PageHeader, Pill, Alert, Empty, Loading, panel, th, td, btnGhost, fmtDate } from '../components/ui';

export default function MyAppointments() {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/appointments/my').then((r) => setList(r.data)); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setError('');
    try {
      await api.patch(`/appointments/${id}/cancel`);
      setList((l) => l.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a)));
    } catch (e) { setError(errMsg(e)); }
  };

  return (
    <>
      <PageHeader title="My appointments" sub="Track every request and its current status." />
      <Alert>{error}</Alert>
      <div className={`${panel} overflow-x-auto`}>
        {!list ? <Loading /> : list.length === 0 ? <Empty>You have not booked any appointments yet.</Empty> : (
          <table className="w-full min-w-[720px]">
            <thead><tr><th className={th}>Doctor</th><th className={th}>Date</th><th className={th}>Time</th><th className={th}>Reason</th><th className={th}>Status</th><th className={th}></th></tr></thead>
            <tbody>
              {list.map((a) => (
                <tr key={a._id} className="border-t border-line">
                  <td className={td}><div className="font-medium">{a.doctor?.name || 'Removed doctor'}</div><div className="text-xs text-slate">{a.doctor?.specialization}</div></td>
                  <td className={td}>{fmtDate(a.appointmentDate)}</td>
                  <td className={td}>{a.appointmentTime}</td>
                  <td className={`${td} max-w-[220px] truncate text-slate`}>{a.reason}</td>
                  <td className={td}><Pill status={a.status} /></td>
                  <td className={`${td} text-right`}>{a.status === 'pending' && <button className={btnGhost} onClick={() => cancel(a._id)}>Cancel</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
