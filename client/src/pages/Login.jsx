import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, HOME } from '../context/AuthContext';
import { AuthShell, Alert, btn, input, label } from '../components/ui';
import { errMsg } from '../api';
import { stagger } from '../anim';

// Seeded by `npm run seed` in the server folder
const DEMO = [
  ['Admin', 'admin@medix.com', 'Admin@123'],
  ['Doctor', 'ahmed@medix.com', 'Doctor@123'],
  ['Patient', 'patient@medix.com', 'Patient@123'],
];

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const ref = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { stagger(ref.current?.querySelectorAll('[data-in]')); }, []);
  if (user) return <Navigate to={HOME[user.role]} replace />;

  const submit = async (e, creds) => {
    e?.preventDefault();
    const [em, pw] = creds || [email, password];
    setBusy(true); setError('');
    try { const u = await login(em, pw); nav(HOME[u.role]); }
    catch (err) { setError(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <div ref={ref}>
      <AuthShell>
        <div className="w-full max-w-sm">
          <h1 data-in className="font-serif text-4xl">Welcome back</h1>
          <p data-in className="mb-8 mt-2 text-slate">Log in to manage your appointments.</p>
          <Alert>{error}</Alert>
          <form onSubmit={submit} className="space-y-4">
            <div data-in><label className={label} htmlFor="email">Email</label>
              <input id="email" type="email" required className={input} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div data-in><label className={label} htmlFor="password">Password</label>
              <input id="password" type="password" required className={input} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button data-in className={`${btn} w-full`} disabled={busy}>{busy ? 'Logging in' : 'Log in'}</button>
          </form>
          <p data-in className="mt-6 text-sm text-slate">New to medix? <Link to="/register" className="font-medium text-sage underline underline-offset-4">Create an account</Link></p>
          <div data-in className="mt-10 border-t border-line pt-6">
            <p className="mb-3 text-sm text-slate">Quick access for testing</p>
            <div className="flex gap-2">
              {DEMO.map(([name, em, pw]) => (
                <button key={name} type="button" disabled={busy} onClick={() => submit(null, [em, pw])}
                  className="flex-1 rounded-lg border border-line bg-porcelain py-2 text-sm transition hover:border-sage disabled:opacity-50">{name}</button>
              ))}
            </div>
          </div>
        </div>
      </AuthShell>
    </div>
  );
}
