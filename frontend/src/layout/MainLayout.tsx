import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { Sun, Moon, User, Search, Settings } from "lucide-react";

function MainLayout() {
  const { setToken, toggleTheme, theme } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const logout = () => {
    setToken(null);
    navigate("/");
  };

  const goProfile = () => {
    navigate("/profile");
    setOpen(false);
  };

  const goSettings = () => {
    navigate("/settings");
    setOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#020617] via-[#07122b] to-[#020617] text-white">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex flex-col flex-1">

        {/* NAVBAR */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-xl bg-black/30">

          {/* LEFT */}
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold tracking-wide">
              AI Risk Command Center
            </h2>

            {/* AI STATUS */}
            <div className="flex items-center gap-2 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              AI Engine Active
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-72 hover:border-purple-500/30 transition">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Search applicants, logs..."
              className="bg-transparent outline-none text-sm w-full text-gray-300 placeholder-gray-500"
            />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* THEME */}
            <button
              aria-label="Toggle Theme"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-purple-600/30 transition"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* PROFILE */}
            <div className="relative">
              <button
                aria-label="Open Profile Menu"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 hover:scale-105 transition shadow-lg shadow-purple-500/30"
              >
                <User size={18} />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0b1220] border border-white/10 rounded-xl shadow-2xl p-3 backdrop-blur-xl">

                  <div className="px-3 pb-3 border-b border-white/10">
                    <p className="text-sm font-semibold">
                      CreditAI User
                    </p>
                    <p className="text-xs text-gray-400">
                      user@creditai.ai
                    </p>
                  </div>

                  {/* PROFILE */}
                  <button
                    onClick={goProfile}
                    className="flex items-center gap-2 w-full px-3 py-2 mt-2 rounded-lg hover:bg-white/5 transition text-sm"
                  >
                    <User size={16} />
                    Profile
                  </button>

                  {/* SETTINGS */}
                  <button
                    onClick={goSettings}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm"
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  {/* LOGOUT */}
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 mt-2 rounded-lg hover:bg-red-500/20 text-red-400 transition text-sm"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default MainLayout;