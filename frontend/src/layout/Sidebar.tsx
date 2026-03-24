import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  Brain,
  FileText,
  BarChart3,
  ShieldCheck,
  LogOut,
  Menu,
} from "lucide-react";

function Sidebar() {

  const { setToken, user } = useAuth(); // ✅ user added
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    setToken(null);
  };

  const navItem =
    "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  return (
    <aside
      className={`h-screen flex flex-col backdrop-blur-xl border-r border-white/10
      bg-gradient-to-b from-[#020617] via-[#030c1f] to-[#020617]
      shadow-[10px_0_40px_rgba(0,0,0,0.6)]
      transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* HEADER */}

      <div className="flex items-center justify-between px-5 py-5">

        {!collapsed && (
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
              AI
            </div>

            <span className="text-lg font-semibold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CreditAI
            </span>

          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition"
        >
          <Menu size={22} />
        </button>

      </div>

      {/* NAVIGATION */}

      <nav className="flex flex-col gap-2 px-3 mt-2">

        {/* DASHBOARD */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 h-8 w-[3px] bg-purple-500 rounded-r-full"></div>
              )}
              <LayoutDashboard size={20} />
              {!collapsed && <span>Dashboard</span>}
            </>
          )}
        </NavLink>

        {/* ASSESSMENT */}
        <NavLink
          to="/assessment"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 h-8 w-[3px] bg-purple-500 rounded-r-full"></div>
              )}
              <Brain size={20} />
              {!collapsed && <span>Loan Assessment</span>}
            </>
          )}
        </NavLink>

        {/* APPLICATIONS */}
        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute left-0 h-8 w-[3px] bg-purple-500 rounded-r-full"></div>
              )}
              <FileText size={20} />
              {!collapsed && <span>Applications</span>}
            </>
          )}
        </NavLink>

        {/* 🔐 ADMIN ONLY - ANALYTICS */}
        {user?.role === "admin" && (
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 h-8 w-[3px] bg-purple-500 rounded-r-full"></div>
                )}
                <BarChart3 size={20} />
                {!collapsed && <span>Risk Analytics</span>}
              </>
            )}
          </NavLink>
        )}

        {/* 🔐 ADMIN ONLY - AUDIT */}
        {user?.role === "admin" && (
          <NavLink
            to="/audit"
            className={({ isActive }) =>
              `${navItem} ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 h-8 w-[3px] bg-purple-500 rounded-r-full"></div>
                )}
                <ShieldCheck size={20} />
                {!collapsed && <span>Audit Logs</span>}
              </>
            )}
          </NavLink>
        )}

      </nav>

      {/* SYSTEM STATUS */}

      {!collapsed && (
        <div className="mx-4 mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/10 text-sm">

          <div className="flex items-center gap-2 text-green-400 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Backend Connected
          </div>

          <p className="text-xs text-gray-400">
            AI risk engine active
          </p>

        </div>
      )}

      {/* LOGOUT */}

      <div className="mt-auto p-4">

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
          bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
          transition text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;