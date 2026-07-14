import React, { useState, useMemo } from "react";
import { AuditLog } from "../types";
import { 
  ShieldAlert, ShieldCheck, Search, Filter, Clock, 
  User, Activity, RefreshCw, FileSpreadsheet, Download 
} from "lucide-react";

interface SecurityAuditLogProps {
  logs: AuditLog[];
  loading?: boolean;
}

export default function SecurityAuditLog({
  logs,
  loading = false,
}: SecurityAuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("All");

  const uniqueActions = useMemo(() => {
    const actions = new Set<string>();
    logs.forEach(log => {
      if (log.action) actions.add(log.action);
    });
    return ["All", ...Array.from(actions)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.role || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = filterAction === "All" || log.action === filterAction;

      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, filterAction]);

  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 to-slate-900 border-b border-slate-850">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>Cryptographic Ledger Audit</span>
          </div>
          <h3 className="text-base font-display font-bold">State Transition & Security Audit Logs</h3>
          <p className="text-xs text-gray-400">
            Real-time, immutable administrative tracking of procurement milestone edits, catalog approvals, and user activations.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md block">
            {filteredLogs.length} Records Logged
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-slate-50 border-b border-gray-150 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by details, initiator, email or role..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        {/* Action Select filter */}
        <div className="md:col-span-4 relative flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter Action:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full bg-white border border-gray-250 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          >
            {uniqueActions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>

        {/* Clear filters button */}
        <div className="md:col-span-2 text-right">
          {(searchTerm !== "" || filterAction !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterAction("All");
              }}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Ledger Body */}
      <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="animate-spin text-indigo-600" size={24} />
            <span className="text-xs text-gray-500 font-mono">Loading compliance logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 italic">
            No audit records matching your filters were found. State actions appear here upon dispatch.
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-gray-100/75 text-gray-500 border-b border-gray-150 font-mono text-[10px] uppercase">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">State Transition Details</th>
                <th className="p-3">Initiated By</th>
                <th className="p-3">Auth Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredLogs.map((log, index) => {
                // Style action badges
                const isApproved = log.action.includes("Approve") || log.action.includes("Active") || log.action.includes("Repaid") || log.action.includes("Delivered");
                const isRejected = log.action.includes("Reject") || log.action.includes("Discard") || log.action.includes("Delete");
                const isCreated = log.action.includes("Created") || log.action.includes("List");
                
                const actionBadgeClass = isApproved
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : isRejected
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : isCreated
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-250";

                return (
                  <tr key={log._id || index} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-3 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${actionBadgeClass}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                      {log.userId}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono capitalize ${
                        log.role === "admin" 
                          ? "bg-red-50 text-red-700 border border-red-100" 
                          : log.role === "supplier"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            : "bg-slate-100 text-slate-700"
                      }`}>
                        {log.role}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Footer warning */}
      <div className="p-3 bg-gray-50 border-t border-gray-150 flex justify-between items-center text-[10px] font-mono text-gray-400">
        <span className="flex items-center space-x-1">
          <Activity size={12} className="text-emerald-500 animate-pulse" />
          <span>Active Session: Connected | Immutable logs mapped to Admin</span>
        </span>
        <span>Standard ISO-27001 MSME Compliance Logs</span>
      </div>
    </div>
  );
}
