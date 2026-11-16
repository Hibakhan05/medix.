import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, CalendarCheck, ClipboardList, Users, LogOut, PanelLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reveal } from '../anim';

const NAV = {
  patient: [['/patient', 'Dashboard', LayoutDashboard], ['/patient/book', 'Book appointment', CalendarPlus], ['/patient/appointments', 'My appointments', CalendarCheck]],
  doctor: [['/doctor', 'Dashboard', LayoutDashboard], ['/doctor/requests', 'Appointment requests', ClipboardList]],
  admin: [['/admin', 'Dashboard', LayoutDashboard], ['/admin/users', 'Manage users', Users], ['/admin/appointments', 'All appointments', CalendarCheck]],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => { reveal(ref.current); }, [pathname]);

  return (
    <div className="flex min-h-screen">
      <aside className={`${collapsed ? 'w-[72px]' : 'w-64'} sticky top-0 flex h-screen shrink-0 flex-col border-r border-line bg-porcelain transition-[width] duration-300`}>
        <div className="flex h-16 items-center justify-between px-5">
          <span className="text-xl font-semibold tracking-tight">{collapsed ? 'm' : 'medix'}<span className="text-sage">.</span></span>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" className="text-slate hover:text-ink"><PanelLeft size={18} /></button>
          )}
        </div>
        {collapsed && (
          <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar" className="mx-auto mb-2 text-slate hover:text-ink"><PanelLeft size={18} /></button>
        )}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV[user.role].map(([to, text, Icon]) => (
            <NavLink key={to} to={to} end title={text}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm transition ${isActive ? 'border-sage bg-canvas font-medium text-sage' : 'border-transparent text-slate hover:text-ink'}`}>
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{text}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          {!collapsed && (
            <div className="mb-3 px-1">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="text-xs capitalize text-slate">{user.role}</div>
            </div>
          )}
          <button onClick={logout} title="Log out" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate transition hover:text-ink">
            <LogOut size={18} className="shrink-0" />{!collapsed && 'Log out'}
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <div ref={ref} className="mx-auto max-w-5xl"><Outlet /></div>
      </main>
    </div>
  );
}
