import { Menu } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Navbar({ onMenu }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <button className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu size={24} />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold">{user.full_name}</p>
          <p className="text-xs capitalize text-gray-500">{user.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
          {user.full_name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
