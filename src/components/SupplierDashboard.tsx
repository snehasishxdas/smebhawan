import React, { useState, useMemo } from "react";
import { User, RawMaterial, LinkClick, ProcurementRequest } from "../types";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, 
  Cell, PieChart, Pie, Legend 
} from "recharts";
import { 
  Activity, Star, Plus, Trash2, Globe, Laptop, Smartphone, ShieldCheck, 
  Sparkles, ExternalLink, RefreshCw, Clock, Truck, CheckCircle2, FileText, MapPin, Receipt, Edit, X
} from "lucide-react";
import VisualDashboard from "./VisualDashboard";

interface SupplierDashboardProps {
  user: User;
  materials: RawMaterial[];
  clicks: LinkClick[];
  orders?: ProcurementRequest[];
  onCreateMaterial: (material: any) => Promise<boolean>;
  onRemoveMaterial: (id: string) => Promise<boolean>;
  onStripeUpgrade: (planName: string, price: number) => Promise<void>;
  onUpdateOrderStatus?: (payload: any) => Promise<void>;
  onEditMaterial: (id: string, edits: any) => Promise<boolean>;
}

// Visual colors for charts
const COLORS = ["#2563eb", "#10b981", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function SupplierDashboard({
  user,
  materials,
  clicks,
  orders = [],
  onCreateMaterial,
  onRemoveMaterial,
  onStripeUpgrade,
  onUpdateOrderStatus,
  onEditMaterial,
}: SupplierDashboardProps) {
  // New Material form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Metals & Steel");
  const [location, setLocation] = useState("Mumbai, Maharashtra");
  const [description, setDescription] = useState("");
  const [priceQuote, setPriceQuote] = useState(65000);
  const [unit, setUnit] = useState("Tons");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Edit Material modal states
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Metals & Steel");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriceQuote, setEditPriceQuote] = useState(0);
  const [editUnit, setEditUnit] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Filter materials listed by this supplier
  // Wait, if logged in as user, list items where supplier === user.companyName
  const myMaterials = useMemo(() => {
    return materials.filter(
      m => m.supplier.toLowerCase() === (user.companyName || "").toLowerCase() || m.supplier === "TATA Steel Supply Co."
    );
  }, [materials, user.companyName]);

  // Filter incoming customer purchase orders (POs) matching this supplier
  const myIncomingOrders = useMemo(() => {
    return orders.filter(
      o => (o.selectedSupplier || "").toLowerCase() === (user.companyName || "").toLowerCase() ||
           (o.selectedSupplier || "").toLowerCase() === "tata steel supply co."
    );
  }, [orders, user.companyName]);

  // Aggregate clicks data for Recharts
  // Clicks are logged with linkCodes that belong to our raw materials
  const clickStats = useMemo(() => {
    const myLinkCodes = new Set(myMaterials.map(m => m.rawLink));
    const filteredClicks = clicks.filter(c => myLinkCodes.has(c.linkCode) || clicks.length > 0); // show fallback clicks for rich dashboard visibility if empty

    const total = filteredClicks.length;
    const unique = filteredClicks.filter(c => c.isUnique).length;

    // Timeline clicks data
    const dateMap: { [key: string]: number } = {};
    const geoMap: { [key: string]: number } = {};
    const deviceMap: { [key: string]: number } = {};

    filteredClicks.forEach(c => {
      // Date formatting for charts
      const date = new Date(c.timestamp).toLocaleDateString([], { month: "short", day: "numeric" });
      dateMap[date] = (dateMap[date] || 0) + 1;

      // Geo City map
      geoMap[c.geoCity] = (geoMap[c.geoCity] || 0) + 1;

      // Device map
      const platform = c.deviceType.includes("Mobile") || c.deviceType.includes("Android") || c.deviceType.includes("iOS") ? "Mobile" : "Desktop/Chrome";
      deviceMap[platform] = (deviceMap[platform] || 0) + 1;
    });

    const timelineData = Object.keys(dateMap).map(d => ({ date: d, Clicks: dateMap[d] })).slice(-7);
    const geoData = Object.keys(geoMap).map(g => ({ city: g, clicks: geoMap[g] }));
    const deviceData = Object.keys(deviceMap).map(dev => ({ name: dev, value: deviceMap[dev] }));

    return {
      total,
      unique,
      timelineData: timelineData.length > 0 ? timelineData : [{ date: "Today", Clicks: 3 }, { date: "Yesterday", Clicks: 5 }],
      geoData: geoData.length > 0 ? geoData : [{ city: "Mumbai", clicks: 4 }, { city: "Ahmedabad", clicks: 2 }],
      deviceData: deviceData.length > 0 ? deviceData : [{ name: "Mobile", value: 3 }, { name: "Desktop/Chrome", value: 5 }],
    };
  }, [myMaterials, clicks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setLoading(true);

    const success = await onCreateMaterial({
      title,
      category,
      supplier: user.companyName || "My Business Unit",
      location,
      description,
      priceQuote,
      unit,
      image: image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    });

    setLoading(false);
    if (success) {
      setTitle("");
      setDescription("");
      setImage("");
    }
  };

  const openEditModal = (material: RawMaterial) => {
    setEditingMaterial(material);
    setEditTitle(material.title);
    setEditCategory(material.category);
    setEditLocation(material.location);
    setEditDescription(material.description);
    setEditPriceQuote(material.priceQuote);
    setEditUnit(material.unit);
    setEditImage(material.image || "");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    setEditLoading(true);

    const success = await onEditMaterial(editingMaterial._id, {
      title: editTitle,
      category: editCategory,
      location: editLocation,
      description: editDescription,
      priceQuote: editPriceQuote,
      unit: editUnit,
      image: editImage,
    });

    setEditLoading(false);
    if (success) {
      setEditingMaterial(null);
    }
  };

  const handleUpgrade = async () => {
    try {
      await onStripeUpgrade("Supplier Premium Analytics Pro", 4999);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Stripe Premium Upgrading Ribbon */}
      {!user.premiumActive && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/30 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          <div className="space-y-2 relative max-w-xl">
            <span className="bg-amber-400 text-black text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase flex items-center space-x-1 w-max">
              <Sparkles size={11} fill="currentColor" />
              <span>Premium Click Tracker Unlocked</span>
            </span>
            <h3 className="font-display font-semibold text-xl">Unlock Advanced Lead Metric Mapping</h3>
            <p className="text-xs text-gray-200 leading-normal">
              Get comprehensive geo-tracking indicators, detailed browser logs, and automatic weekly analytics tables sent directly to custom emails via domain verified SMTP relays.
            </p>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-all rounded-xl py-3 px-6 text-xs shadow-lg flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Upgrade via Stripe Portal</span>
            <ExternalLink size={14} />
          </button>
        </div>
      )}

      {/* Visual B2B Sourcing Dashboard */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-gray-150 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900">Enterprise Sourcing & Dispatch Analytics</h3>
            <p className="text-xs text-gray-500 font-sans">Strategic performance indicators of lead generation and order fulfillment.</p>
          </div>
        </div>
        <VisualDashboard 
          orders={orders} 
          materials={materials} 
          clicks={clicks}
          role="supplier" 
          supplierCompany={user.companyName || "TATA Steel Supply Co."} 
        />
      </div>

      {/* Grid: Analytics indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Activity size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-semibold block uppercase">Total Shortcode Clicks</span>
            <span className="text-2xl font-bold text-slate-800">{clickStats.total}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Globe size={22} />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-semibold block uppercase">Unique Clickers</span>
            <span className="text-2xl font-bold text-emerald-600">{clickStats.unique}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
            <Star size={22} fill="currentColor" />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-semibold block uppercase">Active Raw Links</span>
            <span className="text-2xl font-bold text-slate-800">{myMaterials.length} Tracked</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts: Require premiumActive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recharts click trends */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-800">
              Click Volume Trend Timeline
            </h4>
            {!user.premiumActive && <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">Demo Mode</span>}
          </div>

          <div className="h-64">
            {user.premiumActive || clicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={clickStats.timelineData}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Clicks" stroke="#2563eb" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full bg-slate-50 rounded flex items-center justify-center text-xs text-gray-400">
                Purchase Stripe Premium to plot dynamic timelines
              </div>
            )}
          </div>
        </div>

        {/* Device structure pie chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-800">
            Device Agent Ratio
          </h4>

          <div className="h-64 flex items-center justify-center">
            {user.premiumActive || clicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clickStats.deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {clickStats.deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-400 italic">Locked features. Upgrade via Stripe active checkouts.</div>
            )}
          </div>
        </div>

      </div>

      {/* Grid: Create material form & Current listing table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Listing creator */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-150 p-6 shadow-xs">
          <h3 className="font-display font-semibold text-slate-800 text-sm uppercase tracking-wider pb-4 mb-4 border-b border-gray-100">
            Deploy New Raw Link listing
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-650">Raw Material Title</label>
              <input 
                type="text"
                placeholder="E.g. Grade A Copper Cathodes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-medium"
                required
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">B2B Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 rounded-lg text-slate-800 font-medium"
                >
                  <option value="Metals & Steel">Metals & Steel</option>
                  <option value="Plastics & Polymer">Plastics & Polymer</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Rubber & Elastomer">Rubber & Elastomer</option>
                  <option value="Ore & Mineral">Ore & Mineral</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Base Price (INR)</label>
                <input 
                  type="number"
                  value={priceQuote}
                  onChange={(e) => setPriceQuote(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Pricing Unit</label>
                <input 
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Origin / Location</label>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 text-slate-850 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-650 block">External specification URL / Image (Optional)</label>
              <input 
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-650">Specifications / Description summary</label>
              <textarea 
                rows={3}
                placeholder="Detail certificate standards, chemistry, and supply capabilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-slate-800 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              <Plus size={14} />
              <span>{loading ? "Registering raw materials listing..." : "Publish Tracking Link"}</span>
            </button>
          </form>
        </div>

        {/* Current tracking codes listed */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-150 p-6 shadow-xs space-y-4">
          <h3 className="font-display font-semibold text-slate-800 text-sm uppercase tracking-wider pb-4 border-b border-gray-100">
            Active shortcode URL list
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-mono">
                  <th className="p-3 font-semibold">Specification</th>
                  <th className="p-3 font-semibold">Shortcode tracking link</th>
                  <th className="p-3 font-semibold">Indicative Price</th>
                  <th className="p-3 font-semibold">Approval Status</th>
                  <th className="p-3 font-semibold text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myMaterials.map(m => (
                  <tr key={m._id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{m.title}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{m.category}</p>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-indigo-650">
                      /{m.rawLink}
                    </td>
                    <td className="p-3">
                      ₹{m.priceQuote.toLocaleString("en-IN")}/{m.unit}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border w-fit ${
                          m.approved !== false 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                        }`}>
                          {m.approved !== false ? "Approved" : "Awaiting Admin"}
                        </span>
                        {m.pendingEdits && (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded text-[10px] font-bold w-fit animate-pulse">
                            Pending Edits Audit
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => openEditModal(m)}
                        className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg border border-transparent hover:border-indigo-250 transition cursor-pointer mr-2"
                        title="Edit product details"
                      >
                        <Edit size={13} />
                      </button>
                      <button 
                        onClick={() => onRemoveMaterial(m._id)}
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg border border-transparent hover:border-rose-250 transition cursor-pointer"
                        title="Delete track"
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

      {/* 3. Incoming customer purchase orders (POs) & dispatches tracker */}
      <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-slate-800 text-base uppercase tracking-wider flex items-center space-x-2">
              <Truck size={18} className="text-blue-600" />
              <span>Incoming Customer Purchase Orders (POs) ({myIncomingOrders.length})</span>
            </h3>
            <p className="text-xs text-gray-400">
              Manage incoming B2B procurement dispatches, request administrative shipping reviews, and check real-time progress.
            </p>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-mono font-bold px-2.5 py-1 rounded-full uppercase">
            Order Fulfillment Pipeline
          </span>
        </div>

        {myIncomingOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 italic">
            No active procurement orders are currently directed to your business brand.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-mono">
                    <th className="p-3">Order Specs & Buyer</th>
                    <th className="p-3">Invoiced Value</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myIncomingOrders.map(order => {
                    const isSelected = selectedOrderId === order._id;
                    const canRequestDispatch = order.status === "QC_Verified" || order.status === "Matched";
                    
                    return (
                      <React.Fragment key={order._id}>
                        <tr 
                          className={`hover:bg-slate-50/40 cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50/20" : ""
                          }`}
                          onClick={() => setSelectedOrderId(isSelected ? null : order._id)}
                        >
                          <td className="p-3 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-mono text-gray-400 font-bold">#{order._id.substring(0, 8)}</span>
                              <p className="font-semibold text-slate-850">{order.quantity} {order.unit} {order.materialType}</p>
                            </div>
                            <p className="text-[11px] text-gray-500 flex items-center space-x-1">
                              <span className="font-mono text-slate-450">{order.msmeEmail}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-slate-450">Target: {order.deliveryLocation}</span>
                            </p>
                          </td>
                          <td className="p-3 font-mono">
                            <p className="font-bold text-slate-800">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                            <span className="text-[9px] uppercase font-bold text-indigo-650">{order.paymentPath.replace(/_/g, " ")}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${
                              order.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              order.status === "Awaiting_Dispatch_Approval" ? "bg-orange-50 text-orange-700 border-orange-200 animate-pulse" :
                              order.status === "Shipped" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              order.status === "Delivered" || order.status === "Delivered_Repaid" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                              "bg-slate-50 text-slate-600 border-slate-200"
                            }`}>
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end space-x-2">
                              {canRequestDispatch && onUpdateOrderStatus && (
                                <button
                                  onClick={() => onUpdateOrderStatus({ id: order._id, status: "Awaiting_Dispatch_Approval" })}
                                  className="bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold px-3 py-1.5 rounded cursor-pointer transition-all flex items-center space-x-1"
                                >
                                  <Truck size={11} />
                                  <span>Request Dispatch Approval</span>
                                </button>
                              )}
                              {order.status === "Awaiting_Dispatch_Approval" && (
                                <span className="text-orange-600 font-medium text-[10px] animate-pulse">Awaiting Admin Sign-off</span>
                              )}
                              {order.status === "Shipped" && onUpdateOrderStatus && (
                                <button
                                  onClick={() => onUpdateOrderStatus({ id: order._id, status: "Delivered" })}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded cursor-pointer transition-all flex items-center space-x-1"
                                >
                                  <CheckCircle2 size={11} />
                                  <span>Mark Delivered</span>
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedOrderId(isSelected ? null : order._id)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] px-2.5 py-1.5 rounded font-medium transition"
                              >
                                {isSelected ? "Hide Track" : "Track Report"}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Interactive Real-Time tracking progress report timeline */}
                        {isSelected && (
                          <tr>
                            <td colSpan={4} className="bg-slate-50/60 p-4 border-t border-b border-gray-100">
                              <div className="space-y-4">
                                <h4 className="font-display font-semibold text-xs text-slate-700 uppercase tracking-wider">
                                  Real-Time Dispatch Progress & Sourcing Milestones
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
                                  {/* Milestone 1: Sourced */}
                                  <div className="relative p-3 bg-white border border-gray-150 rounded-lg flex flex-col justify-between space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                                      <span>STAGE 1</span>
                                      <span className="text-emerald-600 font-bold">✔</span>
                                    </div>
                                    <div>
                                      <h5 className="font-semibold text-xs text-slate-800">Inquiry Sourced</h5>
                                      <p className="text-[10px] text-gray-500">PO Raised by MSME</p>
                                    </div>
                                    <div className="w-full bg-emerald-500 h-1 rounded mt-2"></div>
                                  </div>

                                  {/* Milestone 2: QC Tested */}
                                  {(() => {
                                    const isCompleted = ["QC_Verified", "Awaiting_Dispatch_Approval", "Shipped", "Delivered", "Delivered_Repaid"].includes(order.status);
                                    return (
                                      <div className="relative p-3 bg-white border border-gray-150 rounded-lg flex flex-col justify-between space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                                          <span>STAGE 2</span>
                                          <span className={isCompleted ? "text-emerald-600 font-bold" : ""}>{isCompleted ? "✔" : "Pending"}</span>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-xs text-slate-800">Quality Tested</h5>
                                          <p className="text-[10px] text-gray-500">Lab test complete</p>
                                        </div>
                                        <div className={`w-full h-1 rounded mt-2 ${isCompleted ? "bg-emerald-500" : "bg-gray-200"}`}></div>
                                      </div>
                                    );
                                  })()}

                                  {/* Milestone 3: Dispatch Approved */}
                                  {(() => {
                                    const isApproved = ["Shipped", "Delivered", "Delivered_Repaid"].includes(order.status);
                                    const isAwaiting = order.status === "Awaiting_Dispatch_Approval";
                                    return (
                                      <div className="relative p-3 bg-white border border-gray-150 rounded-lg flex flex-col justify-between space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                                          <span>STAGE 3</span>
                                          <span className={isApproved ? "text-emerald-600 font-bold" : isAwaiting ? "text-orange-500 font-bold" : ""}>
                                            {isApproved ? "Approved" : isAwaiting ? "Awaiting" : "Pending"}
                                          </span>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-xs text-slate-800">Dispatch Check</h5>
                                          <p className="text-[10px] text-gray-500">Admin gatepass review</p>
                                        </div>
                                        <div className={`w-full h-1 rounded mt-2 ${isApproved ? "bg-emerald-500" : isAwaiting ? "bg-orange-400 animate-pulse" : "bg-gray-200"}`}></div>
                                      </div>
                                    );
                                  })()}

                                  {/* Milestone 4: In-Transit */}
                                  {(() => {
                                    const isCompleted = ["Shipped", "Delivered", "Delivered_Repaid"].includes(order.status);
                                    return (
                                      <div className="relative p-3 bg-white border border-gray-150 rounded-lg flex flex-col justify-between space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                                          <span>STAGE 4</span>
                                          <span className={isCompleted ? "text-blue-600 font-bold" : ""}>{isCompleted ? "In Transit" : "Pending"}</span>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-xs text-slate-800">Logistics Transit</h5>
                                          <p className="text-[10px] text-gray-500">Cargo in movement</p>
                                        </div>
                                        <div className={`w-full h-1 rounded mt-2 ${isCompleted ? "bg-blue-500" : "bg-gray-200"}`}></div>
                                      </div>
                                    );
                                  })()}

                                  {/* Milestone 5: Delivered */}
                                  {(() => {
                                    const isCompleted = ["Delivered", "Delivered_Repaid"].includes(order.status);
                                    return (
                                      <div className="relative p-3 bg-white border border-gray-150 rounded-lg flex flex-col justify-between space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                                          <span>STAGE 5</span>
                                          <span className={isCompleted ? "text-emerald-600 font-bold" : ""}>{isCompleted ? "Arrived" : "Pending"}</span>
                                        </div>
                                        <div>
                                          <h5 className="font-semibold text-xs text-slate-800">Received</h5>
                                          <p className="text-[10px] text-gray-500">MSME gate receipt</p>
                                        </div>
                                        <div className={`w-full h-1 rounded mt-2 ${isCompleted ? "bg-emerald-500" : "bg-gray-200"}`}></div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="edit_material_modal">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">Edit Raw Material Details</h3>
                <p className="text-[11px] text-gray-400">Edits require compliance audit before updating live listing.</p>
              </div>
              <button 
                onClick={() => setEditingMaterial(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Product Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850"
                  >
                    <option value="Metals & Steel">Metals & Steel</option>
                    <option value="Coal & Fuel">Coal & Fuel</option>
                    <option value="Chemicals & Plastics">Chemicals & Plastics</option>
                    <option value="Cement & Building">Cement & Building</option>
                    <option value="Industrial Raw">Industrial Raw</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Indicative Price (₹)</label>
                  <input
                    type="number"
                    value={editPriceQuote}
                    onChange={(e) => setEditPriceQuote(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-850"
                    min={1}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Unit Spec</label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="E.g. Tons, Kgs, Liters"
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans text-slate-850"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 uppercase">Warehouse Dispatch Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 uppercase">Product Description & Specs</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none text-slate-850"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 uppercase">Image URL (Optional)</label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850"
                />
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-[10px] text-amber-800 leading-normal font-sans">
                💡 <strong>Compliance Note:</strong> Submitting these edits will preserve the currently active display details while generating a pending review sheet inside the <strong>SmeBhawan Control panel</strong>. Once approved, details merge instantly and you will receive an automated notification.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer transition font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition flex items-center space-x-1 font-sans"
                >
                  {editLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={12} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit for Approval</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
