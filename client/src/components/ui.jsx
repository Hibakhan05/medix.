import { useEffect } from 'react';
import { X } from 'lucide-react';

export const btn = 'inline-flex items-center justify-center gap-2 rounded-lg bg-sage px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#223a30] disabled:cursor-not-allowed disabled:opacity-50';
export const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-porcelain px-3.5 py-2 text-sm font-medium text-ink transition hover:border-sage disabled:opacity-50';
export const btnText = 'text-sm font-medium transition hover:underline underline-offset-4';
export const input = 'w-full rounded-lg border border-line bg-porcelain px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate/60 focus:border-sage';
export const label = 'mb-1.5 block text-sm text-slate';
export const panel = 'rounded-xl border border-line bg-porcelain';
export const th = 'px-5 py-3 text-left text-xs font-medium text-slate whitespace-nowrap';
export const td = 'px-5 py-4 text-sm align-middle';

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

const PILL = {
  pending: 'bg-[#FBF3E2] text-[#8A5A12] border-[#EFDDB5]',
  approved: 'bg-[#E8F0EB] text-[#2C4A3E] border-[#CADBD0]',
  rejected: 'bg-[#F7E8E9] text-[#8B2E3C] border-[#EBCDD0]',
  cancelled: 'bg-[#F1EDEE] text-[#7A5258] border-[#E2D6D8]',
};
export function Pill({ status, label }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${PILL[status]}`}>
      {label || status}
    </span>
  );
}

export function PageHeader({ title, sub, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
        {sub && <p className="mt-2 max-w-xl text-slate">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// One container, hairline dividers between figures, so it never reads as a grid of cards
export function Stats({ items }) {
  return (
    <div className={`${panel} mb-8 flex flex-col sm:flex-row`}>
      {items.map(([value, name]) => (
        <div key={name} className="flex-1 border-b border-line p-6 last:border-0 sm:border-b-0 sm:border-r">
          <div className="font-serif text-4xl">{value}</div>
          <div className="mt-1 text-sm text-slate">{name}</div>
        </div>
      ))}
    </div>
  );
}

export const Loading = () => <p className="py-10 text-slate">Loading</p>;
export const Empty = ({ children }) => <p className="px-5 py-10 text-center text-sm text-slate">{children}</p>;
export const Alert = ({ children }) =>
  children ? <p className="mb-4 rounded-lg border border-[#EBCDD0] bg-[#F7E8E9] px-3.5 py-2.5 text-sm text-[#8B2E3C]">{children}</p> : null;

export function Tabs({ value, onChange, options }) {
  return (
    <div className="mb-5 flex gap-1 overflow-x-auto border-b border-line">
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)}
          className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm transition ${value === v ? 'border-sage text-sage' : 'border-transparent text-slate hover:text-ink'}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${panel} max-h-[90vh] w-full max-w-md overflow-y-auto p-6`} role="dialog" aria-modal="true">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-serif text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate hover:text-ink"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AuthShell({ children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sage p-12 text-white md:flex">
        <div data-in className="text-2xl font-semibold tracking-tight">medix<span className="opacity-60">.</span></div>
        <div data-in>
          <h2 className="max-w-sm font-serif text-5xl leading-[1.1]">Precision clinic scheduling, simplified.</h2>
          <p className="mt-6 max-w-sm text-white/70">Book, approve and oversee every appointment from one calm, organised workspace.</p>
        </div>
        <p data-in className="text-sm text-white/50">Patients, doctors and administrators, each with their own dashboard.</p>
      </div>
      <div className="flex items-center justify-center px-6 py-12">{children}</div>
    </div>
  );
}
