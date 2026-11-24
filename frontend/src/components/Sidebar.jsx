import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, DoorOpen, Users, Receipt, Wallet,
  Wrench, Megaphone, UserRound, LogOut, Building2, X,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const both = ["landlord", "tenant"];

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: both },
  { to: "/rooms", label: "Rooms", icon: DoorOpen, roles: ["landlord"] },
  { to: "/tenants", label: "Tenants", icon: Users, roles: ["landlord"] },
  { to: "/bills", label: "Bills", icon: Receipt, roles: both },
  { to: "/payments", label: "Payments", icon: Wallet, roles: both },
  { to: "/maintenance", label: "Maintenance", icon: Wrench, roles: both },
  { to: "/announcements", label: "Announcements", icon: Megaphone, roles: both },
  { to: "/profile", label: "Profile", icon: UserRound, roles: both },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-900 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Building2 size={24} /> BoardBuddy
          </div>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links
            .filter((link) => link.roles.includes(user.role))
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-brand-600 text-white" : "text-brand-100 hover:bg-brand-800"
                  }`
                }
              >
                <Icon size={19} /> {label}
              </NavLink>
            ))}
        </nav>

        <button
          onClick={logout}
          className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-100 hover:bg-brand-800"
        >
          <LogOut size={19} /> Log out
        </button>
      </aside>
    </>
  );
}
