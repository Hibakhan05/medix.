import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { PageHeader, Pill, Alert, Empty, Loading, Modal, Tabs, panel, th, td, btn, btnGhost, input, label } from '../components/ui';

const BLANK = { name: '', email: '', password: '', specialization: '', experience: '' };

export default function ManageUsers() {
  const [users, setUsers] = useState(null);
  const [tab, setTab] = useState('all');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = () => api.get('/admin/users').then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addDoctor = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { await api.post('/admin/doctors', form); setAdding(false); setForm(BLANK); load(); }
    catch (err) { setError(errMsg(err)); }
    finally { setBusy(false); }
  };
  const toggle = async (u) => {
    try { const r = await api.patch(`/admin/users/${u._id}/toggle-status`); setUsers((l) => l.map((x) => (x._id === u._id ? r.data : x))); }
    catch (err) { alert(errMsg(err)); }
  };
  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}? Their appointments will also be removed.`)) return;
    try { await api.delete(`/admin/users/${u._id}`); setUsers((l) => l.filter((x) => x._id !== u._id)); }
    catch (err) { alert(errMsg(err)); }
  };

  const shown = users ? users.filter((u) => tab === 'all' || u.role === tab) : [];
  return (
    <>
      <PageHeader title="Manage users" sub="Add doctors, activate or deactivate accounts, and remove users."
        action={<button className={btn} onClick={() => { setAdding(true); setError(''); }}>Add doctor</button>} />
      <Tabs value={tab} onChange={setTab} options={[['all', 'All'], ['doctor', 'Doctors'], ['patient', 'Patients'], ['admin', 'Admins']]} />
      <div className={`${panel} overflow-x-auto`}>
        {!users ? <Loading /> : shown.length === 0 ? <Empty>No users in this view.</Empty> : (
          <table className="w-full min-w-[800px]">
            <thead><tr><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Role</th><th className={th}>Specialization</th><th className={th}>Status</th><th className={th}></th></tr></thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u._id} className="border-t border-line">
                  <td className={`${td} font-medium`}>{u.name}</td>
                  <td className={`${td} text-slate`}>{u.email}</td>
                  <td className={`${td} capitalize`}>{u.role}</td>
                  <td className={`${td} text-slate`}>{u.specialization ? `${u.specialization}, ${u.experience} yrs` : 'None'}</td>
                  <td className={td}><Pill status={u.isActive ? 'approved' : 'rejected'} label={u.isActive ? 'Active' : 'Deactivated'} /></td>
                  <td className={td}>
                    {u.role !== 'admin' && (
                      <div className="flex justify-end gap-2">
                        <button className={btnGhost} onClick={() => toggle(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button className={`${btnGhost} hover:border-[#8B2E3C] hover:text-[#8B2E3C]`} onClick={() => remove(u)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {adding && (
        <Modal title="Add a doctor" onClose={() => setAdding(false)}>
          <Alert>{error}</Alert>
          <form onSubmit={addDoctor} className="space-y-4">
            <div><label className={label} htmlFor="dn">Full name</label><input id="dn" required className={input} placeholder="Dr. Ahmed" value={form.name} onChange={set('name')} /></div>
            <div><label className={label} htmlFor="de">Email</label><input id="de" type="email" required className={input} value={form.email} onChange={set('email')} /></div>
            <div><label className={label} htmlFor="dp">Temporary password</label><input id="dp" type="password" required minLength={6} className={input} value={form.password} onChange={set('password')} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label} htmlFor="ds">Specialization</label><input id="ds" required className={input} placeholder="Cardiologist" value={form.specialization} onChange={set('specialization')} /></div>
              <div><label className={label} htmlFor="dx">Experience (years)</label><input id="dx" type="number" min="0" required className={input} value={form.experience} onChange={set('experience')} /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={btnGhost} onClick={() => setAdding(false)}>Cancel</button>
              <button className={btn} disabled={busy}>{busy ? 'Adding' : 'Add doctor'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
