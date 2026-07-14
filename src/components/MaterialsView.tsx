import React, { useState, useMemo } from "react";
import { RawMaterial, User } from "../types";
import { 
  Search, MapPin, Tag, ShoppingBag, Plus, Star, ChevronRight, ArrowRight, 
  ClipboardCheck, Sparkles, Activity, X, CheckCircle
} from "lucide-react";

interface MaterialsViewProps {
  user: User | null;
  materials: RawMaterial[];
  onSubmitRequest: (reqData: any) => Promise<boolean>;
  onRegisterClick: (rawLinkSlug: string, materialId: string) => void;
  onOpenAuth: (mode: "login" | "register") => void;
}

const CATEGORIES = [
  "Plastics & Polymer",
  "Chemicals",
  "Pesticides & Insecticide",
  "Ore & Mineral",
  "Rubber & Elastomer",
  "Pharmaceuticals & Drug",
  "Paints",
  "Metals & Steel",
  "Yarn & Fibre",
];

const SIDEBAR_CATEGORIES = [
  "Metals & Steel",
  "Agro",
  "Oil & Gas",
  "Paper & Pulp",
  "Pharmaceuticals & Drug",
  "Chemicals",
  "Construction",
  "Cosmetics & Perfume",
];

export default function MaterialsView({
  user,
  materials,
  onSubmitRequest,
  onRegisterClick,
  onOpenAuth,
}: MaterialsViewProps) {
  // Search parameters
  const [searchCategory, setSearchCategory] = useState("");
  const [searchMaterial, setSearchMaterial] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  
  // Selected Sidebar Category for filtering
  const [activeSidebarCat, setActiveSidebarCat] = useState("Metals & Steel");
  
  // Sourcing Inquiry Modal state
  const [inquiryMaterial, setInquiryMaterial] = useState<RawMaterial | null>(null);
  const [inquiryQty, setInquiryQty] = useState(10);
  const [inquiryLocation, setInquiryLocation] = useState("");
  const [paymentPath, setPaymentPath] = useState<"PathA_Direct" | "PathB_Credit">("PathA_Direct");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New custom generic request form states
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMaterial, setCustomMaterial] = useState("");
  const [customQty, setCustomQty] = useState(25);
  const [customUnit, setCustomUnit] = useState("Tons");
  const [customLocation, setCustomLocation] = useState("");
  const [customBudget, setCustomBudget] = useState("₹15,00,000 - ₹30,00,000");

  // Query filter on materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchCat = searchCategory 
        ? m.category.toLowerCase().includes(searchCategory.toLowerCase())
        : activeSidebarCat 
          ? m.category.toLowerCase() === activeSidebarCat.toLowerCase()
          : true;

      const matchName = searchMaterial
        ? m.title.toLowerCase().includes(searchMaterial.toLowerCase()) || 
          m.description.toLowerCase().includes(searchMaterial.toLowerCase())
        : true;

      const matchLoc = searchLocation
        ? m.location.toLowerCase().includes(searchLocation.toLowerCase())
        : true;

      return matchCat && matchName && matchLoc && (m.approved !== false);
    });
  }, [materials, searchCategory, searchMaterial, searchLocation, activeSidebarCat]);

  // Handle inquiry submission
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMaterial) return;
    
    setSubmitting(true);
    const amount = inquiryQty * inquiryMaterial.priceQuote;
    
    const success = await onSubmitRequest({
      materialType: inquiryMaterial.title,
      quantity: inquiryQty,
      unit: inquiryMaterial.unit,
      deliveryLocation: inquiryLocation || "Mumbai Port",
      budgetRange: `₹${(amount * 0.95).toLocaleString('en-IN')} - ₹${(amount * 1.05).toLocaleString('en-IN')}`,
      paymentPath,
      totalAmount: amount,
      supplierName: inquiryMaterial.supplier,
    });

    setSubmitting(false);
    if (success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setInquiryMaterial(null);
      }, 3000);
    }
  };

  const handleCustomRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMaterial || !customQty) return;

    setSubmitting(true);
    const mockRate = 60000; // generic B2B estimate
    const amount = customQty * mockRate;

    const success = await onSubmitRequest({
      materialType: customMaterial,
      quantity: customQty,
      unit: customUnit,
      deliveryLocation: customLocation || "New Delhi Hub",
      budgetRange: customBudget,
      paymentPath,
      totalAmount: amount,
      supplierName: "Pending Sourcing Match",
    });

    setSubmitting(false);
    if (success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowCustomForm(false);
        setCustomMaterial("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col space-y-8 pb-16 bg-transparent text-slate-100 min-h-screen">
      
      {/* 1. Header Toolbar / Top Section - Dedicated Search Panel */}
      <section className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold font-condensed tracking-wide text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <span>National Materials Sourcing Directory</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans max-w-xl">
              Search through thousands of live verified industrial manufacturer listing endpoints across India.
            </p>
          </div>

          {/* Search Card Container with multiple dropdowns */}
          <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl max-w-6xl mx-auto shadow-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5">
            {/* Category selection */}
            <div className="bg-slate-950 rounded-xl px-3 py-2 flex items-center space-x-2 text-left border border-slate-800 shadow-inner">
              <Tag size={16} className="text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider font-mono">Category</span>
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full text-xs font-semibold focus:outline-none bg-transparent text-slate-200 border-none cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-slate-200">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-950 text-slate-200">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Material Name input */}
            <div className="bg-slate-950 rounded-xl px-3 py-2 flex items-center space-x-2 text-left border border-slate-800 shadow-inner">
              <Search size={16} className="text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider font-mono">Raw Material</span>
                <input 
                  type="text"
                  placeholder="Steel, plastics, etc."
                  value={searchMaterial}
                  onChange={(e) => setSearchMaterial(e.target.value)}
                  className="w-full text-xs font-medium focus:outline-none bg-transparent text-slate-200 placeholder-slate-600 border-none"
                />
              </div>
            </div>

            {/* Location selector */}
            <div className="bg-slate-950 rounded-xl px-3 py-2 flex items-center space-x-2 text-left border border-slate-800 shadow-inner">
              <MapPin size={16} className="text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider font-mono">Location</span>
                <input 
                  type="text"
                  placeholder="Mumbai, Gujarat..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full text-xs font-medium focus:outline-none bg-transparent text-slate-200 placeholder-slate-600 border-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setSearchCategory("");
                  setSearchMaterial("");
                  setSearchLocation("");
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl py-3.5 text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer border border-slate-700"
              >
                Clear
              </button>
              <button 
                onClick={() => {
                  setActiveSidebarCat("");
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 text-xs font-bold tracking-wide shadow-lg hover:shadow-glow-blue transition flex items-center justify-center space-x-1 cursor-pointer border border-blue-500/50"
              >
                <span>Search</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Banner Row: Categories Navigation */}
      <section className="bg-slate-950/40 border-y border-slate-900 text-white py-2 px-4 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs font-semibold gap-y-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSearchCategory("");
                setActiveSidebarCat(cat);
              }}
              className={`hover:text-amber-500 transition px-2.5 py-1.5 rounded-lg cursor-pointer whitespace-nowrap text-[11px] ${
                activeSidebarCat.toLowerCase() === cat.toLowerCase()
                  ? "bg-slate-900 border border-slate-800 text-amber-500 font-bold"
                  : "text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
          <button 
            onClick={() => {
              setActiveSidebarCat("");
              setSearchCategory("");
            }}
            className="text-amber-500 hover:text-amber-400 transition cursor-pointer text-[11px] pl-2 font-bold"
          >
            View All Categories &gt;
          </button>
        </div>
      </section>

      {/* 3. Main Split Category-Browser Grid */}
      <section className="max-w-7xl w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Left Side: "Browse By Categories" Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-950/80 rounded-3xl border border-slate-900 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-950 p-4">
              <h3 className="font-condensed font-bold text-sm tracking-wider text-slate-300">Browse By Categories</h3>
            </div>
            <nav className="flex flex-col divide-y divide-slate-900/60 font-sans">
              {SIDEBAR_CATEGORIES.map(cat => {
                const isActive = activeSidebarCat.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchCategory("");
                      setActiveSidebarCat(cat);
                    }}
                    className={`p-3.5 text-left text-xs font-medium transition flex justify-between items-center cursor-pointer ${
                      isActive 
                        ? "bg-slate-900/80 text-amber-500 font-bold border-l-4 border-l-amber-500 pl-4.5" 
                        : "text-slate-400 hover:bg-slate-900/40 hover:text-slate-200"
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight size={14} className={isActive ? "text-amber-500" : "text-slate-600"} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Quote Widget */}
          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <ClipboardCheck size={18} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Demand Registry</span>
            </div>
            <h4 className="font-condensed font-bold text-base text-white tracking-wide">Sourcing Custom Materials?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If an item is not found in our live active supplier directory, submit a general procurement challenge to trigger automatic broker matching processes.
            </p>
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth("register");
                } else {
                  setShowCustomForm(true);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer border border-blue-500/30 shadow-md"
            >
              <Plus size={14} />
              <span>Submit Custom Request</span>
            </button>
          </div>
        </div>

        {/* Right Side: Active Catalog & Product Listings */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-wrap justify-between items-center border-b border-slate-900 pb-4 gap-y-2">
            <div>
              <h2 className="text-2xl font-condensed font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Active Sourcing Directory</span>
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono font-normal px-2 py-0.5 rounded-full">
                  {filteredMaterials.length} Active Items
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                {activeSidebarCat ? `Filtering listings classified under ${activeSidebarCat}` : "Showing all verified manufacturer materials"}
              </p>
            </div>
            
            {activeSidebarCat && (
              <button
                onClick={() => setActiveSidebarCat("")}
                className="text-xs text-blue-400 hover:underline font-semibold bg-slate-950 border border-slate-900 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                Clear category filter
              </button>
            )}
          </div>

          {/* Fallback Empty */}
          {filteredMaterials.length === 0 ? (
            <div className="p-12 text-center bg-slate-950 border border-slate-900 rounded-3xl flex flex-col items-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Search size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">No raw material listings matched</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search query or choosing another category in the sidebar directory.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMaterials.map(m => (
                <div 
                  key={m._id}
                  className="bg-slate-950 rounded-3xl border border-slate-900 shadow-xl hover:shadow-glow-blue hover:border-blue-500/20 transition-all duration-300 overflow-hidden flex flex-col group justify-between"
                >
                  {/* Product Header Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={m.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                    />
                    
                    {/* India Origin Tag */}
                    <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-semibold text-slate-200 border border-slate-800 flex items-center space-x-1 shadow-sm">
                      <span className="w-2.5 h-1.5 bg-orange-500 inline-block"></span>
                      <span className="w-2.5 h-1.5 bg-white border-y border-gray-300 inline-block"></span>
                      <span className="w-2.5 h-1.5 bg-emerald-600 inline-block"></span>
                      <span className="pl-1">IN ORIGIN</span>
                    </div>

                    {/* Premium Sold Lock Overlay */}
                    {m.isSold && (
                      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col justify-center items-center text-center p-3 text-white">
                        <ShoppingBag className="text-amber-500 mb-1" size={24} />
                        <span className="text-xs font-bold uppercase tracking-wider">Premium Sold Item</span>
                        <span className="text-[9px] text-slate-400 px-2 mt-0.5">Contact supplier via dynamic analytics link to request fresh capacity</span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] font-mono tracking-wider font-semibold text-slate-500 uppercase">
                        <span>{m.category}</span>
                        <div className="flex items-center space-x-0.5 text-amber-500">
                          <Star size={10} fill="currentColor" />
                          <span className="font-sans font-bold text-slate-300">{m.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-condensed font-bold text-base text-slate-100 line-clamp-2 min-h-[40px] group-hover:text-amber-500 transition">
                        {m.title}
                      </h3>
                      
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Price Tag */}
                      <div className="flex justify-between items-end border-t border-slate-900 pt-3">
                        <div>
                          <span className="text-[9px] text-slate-500 block font-medium uppercase font-mono">Indicative Rate B2B</span>
                          <span className="text-sm font-semibold text-white">₹{m.priceQuote.toLocaleString("en-IN")}</span>
                          <span className="text-[11px] text-slate-500 font-mono font-medium"> / {m.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 block font-medium uppercase font-mono">Supplier</span>
                          <span className="text-xs font-semibold text-slate-300 truncate max-w-[130px] inline-block">{m.supplier}</span>
                        </div>
                      </div>

                      {/* Location Badge */}
                      <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                        <MapPin size={12} className="text-slate-500 shrink-0" />
                        <span className="truncate">{m.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Interactive Link Footer */}
                  <div className="p-4 bg-slate-900/30 border-t border-slate-900 flex gap-2">
                    {/* "Sourcing Dynamic link" - REGISTER metric on click! */}
                    <a
                      href={`#lead_details_${m._id}`}
                      onClick={() => {
                        onRegisterClick(m.rawLink, m._id);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-800/85 relative border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl py-2 text-xs font-semibold transition text-center flex items-center justify-center space-x-1 focus:ring cursor-pointer"
                      title="Follow supplier external product website"
                    >
                      <Activity size={12} className="text-emerald-500 animate-pulse" />
                      <span>Follow Sourcing Link</span>
                    </a>

                    <button
                      onClick={() => {
                        if (!user) {
                          onOpenAuth("register");
                        } else {
                          setInquiryQty(10);
                          setInquiryLocation(m.location);
                          setInquiryMaterial(m);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-2 text-xs font-bold shadow-xs hover:shadow-glow-blue border border-blue-500/20 transition cursor-pointer"
                    >
                      Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Active Sourcing Inquiry Modal */}
      {inquiryMaterial && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-950 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-900">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-950">
              <div>
                <h4 className="font-condensed font-bold text-base tracking-wide text-white">MSME Sourcing Commitment</h4>
                <p className="text-[10px] text-slate-400 mt-1">Order verification & pre-approved credit setup</p>
              </div>
              <button 
                onClick={() => setInquiryMaterial(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="p-5 space-y-4">
              
              {submitSuccess ? (
                <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-xl text-center space-y-2">
                  <CheckCircle size={28} className="mx-auto text-emerald-500" />
                  <h5 className="font-semibold text-xs">Dispatched Sourcing Order Logging!</h5>
                  <p className="text-[10px]">Emails sent to custom domains via verified SMTP channels.</p>
                </div>
              ) : (
                <>
                  <div className="p-3.5 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                    <span className="text-[8px] font-bold text-slate-500 block uppercase font-mono">Product Spec</span>
                    <strong className="text-xs text-white block line-clamp-1">{inquiryMaterial.title}</strong>
                    <p className="text-[11px] text-slate-400">Unit base price: ₹{inquiryMaterial.priceQuote.toLocaleString()}/{inquiryMaterial.unit}</p>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Required B2B Volume ({inquiryMaterial.unit})</label>
                    <input 
                      type="number"
                      value={inquiryQty}
                      onChange={(e) => setInquiryQty(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Shipping address */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Delivery Sourcing Destination</label>
                    <input 
                      type="text"
                      placeholder="E.g. JNP Navy Port, Maharashtra"
                      value={inquiryLocation}
                      onChange={(e) => setInquiryLocation(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Path Selection: Direct (A) vs Credit (B) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">Sourcing Settle Path</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathA_Direct")}
                        className={`p-2.5 rounded-xl border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathA_Direct"
                            ? "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold shadow-glow-blue"
                            : "border-slate-850 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span>Path A: Direct</span>
                        <span className="text-[9px] text-slate-500 font-normal">RTGS upfront (2% Com)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathB_Credit")}
                        className={`p-2.5 rounded-xl border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathB_Credit"
                            ? "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold shadow-glow-blue"
                            : "border-slate-850 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span>Path B: Credit</span>
                        <span className="text-[9px] text-slate-500 font-normal">30-day (16% p.a. interest)</span>
                      </button>
                    </div>
                  </div>

                  {/* Calculations summary */}
                  <div className="p-3.5 bg-slate-900/60 rounded-xl text-xs space-y-1.5 border border-slate-850">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Invoice:</span>
                      <strong className="text-white">₹{(inquiryQty * inquiryMaterial.priceQuote).toLocaleString('en-IN')} INR</strong>
                    </div>
                    {paymentPath === "PathB_Credit" && (
                      <div className="flex justify-between text-blue-400">
                        <span>Path B Interest Cap (30 days):</span>
                        <strong>₹{Math.round((inquiryQty * inquiryMaterial.priceQuote) * 0.16 * 30 / 365).toLocaleString('en-IN')} INR</strong>
                      </div>
                    )}
                  </div>

                  {/* Submission */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-semibold tracking-wide shadow-lg border border-blue-500/30 transition cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Processing Order Flow..." : "Confirm & Send Purchase Order (PO)"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 5. Custom Raw Material Sourcing Modal Form */}
      {showCustomForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-950 border border-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-950">
              <div>
                <h4 className="font-condensed font-bold text-base tracking-wide text-white flex items-center space-x-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Submit Sourcing Call</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Multi-Supplier B2B Sourcing Demands</p>
              </div>
              <button 
                onClick={() => setShowCustomForm(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCustomRequestSubmit} className="p-5 space-y-4">
              {submitSuccess ? (
                <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-xl text-center space-y-2">
                  <CheckCircle size={28} className="mx-auto text-emerald-500" />
                  <h5 className="font-semibold text-xs">Dispatched B2B Custom Inquiry!</h5>
                  <p className="text-[10px]">Sellers are notified of incoming specifications securely.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Required Product Specification / Name</label>
                    <input 
                      type="text"
                      placeholder="E.g. Cold Rolled Industrial Steel sheets (CRCA)"
                      value={customMaterial}
                      onChange={(e) => setCustomMaterial(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">Quantity Needed</label>
                      <input 
                        type="number"
                        value={customQty}
                        onChange={(e) => setCustomQty(Math.max(1, Number(e.target.value)))}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">Unit</label>
                      <select 
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="Tons" className="bg-slate-950">Tons</option>
                        <option value="Kg" className="bg-slate-950">Kg</option>
                        <option value="Cubic Metres" className="bg-slate-950">Cubic Metres</option>
                        <option value="Litres" className="bg-slate-950">Litres</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Target Settle Strategy</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathA_Direct")}
                        className={`p-2.5 rounded-xl border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathA_Direct"
                            ? "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold shadow-glow-blue"
                            : "border-slate-850 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span>Path A: Direct</span>
                        <span className="text-[9px] text-slate-500 font-normal">RTGS upfront (2% Com)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathB_Credit")}
                        className={`p-2.5 rounded-xl border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathB_Credit"
                            ? "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold shadow-glow-blue"
                            : "border-slate-850 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span>Path B: Credit</span>
                        <span className="text-[9px] text-slate-500 font-normal">30-day (16% p.a. interest)</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Required Sourcing Budget Range</label>
                    <input 
                      type="text"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      placeholder="E.g. ₹10,00,000 - ₹20,00,000"
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Shipment Location Target</label>
                    <input 
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="E.g. Jaipur Steel Yard, Rajasthan"
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-semibold tracking-wide shadow-lg border border-blue-500/30 transition cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Broadcasting SPEC requirements..." : "Broadcast Spec To Verified Suppliers"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
