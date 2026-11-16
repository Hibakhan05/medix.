import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, HOME } from '../context/AuthContext';
import { AuthShell, Alert, btn, input, label } from '../components/ui';
import { errMsg } from '../api';
import { stagger } from '../anim';

export default function Register() {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const ref = useRef(null);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { stagger(ref.current?.querySelectorAll('[data-in]')); }, []);
  if (user) return <Navigate to={HOME[user.role]} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { const u = await register(f.name, f.email, f.password); nav(HOME[u.role]); }
    catch (err) { setError(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <div ref={ref}>
      <AuthShell>
        <div className="w-full max-w-sm">
          <h1 data-in className="font-serif text-4xl">Create your account</h1>
          <p data-in className="mb-8 mt-2 text-slate">Register as a patient to book appointments.</p>
          <Alert>{error}</Alert>
          <form onSubmit={submit} className="space-y-4">
            <div data-in><label className={label} htmlFor="name">Full name</label>
              <input id="name" required className={input} value={f.name} onChange={set('name')} /></div>
            <div data-in><label className={label} htmlFor="email">Email</label>
              <input id="email" type="email" required className={input} value={f.email} onChange={set('email')} /></div>
            <div data-in><label className={label} htmlFor="password">Password</label>
              <input id="password" type="password" required minLength={6} className={input} value={f.password} onChange={set('password')} />
              <p className="mt-1.5 text-xs text-slate">At least 6 characters</p></div>
            <button data-in className={`${btn} w-full`} disabled={busy}>{busy ? 'Creating account' : 'Create account'}</button>
          </form>
          <p data-in className="mt-6 text-sm text-slate">Already registered? <Link to="/login" className="font-medium text-sage underline underline-offset-4">Log in</Link></p>
        </div>
      </AuthShell>
    </div>
  );
}
