import { User, AppNotification } from "../types";
import { Link, Layers, LogIn, LogOut, User as UserIcon, ShieldAlert, CheckCircle, Database, HelpCircle, Star, Bell, Sun, Moon } from "lucide-react";
import SmebhawanLogo from "./SmebhawanLogo";

interface HeaderProps {
  user: User | null;
  dbConnected: boolean;
  notifications?: AppNotification[];
  onOpenAuth: (mode: "login" | "register") => void;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onToggleNotifications: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Header({
  user,
  dbConnected,
  notifications = [],
  onOpenAuth,
  onLogout,
  activeView,
  setActiveView,
  onToggleNotifications,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return (
    <header className={`w-full flex flex-col z-40 transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-[#0b0f19] text-white border-b border-slate-900 shadow-2xl" 
        : "bg-[#FAF8F5] text-slate-800 border-b border-slate-200 shadow-sm"
    }`}>
      {/* Top B2B Announcement Strip */}
      <div className={`px-4 py-2 text-xs flex flex-wrap justify-between items-center border-b font-mono transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#060910] border-slate-900 text-slate-300"
          : "bg-[#f3ede6] border-slate-200 text-slate-600"
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>INDIA'S FIRST EXCLUSIVE B2B RAW MATERIALS PLATFORM</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">SMTP:</span>
            <span className="text-emerald-400">Active (smehouse25)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Database size={12} className="text-blue-400" />
            <span className={dbConnected ? "text-emerald-400" : "text-amber-400"}>
              {dbConnected ? "MongoDB Atlas Connected" : "Sandbox Memory Mode"}
            </span>
          </div>
          <span className="hidden sm:inline text-gray-400">•</span>
          <span className="hidden sm:inline">Buyer FAQs</span>
          <span className="hidden sm:inline">Sell on RMI</span>
          <span className="hidden sm:inline text-blue-300 font-medium">Contact Us: smehouse25@gmail.com</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl w-full mx-auto px-4 py-4 flex justify-between items-center">
        {/* Smebhawan brand logo aligned perfectly in header */}
        <button
          onClick={() => setActiveView("home")}
          className="flex items-center space-x-3 group text-left cursor-pointer focus:outline-none"
        >
          <SmebhawanLogo variant="full" size="md" lightText={theme === "dark"} />
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex space-x-6 text-xs uppercase tracking-widest font-semibold">
          <button
            onClick={() => setActiveView("home")}
            className={`py-2 transition cursor-pointer border-b-2 ${
              activeView === "home" 
                ? (theme === "dark" ? "border-amber-500 text-amber-500 font-bold" : "border-amber-700 text-amber-700 font-bold")
                : (theme === "dark" ? "border-transparent text-slate-300 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-900")
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => setActiveView("materials")}
            className={`py-2 transition cursor-pointer border-b-2 ${
              activeView === "materials" 
                ? (theme === "dark" ? "border-amber-500 text-amber-500 font-bold" : "border-amber-700 text-amber-700 font-bold")
                : (theme === "dark" ? "border-transparent text-slate-300 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-900")
            }`}
          >
            All Materials
          </button>
          
          {user && (
            <>
              {user.role === "buyer" && (
                <button
                  onClick={() => setActiveView("buyer")}
                  className={`py-2 transition cursor-pointer border-b-2 ${
                    activeView === "buyer" 
                      ? (theme === "dark" ? "border-amber-500 text-amber-500 font-bold" : "border-amber-700 text-amber-700 font-bold")
                      : (theme === "dark" ? "border-transparent text-slate-300 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-900")
                  }`}
                >
                  Procurement Console
                </button>
              )}
              {user.role === "supplier" && (
                <button
                  onClick={() => setActiveView("supplier")}
                  className={`py-2 transition cursor-pointer border-b-2 ${
                    activeView === "supplier" 
                      ? (theme === "dark" ? "border-amber-500 text-amber-500 font-bold" : "border-amber-700 text-amber-700 font-bold")
                      : (theme === "dark" ? "border-transparent text-slate-300 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-900")
                  }`}
                >
                  Supplier Analytics
                </button>
              )}
              {user.role === "admin" && (
                <button
                  onClick={() => setActiveView("admin")}
                  className={`py-2 transition cursor-pointer border-b-2 ${
                    activeView === "admin" 
                      ? "border-rose-500 text-rose-500 font-bold" 
                      : (theme === "dark" ? "border-transparent text-slate-300 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-900")
                  }`}
                >
                  Admin Control Panel
                </button>
              )}
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-colors duration-200 ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900/60 text-amber-500 hover:bg-slate-800"
                : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              {/* User Account Capsule */}
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-semibold flex items-center justify-end space-x-1">
                  <span className={theme === "dark" ? "text-white" : "text-slate-800"}>{user.companyName || "My Business"}</span>
                  {user.premiumActive && (
                    <span className="bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5" title="Premium Click Active Account">
                      <Star size={8} fill="currentColor" />
                      <span>PRO</span>
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-400 capitalize">{user.role} Account</span>
              </div>
              <button
                onClick={onToggleNotifications}
                className={`relative p-2 rounded-full border cursor-pointer flex items-center justify-center transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-slate-900 hover:bg-slate-800 text-blue-400 border-slate-800"
                    : "bg-white hover:bg-slate-50 text-blue-600 border-slate-200"
                }`}
                title="Notifications Inbox"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-blue-900 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  if (user.role === "buyer") setActiveView("buyer");
                  if (user.role === "supplier") setActiveView("supplier");
                  if (user.role === "admin") setActiveView("admin");
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-colors duration-250 ${
                  theme === "dark"
                    ? "bg-slate-900 text-blue-400 border-slate-800"
                    : "bg-white text-blue-600 border-slate-200"
                }`}
                title="Go to Dashboard"
              >
                <UserIcon size={16} />
              </button>
              <button
                onClick={onLogout}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg border transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-850"
                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth("login")}
                className={`px-4 py-2 border rounded-lg text-sm bg-transparent transition font-medium cursor-pointer ${
                  theme === "dark"
                    ? "border-blue-500 hover:bg-white/5 text-white"
                    : "border-blue-600 hover:bg-slate-50 text-blue-600"
                }`}
                id="header_login_btn"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition focus:outline-none focus:ring cursor-pointer"
                id="header_register_btn"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
