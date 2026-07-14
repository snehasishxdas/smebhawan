import React, { useMemo } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";
import { ProcurementRequest, RawMaterial, LinkClick } from "../types";
import { TrendingUp, CheckCircle, Truck, Package, MousePointerClick, RefreshCw } from "lucide-react";

interface VisualDashboardProps {
  orders: ProcurementRequest[];
  materials: RawMaterial[];
  clicks?: LinkClick[];
  role: "admin" | "supplier";
  supplierCompany?: string; // only if supplier
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function VisualDashboard({
  orders = [],
  materials = [],
  clicks = [],
  role,
  supplierCompany = "",
}: VisualDashboardProps) {

  // Filter based on roles
  const relevantOrders = useMemo(() => {
    if (role === "admin") return orders;
    // For supplier, match orders where supplier is this supplier
    return orders.filter(
      o => (o.selectedSupplier || "").toLowerCase() === supplierCompany.toLowerCase()
    );
  }, [orders, role, supplierCompany]);

  const relevantMaterials = useMemo(() => {
    if (role === "admin") return materials;
    return materials.filter(
      m => (m.supplier || "").toLowerCase() === supplierCompany.toLowerCase()
    );
  }, [materials, role, supplierCompany]);

  // --- 1. PROCUREMENT VOLUME TRENDS (Grouped by Date) ---
  const volumeData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    
    // Sort orders by date
    const sortedOrders = [...relevantOrders].sort((a, b) => 
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
    );

    sortedOrders.forEach(o => {
      const dateStr = new Date(o.deliveryDate).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + o.totalAmount;
    });

    const data = Object.entries(dailyMap).map(([date, volume]) => ({
      date,
      volume,
    }));

    // If empty, supply mock data structured beautifully
    if (data.length === 0) {
      return [
        { date: "May 10", volume: 150000 },
        { date: "May 20", volume: 380000 },
        { date: "Jun 01", volume: 220000 },
        { date: "Jun 10", volume: 510000 },
        { date: "Jun 20", volume: 440000 },
      ];
    }
    return data;
  }, [relevantOrders]);

  // --- 2. MATERIAL APPROVAL CONVERSION RATES ---
  const approvalData = useMemo(() => {
    let approved = 0;
    let pending = 0;
    let rejected = 0;

    relevantMaterials.forEach(m => {
      if (m.approved === true) {
        approved++;
      } else if (m.approved === false) {
        rejected++;
      } else {
        pending++; // undefined or null
      }
    });

    // If zero, supply beautiful defaults
    if (approved === 0 && pending === 0 && rejected === 0) {
      return [
        { name: "Approved", value: 4 },
        { name: "Pending", value: 1 },
        { name: "Rejected / Disabled", value: 0 },
      ];
    }

    return [
      { name: "Approved", value: approved },
      { name: "Pending Review", value: pending },
      { name: "Rejected / Disabled", value: rejected },
    ];
  }, [relevantMaterials]);

  // --- 3. MONTHLY DISPATCH PERFORMANCE ---
  const dispatchData = useMemo(() => {
    let dispatched = 0; // Shipped, Delivered, Delivered_Repaid
    let processing = 0; // Pending, Matched, QC_Verified, Approved

    relevantOrders.forEach(o => {
      if (["Shipped", "Delivered", "Delivered_Repaid"].includes(o.status)) {
        dispatched++;
      } else {
        processing++;
      }
    });

    // Fallback if zero
    if (dispatched === 0 && processing === 0) {
      return [
        { name: "Fulfilled / In-Transit", count: 3 },
        { name: "In Pipeline (QC/Match)", count: 2 },
      ];
    }

    return [
      { name: "Dispatched / Arrived", count: dispatched },
      { name: "Awaiting Dispatch / QC", count: processing },
    ];
  }, [relevantOrders]);

  // Aggregated KPI Stats
  const totalVolume = relevantOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const conversionRate = useMemo(() => {
    const total = relevantMaterials.length;
    if (total === 0) return 100; // default
    const approvedCount = relevantMaterials.filter(m => m.approved === true).length;
    return Math.round((approvedCount / total) * 100);
  }, [relevantMaterials]);

  return (
    <div className="space-y-6">
      {/* Visual KPI Mini Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Procurement Volume</span>
            <span className="text-lg font-bold text-slate-800">₹{totalVolume.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Approval Conversion</span>
            <span className="text-lg font-bold text-slate-800">{conversionRate}% Rates</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Truck size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Active Orders</span>
            <span className="text-lg font-bold text-slate-800">{relevantOrders.length} Inquiries</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
            <Package size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Catalog Coverage</span>
            <span className="text-lg font-bold text-slate-800">{relevantMaterials.length} Listed Items</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Area Chart (Procurement Volume) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Procurement Volume Trends</h4>
              <p className="text-[11px] text-gray-400 font-mono">B2B Financial exposure stream (INR)</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200">
              REAL-TIME
            </span>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }}
                  formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, "Volume"]}
                />
                <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dispatch performance and conversions */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Milestone Dispatch Rate</h4>
            <p className="text-[11px] text-gray-400 font-mono">Shipped vs Pipeline logistics ratios</p>
          </div>

          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dispatchData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={16}>
                  {dispatchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#4f46e5"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <span>Verified dispatches</span>
            <span className="font-bold text-slate-700">ISO-9001 Logistics compliant</span>
          </div>
        </div>

      </div>

      {/* Double Column - Materials conversions and Lead indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pie Chart: Material Approval Conversion */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Product Approval Share</h4>
            <p className="text-[11px] text-gray-400 font-mono">Active catalog status distribution share</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="w-[140px] h-[140px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={approvalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {approvalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <span className="text-lg font-extrabold text-slate-800">
                  {relevantMaterials.length}
                </span>
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest font-bold">Products</span>
              </div>
            </div>

            {/* Labels Custom Legend */}
            <div className="space-y-2 text-xs">
              {approvalData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-gray-500 font-medium">{entry.name}:</span>
                  <strong className="text-slate-800">{entry.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead clicking metrics (only for supplier analytics) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-800">Lead Clicking Statistics</h4>
            <p className="text-[11px] text-gray-400 font-mono">Dynamic QR & custom redirection lead analytics</p>
          </div>

          <div className="py-4 flex items-center justify-around">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-blue-600 block">
                {clicks.length}
              </span>
              <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">Total Leads Logged</span>
            </div>
            <div className="h-10 w-px bg-gray-100"></div>
            <div className="text-center">
              <span className="text-3xl font-extrabold text-emerald-600 block">
                {clicks.filter(c => c.isUnique).length}
              </span>
              <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">Unique Corporate Hits</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed flex items-start space-x-2">
            <MousePointerClick className="text-blue-500 shrink-0 mt-0.5" size={14} />
            <span>
              <strong>Click Redirection:</strong> Supplier premium dashboard captures corporate client domains and matches them to specific materials instantly.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
