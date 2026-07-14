import React, { useState } from "react";
import { User, ProcurementRequest, AppNotification, RawMaterial } from "../types";
import { 
  CreditCard, Calendar, Truck, FileCheck, CheckCircle2, AlertTriangle, 
  Clock, Mail, Sparkles, Send, MapPin, Receipt, ArrowUpRight, Search, Info, PlusCircle, Check
} from "lucide-react";

interface BuyerDashboardProps {
  user: User;
  orders: ProcurementRequest[];
  notifications: AppNotification[];
  materials: RawMaterial[];
  onRepayCredit: (orderId: string) => Promise<void>;
  onConfirmReceipt: (orderId: string) => Promise<void>;
  onTriggerMail: (email: string) => Promise<void>;
  onSubmitRequest: (reqPayload: any) => Promise<boolean>;
}

export default function BuyerDashboard({
  user,
  orders,
  notifications,
  materials = [],
  onRepayCredit,
  onConfirmReceipt,
  onTriggerMail,
  onSubmitRequest,
}: BuyerDashboardProps) {
  const [targetEmail, setTargetEmail] = useState(user.email);
  const [smtpLoading, setSmtpLoading] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSourcingMaterial, setActiveSourcingMaterial] = useState<RawMaterial | null>(null);
  const [sourcingQuantity, setSourcingQuantity] = useState(100);
  const [sourcingLocation, setSourcingLocation] = useState("Mumbai Port");
  const [sourcingPath, setSourcingPath] = useState<"PathA_Direct" | "PathB_Credit">("PathA_Direct");
  const [sourcingDays, setSourcingDays] = useState(60);
  const [sourcingLoading, setSourcingLoading] = useState(false);
  const [sourcingSuccess, setSourcingSuccess] = useState<string | null>(null);

  // Fuzzy search algorithm matching characters sequentially
  const fuzzySearch = (text: string, query: string): boolean => {
    if (!query) return true;
    const t = (text || "").toLowerCase();
    const q = query.toLowerCase();
    if (t.includes(q)) return true;
    let qIdx = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === q[qIdx]) {
        qIdx++;
      }
      if (qIdx === q.length) return true;
    }
    return false;
  };

  // Perform filtering across materials
  const filteredMaterials = (materials || []).filter(m => {
    if (m.approved === false) return false; // only search approved materials
    const matchesTitle = fuzzySearch(m.title, searchQuery);
    const matchesCategory = fuzzySearch(m.category, searchQuery);
    const matchesSupplier = fuzzySearch(m.supplier, searchQuery);
    return matchesTitle || matchesCategory || matchesSupplier;
  });

  // Filter orders for logged in buyer
  const myOrders = orders.filter(
    o => o.msmeEmail.toLowerCase() === user.email.toLowerCase()
  );

  const availableCredit = Math.max(0, user.creditLimit - user.creditUsed);
  const usedPercent = Math.round((user.creditUsed / user.creditLimit) * 100) || 0;

  const handleSmtpReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpLoading(true);
    setSmtpStatus(null);
    try {
      await onTriggerMail(targetEmail);
      setSmtpStatus("✅ Custom Domain Automated report dispatched successfully via SMTP!");
    } catch (err: any) {
      setSmtpStatus("❌ SMTP Issue: " + err.message);
    } finally {
      setSmtpLoading(false);
    }
  };

  const handleSourcingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSourcingMaterial) return;
    setSourcingLoading(true);
    setSourcingSuccess(null);
    try {
      const payload = {
        materialType: activeSourcingMaterial.title,
        quantity: sourcingQuantity,
        unit: activeSourcingMaterial.unit || "Tons",
        deliveryLocation: sourcingLocation,
        path: sourcingPath,
        tenureDays: sourcingPath === "PathB_Credit" ? sourcingDays : 0,
        email: user.email,
        gst: user.gstNumber || "GSTIN_MSME_BUYER",
        supplierName: activeSourcingMaterial.supplier,
        amount: activeSourcingMaterial.priceQuote * sourcingQuantity,
      };

      const ok = await onSubmitRequest(payload);
      if (ok) {
        setSourcingSuccess("🎉 Sourcing inquiry successfully routed to supplier!");
        setTimeout(() => {
          setActiveSourcingMaterial(null);
          setSourcingSuccess(null);
        }, 1500);
      }
    } catch (err: any) {
      alert("Sourcing failed: " + err.message);
    } finally {
      setSourcingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Upper Grid: Credit Ledger + SMTP Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Credit Cap widget - Path B Ledger */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 to-slate-900 border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">Embedded Credit Ledger</span>
              <h2 className="text-xl font-display font-semibold">Active Path B Sourcing Limit</h2>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-emerald-400">
              <CreditCard size={20} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 pb-6 border-b border-white/5">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Approved B2B Cap</span>
              <span className="text-xl md:text-2xl font-bold">₹{user.creditLimit.toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-mono text-emerald-400 block mt-1">Verified via GSTIN: {user.gstNumber || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium">Used Credit Exposure</span>
              <span className="text-xl md:text-2xl font-bold text-orange-400">₹{user.creditUsed.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-gray-400 block mt-1">Available: ₹{availableCredit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Progress Bar representation */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">Exposure Rate:</span>
              <span className={`${usedPercent > 80 ? "text-rose-400" : "text-blue-400"} font-bold`}>{usedPercent}%</span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  usedPercent > 85 ? "bg-rose-500" : usedPercent > 50 ? "bg-amber-400" : "bg-blue-500"
                }`}
                style={{ width: `${usedPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400 leading-normal pt-1 flex items-center space-x-1">
              <AlertTriangle size={12} className="text-amber-400 shrink-0" />
              <span>Interest is computed lazily at 16% p.a. repayment clock activates strictly on Delivery.</span>
            </p>
          </div>
        </div>

        {/* Custom SMTP Automated Reports Router */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Mail size={16} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest block">Automated Dispatcher</span>
            </div>
            <h3 className="text-base font-display font-semibold text-slate-800">SMTP Custom Domain Reporting</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Verify connection with customer corporate email domains below. Our SMTP relay will deliver custom click logs, order milestones, and financial statements directly in PDF/HTML format.
            </p>
          </div>

          <form onSubmit={handleSmtpReport} className="mt-6 space-y-3">
            <input 
              type="email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="E.g. procurement@tatasteels.in"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              required
            />
            <button
              type="submit"
              disabled={smtpLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{smtpLoading ? "Broadcasting Report via SMTP..." : "Send Custom SMTP Report Now"}</span>
              <Send size={12} />
            </button>
            {smtpStatus && (
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                {smtpStatus}
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Real-time Global Fuzzy Search Bar Segment */}
      <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest block">Global B2B Catalog Directory</span>
          <h3 className="text-lg font-display font-bold text-slate-900">Real-Time Fuzzy Raw Material Search</h3>
          <p className="text-xs text-gray-500">
            Search certified raw materials across India's premier MSME suppliers by category, supplier business name, or material title using fuzzy sequence logic.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category, supplier, or material name (e.g. 'Steel Tata', 'Cement JSW', 'Polymer')..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 hover:bg-gray-100/55 focus:bg-white border border-gray-250 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 transition"
          />
        </div>

        {/* Search Results Display */}
        {searchQuery && (
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-3 font-mono">
              <span>FUZZY MATCHES FOUND: {filteredMaterials.length}</span>
              {filteredMaterials.length > 0 && <span className="text-emerald-500">● Real-time sync</span>}
            </div>

            {filteredMaterials.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">
                No matching raw materials found. Please verify spelling or try another general category.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-1">
                {filteredMaterials.map(mat => (
                  <div key={mat._id} className="p-4 bg-slate-50 hover:bg-slate-100/60 border border-slate-150 rounded-xl transition-all flex flex-col justify-between space-y-3.5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                          {mat.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          ₹{mat.priceQuote?.toLocaleString("en-IN")} / {mat.unit}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 font-sans">{mat.title}</h4>
                      <div className="text-[10px] space-y-1 text-gray-500">
                        <p className="font-medium">🏢 Supplier: {mat.supplier}</p>
                        <p>📍 Hub: {mat.location}</p>
                        <p className="line-clamp-2 text-[10px] text-gray-400">{mat.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSourcingMaterial(mat);
                        setSourcingQuantity(100);
                        setSourcingSuccess(null);
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-lg py-2 text-[11px] font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <PlusCircle size={13} />
                      <span>Create Sourcing Inquiry</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Sourcing Modal Overlay */}
      {activeSourcingMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 to-slate-900">
              <div>
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-bold">New Sourcing Request</span>
                <h4 className="text-sm font-semibold font-display">{activeSourcingMaterial.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveSourcingMaterial(null)}
                className="text-gray-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSourcingSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Quantity ({activeSourcingMaterial.unit})</label>
                  <input
                    type="number"
                    value={sourcingQuantity}
                    onChange={(e) => setSourcingQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Unit Price (INR)</label>
                  <div className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-500">
                    ₹{activeSourcingMaterial.priceQuote?.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Target Delivery Location</label>
                <input
                  type="text"
                  value={sourcingLocation}
                  onChange={(e) => setSourcingLocation(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold block">Payment Pathway Strategy</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSourcingPath("PathA_Direct")}
                    className={`p-3 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                      sourcingPath === "PathA_Direct"
                        ? "border-emerald-500 bg-emerald-50/30 text-emerald-800"
                        : "border-gray-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <p className="font-bold">Path A: Direct UPI/RTGS</p>
                    <p className="text-[9px] text-slate-400 mt-1">2% Commission fee</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (availableCredit < activeSourcingMaterial.priceQuote * sourcingQuantity) {
                        alert("⚠️ Total request exceeds your available Path B B2B Credit limit!");
                        return;
                      }
                      setSourcingPath("PathB_Credit");
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                      sourcingPath === "PathB_Credit"
                        ? "border-indigo-500 bg-indigo-50/30 text-indigo-800"
                        : "border-gray-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <p className="font-bold">Path B: B2B Credit Line</p>
                    <p className="text-[9px] text-slate-400 mt-1">16% p.a. lazy interest</p>
                  </button>
                </div>
              </div>

              {sourcingPath === "PathB_Credit" && (
                <div className="space-y-1 p-3 bg-indigo-50/20 border border-indigo-150 rounded-xl">
                  <label className="text-[10px] font-mono text-indigo-700 uppercase font-semibold block">Repayment Tenure Days</label>
                  <select
                    value={sourcingDays}
                    onChange={(e) => setSourcingDays(Number(e.target.value))}
                    className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-xs focus:outline-none font-medium text-indigo-800"
                  >
                    <option value={30}>30 Days (Standard limit lock)</option>
                    <option value={60}>60 Days (Medium terms)</option>
                    <option value={90}>90 Days (Extended credit terms)</option>
                  </select>
                </div>
              )}

              {/* Real-time Invoice Calculator preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-150 space-y-1 font-sans">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Subtotal Amount:</span>
                  <span>₹{(activeSourcingMaterial.priceQuote * sourcingQuantity).toLocaleString("en-IN")}</span>
                </div>
                {sourcingPath === "PathB_Credit" && (
                  <div className="flex justify-between text-xs text-indigo-600 font-mono">
                    <span>Est Interest (16% for {sourcingDays} days):</span>
                    <span>₹{Math.round(((activeSourcingMaterial.priceQuote * sourcingQuantity * 0.16) / 365) * sourcingDays).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-slate-800 pt-2 border-t border-gray-200 mt-2">
                  <span>Estimated Total Settle:</span>
                  <span>₹{Math.round((activeSourcingMaterial.priceQuote * sourcingQuantity) + (sourcingPath === "PathB_Credit" ? ((activeSourcingMaterial.priceQuote * sourcingQuantity * 0.16) / 365) * sourcingDays : 0)).toLocaleString("en-IN")} INR</span>
                </div>
              </div>

              {sourcingSuccess && (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl font-medium leading-relaxed">
                  {sourcingSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={sourcingLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {sourcingLoading ? "Routing to Supplier Registry..." : "Dispatch Sourcing Request"}
                <ArrowUpRight size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notifications / SSE Stream logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Procurement Milestones List */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-lg font-display font-bold text-slate-900">
            Current Procurement Orders ({myOrders.length})
          </h3>

          {myOrders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl flex flex-col items-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Receipt size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mt-1">
                  You have not raised any active procurement inquiries yet. Turn to Sourcing Catalog.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => {
                const isPathB = order.paymentPath === "PathB_Credit";
                return (
                  <div 
                    key={order._id}
                    className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs hover:shadow-md transition-all space-y-4 relative"
                  >
                    {/* Corner Ribbon */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        isPathB ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-emerald-50 text-emerald-700 border border-emerald-250"
                      }`}>
                        {isPathB ? "Path B - Credit" : "Path A - Direct"}
                      </span>
                    </div>

                    {/* Order Meta */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-400 font-bold block uppercase tracking-wider">Order ID: #{order._id}</span>
                      <h4 className="font-display font-semibold text-sm text-slate-800">
                        {order.quantity} {order.unit} {order.materialType}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center space-x-1">
                        <MapPin size={12} className="text-gray-400" />
                        <span>Shipment Target: {order.deliveryLocation}</span>
                      </p>
                    </div>

                    {/* Milestone State indicator */}
                    <div className="grid grid-cols-4 gap-2 pt-3 border-y border-gray-100 py-3.5 text-center text-[10px] font-mono">
                      <div className="space-y-1">
                        <span className="text-gray-300 block">1. Sourced</span>
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          ["Pending", "Matched", "QC_Verified", "Approved", "Shipped", "Delivered", "Delivered_Repaid"].includes(order.status)
                            ? "bg-blue-600 ring-4 ring-blue-100" 
                            : "bg-gray-200"
                        }`}></span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-300 block">2. QC Checked</span>
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          ["QC_Verified", "Approved", "Shipped", "Delivered", "Delivered_Repaid"].includes(order.status)
                            ? "bg-indigo-600 ring-4 ring-indigo-100" 
                            : "bg-gray-200"
                        }`}></span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-300 block">3. In-Transit</span>
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          ["Shipped", "Delivered", "Delivered_Repaid"].includes(order.status)
                            ? "bg-amber-500 ring-4 ring-amber-100" 
                            : "bg-gray-250"
                        }`}></span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-300 block">4. Arrived</span>
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          ["Delivered", "Delivered_Repaid"].includes(order.status)
                            ? "bg-emerald-500 ring-4 ring-emerald-100" 
                            : "bg-gray-200"
                        }`}></span>
                      </div>
                    </div>

                    {/* Financial stats and buttons */}
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-gray-400 block uppercase font-semibold">Total Settle Invoice</span>
                        <strong className="text-sm font-semibold text-slate-800">₹{order.totalAmount.toLocaleString()}</strong>
                        {isPathB && order.dueDate && (
                          <div className="text-[10px] text-indigo-600 font-mono mt-0.5 block leading-normal">
                            📅 Due {new Date(order.dueDate).toLocaleDateString()} | p.a. Accrued: ₹{order.creditInterestDue.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Interactive receipt triggers */}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() => onConfirmReceipt(order._id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition cursor-pointer flex items-center space-x-1"
                          >
                            <CheckCircle2 size={13} />
                            <span>Confirm Receipt</span>
                          </button>
                        )}

                        {/* Path B Repayment collections triggers */}
                        {isPathB && order.status === "Delivered" && (
                          <button
                            onClick={() => onRepayCredit(order._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold tracking-wide transition cursor-pointer flex items-center space-x-1"
                          >
                            <Receipt size={13} />
                            <span>Repay Credit Line</span>
                          </button>
                        )}

                        {order.status === "Delivered_Repaid" && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-lg font-mono font-medium">
                            Repaid & Restored
                          </span>
                        )}

                        {order.qcReportUrl && (
                          <a
                            href={order.qcReportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs px-3 py-2 rounded-lg font-mono"
                          >
                            View QC Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Area: Real-Time Push Notification SSE Panel */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-display font-bold text-slate-900">
            Real-Time Push Stream
          </h3>

          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-500 font-semibold uppercase tracking-wider">SSE LIVE FEED</span>
              <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Subscribed</span>
              </span>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-6">
                  No notifications recorded yet. Incoming order milestones from administrators appear here instantly via push.
                </p>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    className="p-3 bg-slate-50 border-l-2 border-blue-600 rounded-r-lg space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                      <span className="uppercase font-semibold text-blue-600">{notif.type}</span>
                      <span>{new Date(notif.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-normal">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
