import React, { useState, useMemo } from "react";
import { User, RawMaterial, ProcurementRequest, LinkClick, AuditLog } from "../types";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, Layers, Settings, ShieldAlert, CheckCircle, Mail, DollarSign, 
  Trash2, UserCheck, Key, Plus, FileText, Smartphone, Laptop, Sparkles, RefreshCw, BarChart2, ShieldCheck
} from "lucide-react";
import VisualDashboard from "./VisualDashboard";
import SecurityAuditLog from "./SecurityAuditLog";

interface AdminPanelProps {
  user: User;
  users: User[];
  materials: RawMaterial[];
  orders: ProcurementRequest[];
  clicks: LinkClick[];
  auditLogs: AuditLog[];
  onModifyUser: (payload: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onAddMaterial: (material: any) => Promise<boolean>;
  onRemoveMaterial: (id: string) => Promise<boolean>;
  onToggleMaterialStatus: (id: string, isSold: boolean) => Promise<void>;
  onUpdateOrderStatus: (payload: any) => Promise<void>;
  onApproveMaterial?: (id: string, approved: boolean) => Promise<void>;
  onApproveEdits?: (id: string, approve: boolean) => Promise<boolean>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AdminPanel({
  user,
  users,
  materials,
  orders,
  clicks,
  auditLogs = [],
  onModifyUser,
  onDeleteUser,
  onAddMaterial,
  onRemoveMaterial,
  onToggleMaterialStatus,
  onUpdateOrderStatus,
  onApproveMaterial,
  onApproveEdits,
}: AdminPanelProps) {
  // New User Form States (Administrative addition if needed)
  const [targetUserId, setTargetUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"buyer" | "supplier" | "admin">("buyer");
  const [creditLimitInput, setCreditLimitInput] = useState(5000000);
  const [premiumActiveVal, setPremiumActiveVal] = useState(false);

  // New Material form states for Admin
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Metals & Steel");
  const [supplier, setSupplier] = useState("Admin Certified Metals Co.");
  const [priceQuote, setPriceQuote] = useState(45000);
  const [unit, setUnit] = useState("Tons");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pendingMaterials = useMemo(() => materials.filter(m => m.approved === false), [materials]);
  const approvedMaterials = useMemo(() => materials.filter(m => m.approved !== false), [materials]);
  const materialsWithPendingEdits = useMemo(() => {
    return materials.filter(m => m.pendingEdits && Object.keys(m.pendingEdits).length > 0);
  }, [materials]);

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<"accounts" | "listings" | "orders" | "analytics" | "audit">("analytics");

  // Filter out system stats
  const sysStats = useMemo(() => {
    const totalUsers = users.length;
    const totalListed = materials.length;
    const totalSold = materials.filter(m => m.isSold).length;
    const totalClicksCount = clicks.length;

    // Split proportions of Path A vs Path B Orders
    const pathAOrders = orders.filter(o => o.paymentPath === "PathA_Direct");
    const pathBOrders = orders.filter(o => o.paymentPath === "PathB_Credit");

    const orderDistribution = [
      { name: "Path A (Direct UPI/RTGS)", value: pathAOrders.length },
      { name: "Path B (MSME Pre-Approved Credit)", value: pathBOrders.length },
    ];

    return {
      totalUsers,
      totalListed,
      totalSold,
      totalClicksCount,
      orderDistribution,
    };
  }, [users, materials, orders, clicks]);

  const handleModifyUserSubmit = async (userId: string, currentPremium: boolean, currentLimit: number, currentRole: any) => {
    await onModifyUser({
      userId,
      role: currentRole,
      premiumActive: !currentPremium,
      creditLimit: currentLimit,
    });
  };

  const handleLimitChangeSubmit = async (userId: string, newLimit: number, currentPremium: boolean, currentRole: any) => {
    // Look up the user to preserve approval status
    const u = users.find(x => x._id === userId);
    await onModifyUser({
      userId,
      role: currentRole,
      premiumActive: currentPremium,
      creditLimit: Number(newLimit),
      approved: u ? u.approved !== false : true,
    });
  };

  const handleToggleApproval = async (userId: string, isApproved: boolean) => {
    const u = users.find(x => x._id === userId);
    if (!u) return;
    await onModifyUser({
      userId,
      role: u.role,
      premiumActive: u.premiumActive,
      creditLimit: u.creditLimit,
      approved: !isApproved,
    });
  };

  const handleAddMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);

    const success = await onAddMaterial({
      title,
      category,
      supplier,
      location: "Admin Certified Depot",
      description,
      priceQuote,
      unit,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    });

    setSubmitting(false);
    if (success) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Admin Title Banner */}
      <div className="bg-slate-900 border border-slate-700/60 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_100%)]">
        <div className="space-y-1">
          <span className="text-[10px] bg-red-600 font-mono tracking-widest px-2.5 py-0.5 rounded-full uppercase font-bold">
            Root Administrator
          </span>
          <h2 className="text-xl md:text-2xl font-display font-semibold tracking-tight">Enterprise Administration Hub</h2>
          <p className="text-xs text-slate-400">Manage MSME accounts, configure credit parameters, track link stats, & adjust sold material directories.</p>
        </div>
        <div className="flex items-center space-x-1 font-mono text-xs text-slate-300">
          <RefreshCw size={13} className="text-emerald-400 animate-spin" />
          <span>Real-time Connection: smehouse25 Verified</span>
        </div>
      </div>

      {/* Admin metrics dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-gray-400 text-xs font-semibold block uppercase">Total SME Accounts</span>
            <span className="text-2xl font-bold font-display text-slate-800">{sysStats.totalUsers} Profiles</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-gray-400 text-xs font-semibold block uppercase">Catalog Materials</span>
            <span className="text-2xl font-bold font-display text-slate-800">{sysStats.totalListed} listed</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Layers size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-gray-400 text-xs font-semibold block uppercase">Items Marked Sold</span>
            <span className="text-2xl font-bold font-display text-rose-600">{sysStats.totalSold} Units</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <Trash2 size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-gray-400 text-xs font-semibold block uppercase">System Click Logs</span>
            <span className="text-2xl font-bold font-display text-emerald-600">{sysStats.totalClicksCount} leads</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Systemic proportions visual graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recharts BRC Order Path proportion */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-slate-800">
            Path A (Upfront Settlement) vs Path B (Credit lines) Exposure Ratio
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sysStats.orderDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sysStats.orderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Admin Checklist Info */}
        <div className="lg:col-span-4 bg-slate-900 text-slate-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-amber-400 text-[10px] font-mono tracking-widest uppercase font-bold block">Internal Compliance Audit</span>
            <h4 className="text-white font-display font-medium text-sm leading-relaxed">Verified SME Sourcing Platform Details</h4>
            <div className="space-y-2 text-xs leading-normal font-sans">
              <p>✔ Users submitting valid GST codes qualify for embedded credit lines.</p>
              <p>✔ Real-time push updates broadcast changes instantaneously using Server-Sent Events (SSE).</p>
              <p>✔ Active shortcodes and redirected domain URL logs are fully archived in persistent databases.</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-3 mt-4">
            Secured admin profile logs. SMTP system connected as smehouse25@gmail.com
          </p>
        </div>

      </div>

      {/* Tab Switch Selector */}
      <div className="flex border-b border-gray-200 gap-4 text-sm font-semibold font-display overflow-x-auto">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition flex items-center space-x-1.5 shrink-0 ${
            activeTab === "analytics" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart2 size={15} />
          <span>Sourcing Insights & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab("accounts")}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition shrink-0 ${
            activeTab === "accounts" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Customer Profiles ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition shrink-0 ${
            activeTab === "listings" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Dynamic Listing Directory ({materials.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition shrink-0 ${
            activeTab === "orders" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Purchase Order (PO) Pipelines ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition flex items-center space-x-1.5 shrink-0 ${
            activeTab === "audit" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck size={15} />
          <span>Security & Compliance Logs</span>
        </button>
      </div>

      {/* Tab Content: Sourcing Insights & Charts */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <VisualDashboard 
            orders={orders} 
            materials={materials} 
            clicks={clicks}
            role="admin" 
          />
        </div>
      )}

      {/* Tab Content: Security & Compliance Logs */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <SecurityAuditLog logs={auditLogs} />
        </div>
      )}

      {/* Tab Content 1: Accounts Manager */}
      {activeTab === "accounts" && (
        <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs space-y-4 p-6">
          <h4 className="text-sm font-display font-bold uppercase tracking-wider text-slate-800">
            Registered B2B Partner Ledgers
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="p-3">Company email address</th>
                  <th className="p-3">GSTIN Identity</th>
                  <th className="p-3">User Role</th>
                  <th className="p-3">Approval status</th>
                  <th className="p-3">Pre-Approved Credit line</th>
                  <th className="p-3">Premium Active</th>
                  <th className="p-3 text-right">Administrative Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/40">
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{u.companyName || "SME Segment"}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{u.email}</p>
                      {u.contactName && (
                        <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                          👤 Exec: <span className="font-semibold">{u.contactName}</span>
                        </p>
                      )}
                      {u.aboutCompany && (
                        <p className="text-[10px] text-slate-400 font-sans italic mt-0.5 leading-normal max-w-xs truncate" title={u.aboutCompany}>
                          📝 {u.aboutCompany}
                        </p>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-700">
                      {u.gstNumber || "N/A"}
                    </td>
                    <td className="p-3 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "admin" ? "bg-rose-50 text-rose-600" : u.role === "supplier" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.role !== "admin" ? (
                        <button
                          onClick={() => handleToggleApproval(u._id, u.approved !== false)}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition border ${
                            u.approved !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-800 border-amber-300 animate-pulse font-extrabold"
                          }`}
                          title={u.approved !== false ? "Click to suspend account approval" : "Click to approve and go live"}
                        >
                          {u.approved !== false ? "✓ Approved" : "Pending Review - Click to Approve"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Master Account</span>
                      )}
                    </td>
                    <td className="p-3">
                      {u.role === "buyer" ? (
                        <div className="flex items-center space-x-2">
                          <input 
                            type="number"
                            defaultValue={u.creditLimit}
                            onBlur={(e) => handleLimitChangeSubmit(u._id, Number(e.target.value), u.premiumActive, u.role)}
                            className="w-24 p-1 bg-gray-50 border border-gray-200 rounded text-xs text-slate-800 focus:bg-white font-mono"
                            title="Press Tab/Unfocus to apply credit modification"
                          />
                          <span className="text-[10px] text-gray-400">Used: ₹{u.creditUsed.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not applicable</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleModifyUserSubmit(u._id, u.premiumActive, u.creditLimit, u.role)}
                        className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase cursor-pointer border transition ${
                          u.premiumActive
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-slate-100"
                        }`}
                        title="Click to toggle premium tier"
                      >
                        {u.premiumActive ? "Premium Active" : "Regular tier"}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => onDeleteUser(u._id)}
                          className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg border border-transparent hover:border-gray-100 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Listings Manager */}
      {activeTab === "listings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add materials directly from admin */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-150 p-6 shadow-xs">
            <h4 className="font-display font-semibold text-slate-850 text-sm uppercase mb-4 tracking-wider">
              Add Verified Manufacturer Specifications
            </h4>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-650">Product Name</label>
                <input 
                  type="text"
                  placeholder="E.g. Grade A Copper rods"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg text-slate-800 focus:outline"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-650">B2B Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg text-slate-800 font-semibold"
                  >
                    <option value="Metals & Steel">Metals & Steel</option>
                    <option value="Plastics & Polymer">Plastics & Polymer</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Rubber & Elastomer">Rubber & Elastomer</option>
                    <option value="Ore & Mineral">Ore & Mineral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-650">Supplier Brand</label>
                  <input 
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-650">Price Quote (INR)</label>
                  <input 
                    type="number"
                    value={priceQuote}
                    onChange={(e) => setPriceQuote(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-650">Pricing Unit</label>
                  <input 
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-650">Specifications</label>
                <textarea 
                  rows={2}
                  placeholder="Composition chemical specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Publish Specifications</span>
              </button>
            </form>
          </div>

          {/* Remove / Manage Listed Materials */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Pending Approvals section */}
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <h4 className="font-display font-semibold text-amber-850 text-sm uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Pending Supplier Listings ({pendingMaterials.length})</span>
                </h4>
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                  Needs Review
                </span>
              </div>

              {pendingMaterials.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 italic">
                  No supplier listings are currently awaiting administration approval.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-amber-50/50 text-amber-800 font-mono text-[10px] uppercase">
                        <th className="p-3">Specification Name</th>
                        <th className="p-3">Supplier Brand</th>
                        <th className="p-3">Price Quote</th>
                        <th className="p-3 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {pendingMaterials.map(m => (
                        <tr key={m._id} className="hover:bg-amber-50/10">
                          <td className="p-3">
                            <p className="font-semibold text-slate-800">{m.title}</p>
                            <p className="text-[10px] text-amber-600 font-medium capitalize">{m.category}</p>
                          </td>
                          <td className="p-3 font-medium text-slate-650">{m.supplier}</td>
                          <td className="p-3 font-mono text-slate-700">₹{m.priceQuote.toLocaleString()}/{m.unit}</td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => onApproveMaterial?.(m._id, true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRemoveMaterial(m._id)}
                              className="bg-rose-650 hover:bg-rose-700 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pending Product Edits Section */}
            {materialsWithPendingEdits.length > 0 && (
              <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                  <h4 className="font-display font-semibold text-indigo-850 text-sm uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span>Pending Product Edits Review ({materialsWithPendingEdits.length})</span>
                  </h4>
                  <span className="text-[10px] bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded font-mono font-bold">
                    Requires Audit
                  </span>
                </div>

                <div className="space-y-4">
                  {materialsWithPendingEdits.map(m => {
                    const pe = m.pendingEdits!;
                    return (
                      <div key={m._id} className="border border-indigo-100 bg-indigo-50/10 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs">{m.title}</h5>
                            <p className="text-[10px] text-slate-500">Listed by: <strong>{m.supplier}</strong></p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => onApproveEdits?.(m._id, true)}
                              className="bg-indigo-650 hover:bg-indigo-750 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition font-sans"
                            >
                              Approve Edits
                            </button>
                            <button
                              onClick={() => onApproveEdits?.(m._id, false)}
                              className="bg-gray-150 hover:bg-gray-200 text-gray-700 rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition font-sans"
                            >
                              Discard
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-sans pt-1">
                          {/* Current specifications */}
                          <div className="bg-white border border-gray-150 p-2.5 rounded-lg space-y-1">
                            <p className="font-bold text-gray-500 uppercase text-[9px] border-b pb-1">Current Active Details</p>
                            <p>• <strong>Title:</strong> {m.title}</p>
                            <p>• <strong>Category:</strong> {m.category}</p>
                            <p>• <strong>Price:</strong> ₹{m.priceQuote?.toLocaleString("en-IN")}/{m.unit}</p>
                            <p>• <strong>Location:</strong> {m.location}</p>
                            <p className="text-gray-500 italic mt-1 line-clamp-2">Specs: {m.description}</p>
                          </div>

                          {/* Proposed edits */}
                          <div className="bg-indigo-50/30 border border-indigo-150 p-2.5 rounded-lg space-y-1">
                            <p className="font-bold text-indigo-600 uppercase text-[9px] border-b pb-1">Proposed Edit Details</p>
                            <p className={m.title !== pe.title ? "text-indigo-900 font-semibold" : "text-gray-500"}>
                              • <strong>Title:</strong> {pe.title}
                            </p>
                            <p className={m.category !== pe.category ? "text-indigo-900 font-semibold" : "text-gray-500"}>
                              • <strong>Category:</strong> {pe.category}
                            </p>
                            <p className={m.priceQuote !== pe.priceQuote || m.unit !== pe.unit ? "text-indigo-900 font-semibold" : "text-gray-500"}>
                              • <strong>Price:</strong> ₹{pe.priceQuote?.toLocaleString("en-IN")}/{pe.unit}
                            </p>
                            <p className={m.location !== pe.location ? "text-indigo-900 font-semibold" : "text-gray-500"}>
                              • <strong>Location:</strong> {pe.location}
                            </p>
                            <p className={m.description !== pe.description ? "text-indigo-900 font-semibold mt-1 line-clamp-2" : "text-gray-500 italic mt-1 line-clamp-2"}>
                              Specs: {pe.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Approved Sourcing Catalog */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
              <h4 className="font-display font-semibold text-slate-800 text-sm uppercase tracking-wider pb-3 border-b border-gray-100">
                Approved Sourcing Catalog ({approvedMaterials.length})
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-mono text-[10px] uppercase">
                      <th className="p-3">Specification Name</th>
                      <th className="p-3">Brand Supplier</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Delete Sourcing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {approvedMaterials.map(m => (
                      <tr key={m._id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">
                          {m.title}
                          <p className="text-[10px] text-gray-400 capitalize">{m.category}</p>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{m.supplier}</td>
                        <td className="p-3">
                          <button
                            onClick={() => onToggleMaterialStatus(m._id, !m.isSold)}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border cursor-pointer ${
                              m.isSold
                                ? "bg-slate-900 text-amber-400 border-slate-950"
                                : "bg-emerald-50 text-emerald-700 border-emerald-250"
                            }`}
                          >
                            {m.isSold ? "SOLD / BLOCKED" : "ACTIVE / DISPATCHED"}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onRemoveMaterial(m._id)}
                            className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg border border-transparent hover:border-gray-100 transition cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab Content 3: Orders pipeline */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h4 className="font-display font-bold uppercase tracking-wider text-slate-800 text-sm">
            B2B Purchase Order (PO) Pipelines & Milestone Dispatches
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="p-3">MSME Buyer Email</th>
                  <th className="p-3">Product Order Details</th>
                  <th className="p-3">Billing Invoice</th>
                  <th className="p-3">Milestone State</th>
                  <th className="p-3 text-right">Operational dispatch actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => {
                  const isCredit = order.paymentPath === "PathB_Credit";
                  return (
                    <tr key={order._id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <p className="font-semibold text-slate-800">{order.msmeEmail}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{order.msmeGst || "No GST"}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800">{order.quantity} {order.unit} {order.materialType}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Carrier: {order.selectedSupplier || "Pending Sourcing"}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-850">₹{order.totalAmount.toLocaleString()}</p>
                        <p className={`text-[10px] uppercase font-bold font-mono ${isCredit ? "text-indigo-600" : "text-emerald-600"}`}>
                          {isCredit ? "Path B: Credit" : "Path A: Direct"}
                        </p>
                      </td>
                      <td className="p-3 font-mono text-[11px] capitalize">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          order.status === "Pending" ? "bg-amber-50 text-amber-700" : 
                          order.status === "Awaiting_Dispatch_Approval" ? "bg-amber-500 text-white" :
                          order.status === "Delivered_Repaid" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        {order.status === "Pending" && (
                          <button
                            onClick={() => onUpdateOrderStatus({ id: order._id, status: "Matched", selectedSupplier: "TATA Sourcing Logistics" })}
                            className="bg-indigo-650 hover:bg-indigo-700 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition"
                          >
                            Match supplier
                          </button>
                        )}
                        {order.status === "Matched" && (
                          <button
                            onClick={() => onUpdateOrderStatus({ id: order._id, status: "QC_Verified", qcReportUrl: "https://verified-reports-rmi.in/report_" + order._id })}
                            className="bg-purple-650 hover:bg-purple-700 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition"
                          >
                            Generate QC
                          </button>
                        )}
                        {order.status === "QC_Verified" && (
                          <button
                            onClick={() => onUpdateOrderStatus({ id: order._id, status: "Shipped" })}
                            className="bg-amber-650 hover:bg-amber-700 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition"
                          >
                            Dispatch/Ship
                          </button>
                        )}
                        {order.status === "Awaiting_Dispatch_Approval" && (
                          <button
                            onClick={() => onUpdateOrderStatus({ id: order._id, status: "Shipped" })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition animate-pulse"
                          >
                            Approve Dispatch & Ship
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() => onUpdateOrderStatus({ id: order._id, status: "Delivered" })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition"
                          >
                            Mark Arrived
                          </button>
                        )}
                        {order.status === "Delivered" && (
                          <span className="text-gray-400 italic text-[10px]">Awaiting Repayment</span>
                        )}
                        {order.status === "Delivered_Repaid" && (
                          <span className="text-emerald-600 font-semibold text-[10px]">Ready & Settled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
