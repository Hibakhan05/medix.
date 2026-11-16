import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { PageHeader, Pill, Alert, Empty, Loading, Tabs, panel, th, td, btn, btnGhost, fmtDate } from '../components/ui';

export default function Requests() {
  const [list, setList] = useState(null);
  const [tab, setTab] = useState('pending');
  const [error, setError] = useState('');
  useEffect(() => { api.get('/appointments/doctor').then((r) => setList(r.data)); }, []);

  const decide = async (id, status) => {
    setError('');
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setList((l) => l.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (e) { setError(errMsg(e)); }
  };

  const shown = list ? list.filter((a) => tab === 'all' || a.status === tab) : [];
  return (
    <>
      <PageHeader title="Appointment requests" sub="Review patient details and approve or reject each request." />
      <Tabs value={tab} onChange={setTab} options={[['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']]} />
      <Alert>{error}</Alert>
      <div className={`${panel} overflow-x-auto`}>
        {!list ? <Loading /> : shown.length === 0 ? <Empty>No {tab === 'all' ? '' : tab} requests to show.</Empty> : (
          <table className="w-full min-w-[760px]">
            <thead><tr><th className={th}>Patient</th><th className={th}>Date</th><th className={th}>Time</th><th className={th}>Reason</th><th className={th}>Status</th><th className={th}></th></tr></thead>
            <tbody>
              {shown.map((a) => (
                <tr key={a._id} className="border-t border-line">
                  <td className={td}><div className="font-medium">{a.patient?.name}</div><div className="text-xs text-slate">{a.patient?.email}</div></td>
                  <td className={td}>{fmtDate(a.appointmentDate)}</td>
                  <td className={td}>{a.appointmentTime}</td>
                  <td className={`${td} max-w-[220px] text-slate`}>{a.reason}</td>
                  <td className={td}><Pill status={a.status} /></td>
                  <td className={`${td} text-right`}>
                    {a.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button className={btnGhost} onClick={() => decide(a._id, 'rejected')}>Reject</button>
                        <button className={btn} onClick={() => decide(a._id, 'approved')}>Approve</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
