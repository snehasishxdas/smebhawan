import { User, AppNotification } from "../types";
import { Link, Layers, LogIn, LogOut, User as UserIcon, ShieldAlert, CheckCircle, Database, HelpCircle, Star, Bell } from "lucide-react";
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
}: HeaderProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return (
    <header className="w-full flex flex-col z-40 bg-[#0b0f19] text-white border-b border-slate-900 shadow-2xl">
      {/* Top B2B Announcement Strip */}
      <div className="bg-[#060910] px-4 py-2 text-xs flex flex-wrap justify-between items-center border-b border-slate-900 font-mono">
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
          <SmebhawanLogo variant="full" size="md" lightText={true} />
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex space-x-6 text-xs uppercase tracking-widest font-semibold">
          <button
            onClick={() => setActiveView("home")}
            className={`py-2 transition cursor-pointer border-b-2 ${
              activeView === "home" 
                ? "border-amber-500 text-amber-500 font-bold" 
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => setActiveView("materials")}
            className={`py-2 transition cursor-pointer border-b-2 ${
              activeView === "materials" 
                ? "border-amber-500 text-amber-500 font-bold" 
                : "border-transparent text-slate-300 hover:text-white"
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
                      ? "border-amber-500 text-amber-500 font-bold" 
                      : "border-transparent text-slate-300 hover:text-white"
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
                      ? "border-amber-500 text-amber-500 font-bold" 
                      : "border-transparent text-slate-300 hover:text-white"
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
                      ? "border-rose-500 text-rose-400 font-bold" 
                      : "border-transparent text-slate-300 hover:text-white"
                  }`}
                >
                  Admin Control Panel
                </button>
              )}
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* User Account Capsule */}
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-semibold flex items-center justify-end space-x-1">
                  <span>{user.companyName || "My Business"}</span>
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
                className="relative p-2 bg-blue-800 hover:bg-blue-700 text-blue-100 rounded-full border border-blue-600 cursor-pointer flex items-center justify-center transition"
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
                className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center text-blue-200 border border-blue-600 cursor-pointer"
                title="Go to Dashboard"
              >
                <UserIcon size={16} />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-sm bg-gray-800 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 transition cursor-pointer"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth("login")}
                className="px-4 py-2 border border-blue-500 rounded-lg text-sm bg-transparent hover:bg-white/5 text-white transition focus:outline-none focus:ring font-medium cursor-pointer"
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
