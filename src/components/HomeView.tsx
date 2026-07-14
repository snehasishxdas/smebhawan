import React, { useState, useMemo } from "react";
import { RawMaterial, User } from "../types";
import { 
  Search, MapPin, Tag, ShoppingBag, Plus, Star, StarHalf, FileSpreadsheet, 
  ChevronRight, ArrowRight, ClipboardCheck, Sparkles, AlertCircle, HelpCircle, Activity,
  X, CheckCircle
} from "lucide-react";
import SmebhawanLogo from "./SmebhawanLogo";

interface HomeViewProps {
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

export default function HomeView({
  user,
  materials,
  onSubmitRequest,
  onRegisterClick,
  onOpenAuth,
}: HomeViewProps) {
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
    <div className="flex flex-col space-y-12 pb-16">
      
      {/* 1. B2B Search Hero - Polished with smebhawan branding */}
      <section 
        className="relative bg-brand-blue/80 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=50')] bg-cover bg-center bg-blend-darken text-white py-14 px-4 md:py-20"
        style={{ backgroundBlendMode: "overlay" }}
        id="b2b_search_hero"
      >
        <div className="max-w-6xl mx-auto text-center space-y-8 relative">
          <div className="flex flex-col items-center space-y-4">
            <SmebhawanLogo variant="full" size="xl" lightText={true} className="mb-2" />
            <p className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto font-sans">
              Seamlessly Connecting India's MSME Procurement Pipelines — Build, Track, and Settle Together.
            </p>
          </div>

          {/* Search Card Container with multiple dropdowns */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl max-w-5xl mx-auto shadow-2xl border border-white/10 text-slate-900 grid grid-cols-1 md:grid-cols-4 gap-2.5">
            {/* Category selection */}
            <div className="bg-white rounded-xl px-3 py-2 flex items-center space-x-2 text-left shadow-xs">
              <Tag size={18} className="text-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">Category</span>
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full text-xs font-semibold focus:outline-none bg-transparent text-slate-800"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Material Name input */}
            <div className="bg-white rounded-xl px-3 py-2 flex items-center space-x-2 text-left shadow-xs">
              <Search size={18} className="text-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">Raw Material</span>
                <input 
                  type="text"
                  placeholder="Steel, plastics, etc."
                  value={searchMaterial}
                  onChange={(e) => setSearchMaterial(e.target.value)}
                  className="w-full text-xs font-medium focus:outline-none bg-transparent text-slate-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Location selector */}
            <div className="bg-white rounded-xl px-3 py-2 flex items-center space-x-2 text-left shadow-xs">
              <MapPin size={18} className="text-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">Location</span>
                <input 
                  type="text"
                  placeholder="Mumbai, Gujarat..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full text-xs font-medium focus:outline-none bg-transparent text-slate-800 placeholder-gray-400"
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
                className="flex-1 bg-slate-800/85 hover:bg-slate-900 text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                Clear
              </button>
              <button 
                onClick={() => {
                  setActiveSidebarCat("");
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-bold tracking-wide shadow-lg transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Banner Row: Blue and white categorization grid matching design screenshot */}
      <section className="bg-blue-900 text-white py-1.5 px-4 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs font-semibold gap-y-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSearchCategory("");
                setActiveSidebarCat(cat);
              }}
              className="hover:text-blue-300 transition px-2 py-1.5 rounded cursor-pointer whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
          <button 
            onClick={() => {
              setActiveSidebarCat("");
              setSearchCategory("");
            }}
            className="text-amber-400 hover:text-amber-300 transition"
          >
            View All Categories &gt;
          </button>
        </div>
      </section>

      {/* 3. Main Split Category-Browser Grid */}
      <section className="max-w-7xl w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: "Browse By Categories" Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="bg-blue-950 text-white p-4">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider">Browse By Categories</h3>
            </div>
            <nav className="flex flex-col divide-y divide-gray-100 font-sans">
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
                        ? "bg-blue-950 text-white font-semibold pl-4.5" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-blue-950"
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight size={14} className={isActive ? "text-amber-400" : "text-gray-400"} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Quote Widget */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <ClipboardCheck size={18} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Demand Registry</span>
            </div>
            <h4 className="font-display font-semibold text-base">Sourcing Custom Materials?</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>Submit Custom Request</span>
            </button>
          </div>
        </div>

        {/* Right Side: Active Catalog & Product Listings */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-wrap justify-between items-center border-b border-gray-200 pb-4 gap-y-2">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 flex items-center space-x-2">
                <span>Active Sourcing Directory</span>
                <span className="text-xs bg-slate-100 text-slate-600 font-mono font-normal px-2 py-0.5 rounded-full">
                  {filteredMaterials.length} Active Items
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {activeSidebarCat ? `Filtering listings classified under ${activeSidebarCat}` : "Showing all verified manufacturer materials"}
              </p>
            </div>
            
            {activeSidebarCat && (
              <button
                onClick={() => setActiveSidebarCat("")}
                className="text-xs text-blue-600 hover:underline font-semibold bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200"
              >
                Clear category filter
              </button>
            )}
          </div>

          {/* Fallback Empty */}
          {filteredMaterials.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">No raw material listings matched</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Try clearing your search query or choosing another category in the sidebar directory.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMaterials.map(m => (
                <div 
                  key={m._id}
                  className="bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all overflow-hidden flex flex-col group justify-between"
                >
                  {/* Product Header Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
                    <img 
                      src={m.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    
                    {/* India Origin Tag */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-slate-900 border border-gray-200 flex items-center space-x-1 shadow-sm">
                      <span className="w-2.5 h-1.5 bg-orange-500 inline-block"></span>
                      <span className="w-2.5 h-1.5 bg-white border-y border-gray-300 inline-block"></span>
                      <span className="w-2.5 h-1.5 bg-emerald-600 inline-block"></span>
                      <span className="pl-1">IN ORIGIN</span>
                    </div>

                    {/* Premium Sold Lock Overlay */}
                    {m.isSold && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-center items-center text-center p-3 text-white">
                        <ShoppingBag className="text-amber-400 mb-1" size={24} />
                        <span className="text-xs font-bold uppercase tracking-wider">Premium Sold Item</span>
                        <span className="text-[10px] text-gray-300 px-2 mt-0.5">Contact supplier via dynamic analytics link to request fresh capacity</span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono tracking-wider font-semibold text-gray-400 uppercase">
                        <span>{m.category}</span>
                        <div className="flex items-center space-x-0.5 text-amber-500">
                          <Star size={10} fill="currentColor" />
                          <span className="font-sans font-bold text-slate-700">{m.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-display font-semibold text-sm text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition">
                        {m.title}
                      </h3>
                      
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Price Tag */}
                      <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium uppercase">Indicative Rate B2B</span>
                          <span className="text-sm font-semibold text-slate-800">₹{m.priceQuote.toLocaleString("en-IN")}</span>
                          <span className="text-xs text-gray-500 font-mono font-medium"> / {m.unit}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block font-medium uppercase">Supplier</span>
                          <span className="text-xs font-semibold text-slate-600 truncate max-w-[130px] inline-block">{m.supplier}</span>
                        </div>
                      </div>

                      {/* Location Badge */}
                      <div className="flex items-center space-x-1 text-gray-500 text-[11px]">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate">{m.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Interactive Link Footer */}
                  <div className="p-4 bg-slate-50 border-t border-gray-100 flex gap-2">
                    {/* "Sourcing Dynamic link" - REGISTER metric on click! */}
                    <a
                      href={`#lead_details_${m._id}`}
                      onClick={() => {
                        onRegisterClick(m.rawLink, m._id);
                      }}
                      className="flex-1 bg-white hover:bg-slate-10 relative border border-gray-200 hover:border-gray-300 text-slate-700 rounded-lg py-2 text-xs font-semibold transition text-center flex items-center justify-center space-x-1 focus:ring cursor-pointer"
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
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-xs font-bold shadow-xs transition cursor-pointer"
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
        <div className="fixed inset-0 bg-brand-blue/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <h4 className="font-display font-semibold text-base">MSME Sourcing Commitment</h4>
                <p className="text-[11px] text-gray-400 mt-1">Order verification & pre-approved credit setup</p>
              </div>
              <button 
                onClick={() => setInquiryMaterial(null)}
                className="text-gray-400 hover:text-white"
              >
                <ChevronRight size={20} className="rotate-95" />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="p-5 space-y-4">
              
              {submitSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-center space-y-2">
                  <CheckCircle size={28} className="mx-auto text-emerald-600" />
                  <h5 className="font-semibold text-sm">Dispatched Sourcing Order Logging!</h5>
                  <p className="text-[11px]">Emails sent to custom domains via verified SMTP channels.</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Product Spec</span>
                    <strong className="text-xs text-slate-800 block line-clamp-1">{inquiryMaterial.title}</strong>
                    <p className="text-[11px] text-slate-500">Unit base price: ₹{inquiryMaterial.priceQuote.toLocaleString()}/{inquiryMaterial.unit}</p>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">Required B2B Volume ({inquiryMaterial.unit})</label>
                    <input 
                      type="number"
                      value={inquiryQty}
                      onChange={(e) => setInquiryQty(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Shipping address */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">Delivery Sourcing Destination</label>
                    <input 
                      type="text"
                      placeholder="E.g. JNP Navy Port, Maharashtra"
                      value={inquiryLocation}
                      onChange={(e) => setInquiryLocation(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Path Selection: Direct (A) vs Credit (B) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 block">Sourcing Settle Path</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathA_Direct")}
                        className={`p-2.5 rounded-lg border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathA_Direct"
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span>Path A: Direct</span>
                        <span className="text-[9px] text-gray-500 font-normal">RTGS upfront (2% Com)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathB_Credit")}
                        className={`p-2.5 rounded-lg border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathB_Credit"
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span>Path B: Credit</span>
                        <span className="text-[9px] text-gray-500 font-normal">30-day (16% p.a. interest)</span>
                      </button>
                    </div>
                  </div>

                  {/* Calculations summary */}
                  <div className="p-3 bg-blue-50/50 rounded-lg text-xs space-y-1.5 ring-1 ring-blue-100">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Invoice:</span>
                      <strong className="text-slate-800">₹{(inquiryQty * inquiryMaterial.priceQuote).toLocaleString('en-IN')} INR</strong>
                    </div>
                    {paymentPath === "PathB_Credit" && (
                      <div className="flex justify-between text-indigo-700">
                        <span>Path B Interest Cap (30 days):</span>
                        <strong>₹{Math.round((inquiryQty * inquiryMaterial.priceQuote) * 0.16 * 30 / 365).toLocaleString('en-IN')} INR</strong>
                      </div>
                    )}
                  </div>

                  {/* Submission */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-xs font-semibold tracking-wide shadow transition cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 bg-brand-blue/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            <div className="bg-indigo-950 text-white p-5 flex justify-between items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 to-slate-950">
              <div>
                <h4 className="font-display font-semibold text-base flex items-center space-x-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Submit Sourcing Call</span>
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">Multi-Supplier B2B Sourcing Demands</p>
              </div>
              <button 
                onClick={() => setShowCustomForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCustomRequestSubmit} className="p-5 space-y-4">
              {submitSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-center space-y-2">
                  <CheckCircle size={28} className="mx-auto text-emerald-600" />
                  <h5 className="font-semibold text-sm">Dispatched B2B Custom Inquiry!</h5>
                  <p className="text-[11px]">Sellers are notified of incoming specifications securely.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">Required Product Specification / Name</label>
                    <input 
                      type="text"
                      placeholder="E.g. Cold Rolled Industrial Steel sheets (CRCA)"
                      value={customMaterial}
                      onChange={(e) => setCustomMaterial(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 block">Quantity Needed</label>
                      <input 
                        type="number"
                        value={customQty}
                        onChange={(e) => setCustomQty(Math.max(1, Number(e.target.value)))}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 block">Unit</label>
                      <select 
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800"
                      >
                        <option value="Tons">Tons</option>
                        <option value="Kg">Kg</option>
                        <option value="Cubic Metres">Cubic Metres</option>
                        <option value="Litres">Litres</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">Target Settle Strategy</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathA_Direct")}
                        className={`p-2.5 rounded-lg border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathA_Direct"
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span>Path A: Direct</span>
                        <span className="text-[9px] text-gray-400 font-normal">RTGS upfront (2% Com)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentPath("PathB_Credit")}
                        className={`p-2.5 rounded-lg border text-xs text-left flex flex-col justify-between transition cursor-pointer ${
                          paymentPath === "PathB_Credit"
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span>Path B: Credit</span>
                        <span className="text-[9px] text-gray-400 font-normal">30-day (16% p.a. interest)</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">Required Sourcing Budget Range</label>
                    <input 
                      type="text"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      placeholder="E.g. ₹10,00,000 - ₹20,00,000"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">Shipment Location Target</label>
                    <input 
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="E.g. Jaipur Steel Yard, Rajasthan"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-xs font-semibold tracking-wide shadow cursor-pointer disabled:opacity-50"
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
