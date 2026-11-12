import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronsLeft,
  History,
  LayoutDashboard,
  Menu,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/briefs", label: "Previous Briefs", icon: History },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Layout() {
  const { settings, updateSettings, newMeeting, toast } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const collapsed = settings.compactSidebar;

  useEffect(() => {
    document.body.classList.toggle("collapsed", collapsed);
    document.body.classList.toggle("no-anim", !settings.animations);
    document.body.classList.toggle("drawer", drawer);
  }, [collapsed, settings.animations, drawer]);
  useEffect(() => setDrawer(false), [pathname]);

  const title = NAV.find((n) => n.to === pathname)?.label ?? "Home";

  return (
    <>
      <div className="bg" aria-hidden="true" />
      <div className="backdrop" onClick={() => setDrawer(false)} />
      <aside className="sidebar glass" aria-label="Main navigation">
        <div className="brand">
          <span className="logo">
            <Sparkles />
          </span>
          <span className="lbl">BriefAI</span>
        </div>
        <nav>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className="nav-item" data-tip={label}>
              <Icon />
              <span className="lbl">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="profile">
            <span className="avatar">RS</span>
            <span className="lbl">
              <b>Raul</b>
              <small>Demo workspace</small>
            </span>
          </div>
          <button
            className="icon-btn collapse"
            aria-label="Toggle sidebar"
            aria-expanded={!collapsed}
            onClick={() => updateSettings({ compactSidebar: !collapsed })}
          >
            <ChevronsLeft />
          </button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar glass">
          <button
            className="icon-btn menu"
            aria-label="Open navigation"
            onClick={() => setDrawer(true)}
          >
            <Menu />
          </button>
          <h1>{title}</h1>
          <div className="actions">
            <button className="btn primary" onClick={newMeeting}>
              <Plus />
              <span>New Meeting</span>
            </button>
            <button
              className="icon-btn"
              id="bell"
              aria-label="Notifications"
              onClick={() => toast("You are all caught up")}
            >
              <Bell />
            </button>
            <button
              className="avatar btn-avatar"
              aria-label="Open profile settings"
              onClick={() => navigate("/settings")}
            >
              RS
            </button>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
