import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { PageHeader, Modal, Alert, Empty, Loading, panel, btn, btnGhost, input, label } from '../components/ui';

const SLOTS = [];
for (let h = 9; h < 17; h++) for (const m of ['00', '30']) SLOTS.push(`${String(h).padStart(2, '0')}:${m}`);

export default function BookAppointment() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [doctors, setDoctors] = useState(null);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', reason: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const t = setTimeout(() => api.get('/doctors', { params: { search: q } }).then((r) => setDoctors(r.data)), 250);
    return () => clearTimeout(t);
  }, [q]);

  const open = (d) => { setSel(d); setForm({ date: '', time: '', reason: '' }); setError(''); };
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await api.post('/appointments', { doctor: sel._id, appointmentDate: form.date, appointmentTime: form.time, reason: form.reason });
      nav('/patient/appointments');
    } catch (err) { setError(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="Book an appointment" sub="Search by name or specialization, then choose a date and time." />
      <input className={`${input} mb-5 max-w-md`} placeholder="Search doctors" aria-label="Search doctors" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className={panel}>
        {!doctors ? <Loading /> : doctors.length === 0 ? <Empty>No doctors match that search. Try a specialization such as Cardiologist.</Empty> :
          doctors.map((d, i) => (
            <div key={d._id} className={`flex flex-wrap items-center justify-between gap-4 px-5 py-5 ${i ? 'border-t border-line' : ''}`}>
              <div>
                <div className="font-serif text-xl">{d.name}</div>
                <div className="mt-0.5 text-sm text-slate">{d.specialization}, {d.experience} {d.experience === 1 ? 'year' : 'years'} of experience</div>
              </div>
              <button className={btn} onClick={() => open(d)}>Book appointment</button>
            </div>
          ))}
      </div>

      {sel && (
        <Modal title={`Book with ${sel.name}`} onClose={() => setSel(null)}>
          <p className="-mt-3 mb-5 text-sm text-slate">{sel.specialization}</p>
          <Alert>{error}</Alert>
          <form onSubmit={submit} className="space-y-4">
            <div><label className={label} htmlFor="date">Date</label>
              <input id="date" type="date" required min={today} className={input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><label className={label} htmlFor="time">Time</label>
              <select id="time" required className={input} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                <option value="">Select a time</option>
                {SLOTS.map((s) => <option key={s}>{s}</option>)}
              </select></div>
            <div><label className={label} htmlFor="reason">Reason for visit</label>
              <textarea id="reason" required rows={3} className={input} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={btnGhost} onClick={() => setSel(null)}>Cancel</button>
              <button className={btn} disabled={busy}>{busy ? 'Booking' : 'Confirm booking'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
