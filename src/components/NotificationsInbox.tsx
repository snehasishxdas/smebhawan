import React, { useState } from "react";
import { AppNotification } from "../types";
import { 
  Bell, Inbox, Filter, Check, CheckCircle2, AlertTriangle, 
  Clock, Sparkles, RefreshCw, Layers 
} from "lucide-react";

interface NotificationsInboxProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => Promise<void>;
  loading?: boolean;
  onClose?: () => void;
}

export default function NotificationsInbox({
  notifications,
  onMarkRead,
  loading = false,
  onClose,
}: NotificationsInboxProps) {
  const [filterType, setFilterType] = useState<"All" | "Action Required" | "Status Update" | "System Alert">("All");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filterType === "All") return true;
    return n.alertType === filterType;
  });

  const handleMarkAllRead = async () => {
    await onMarkRead("all");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 transition flex items-center space-x-1.5 cursor-pointer pb-2"
        >
          <span>← Back to Sourcing Workspace</span>
        </button>
      )}
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 to-slate-900">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">Operational Logs</span>
          <h2 className="text-2xl font-display font-semibold flex items-center space-x-2">
            <Inbox className="text-blue-500" size={24} />
            <span>Dedicated Notifications Inbox</span>
          </h2>
          <p className="text-xs text-gray-400">
            Monitor real-time system alerts, critical action items, and transactional updates across smebhawan.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5"
            >
              <CheckCircle2 size={13} />
              <span>Mark All as Read</span>
            </button>
          )}
          <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-blue-400 font-mono font-bold">
            {unreadCount} Unread
          </div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-gray-150 shadow-xs">
        <span className="text-xs text-slate-500 font-medium px-2 flex items-center space-x-1">
          <Filter size={13} />
          <span>Filter alert classifications:</span>
        </span>
        {(["All", "Action Required", "Status Update", "System Alert"] as const).map(type => {
          const count = type === "All" 
            ? notifications.length 
            : notifications.filter(n => n.alertType === type).length;
          
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                filterType === type 
                  ? "bg-slate-800 text-white shadow-xs" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-150"
              }`}
            >
              <span>{type}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                filterType === type ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="animate-spin text-blue-600" size={24} />
            <span className="text-xs text-gray-500 font-mono">Synchronizing alerts stream...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center bg-white border border-gray-150 rounded-2xl flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
              <Bell size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800">No alerts found</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No notifications matching the category <strong>{filterType}</strong> have been logged. Incoming milestones appear here instantly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredNotifications.map(notif => {
              const borderCol = notif.alertType === "Action Required" 
                ? "border-l-rose-500 bg-rose-50/20" 
                : notif.alertType === "Status Update" 
                  ? "border-l-emerald-500 bg-emerald-50/20" 
                  : "border-l-blue-500 bg-blue-50/20";
              
              const badgeCol = notif.alertType === "Action Required"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : notif.alertType === "Status Update"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                  : "bg-blue-50 text-blue-700 border border-blue-200";

              return (
                <div 
                  key={notif._id || notif.id}
                  className={`bg-white rounded-xl border border-gray-150 border-l-4 p-4.5 shadow-xs hover:shadow-md transition-all flex justify-between items-start gap-4 ${borderCol} ${
                    notif.isRead ? "opacity-75" : ""
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${badgeCol}`}>
                        {notif.alertType || "System Alert"}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center space-x-1">
                        <Clock size={11} />
                        <span>{new Date(notif.timestamp).toLocaleString()}</span>
                      </span>
                      {notif.isRead ? (
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Read</span>
                      ) : (
                        <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">New</span>
                      )}
                    </div>
                    <p className="text-slate-800 text-sm font-sans leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  
                  {!notif.isRead && (
                    <button
                      onClick={() => onMarkRead(notif._id || notif.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 border border-slate-150 rounded-lg transition cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
