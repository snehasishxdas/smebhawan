import React, { useState } from "react";
import SmebhawanLogo from "./SmebhawanLogo";
import { ArrowDown, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Cpu, Truck, LayoutGrid, Building, Info, FileCode, Star, ChevronRight } from "lucide-react";

interface HomeLandingProps {
  onExploreMaterials: () => void;
}

export default function HomeLanding({ onExploreMaterials }: HomeLandingProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col bg-transparent min-h-screen text-slate-100 font-sans">
      
      {/* 1. Full Screen Hero Section */}
      <section 
        className="relative h-[95vh] md:h-screen w-full flex items-center justify-center overflow-hidden border-b border-slate-900"
        id="hero-section"
      >
        {/* Background Overlay - transparent to show the global fixed background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/40"></div>

        {/* Outer cockpit border overlay */}
        <div className="absolute inset-0 border-[16px] border-slate-950/20 pointer-events-none z-20"></div>

        {/* Main Grid: Left Nav Stack, Center Content, Right HUD */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12">
          
          {/* LEFT SIDE: Vertical Stack Navigation (Inspired by Synchronicity) */}
          <div className="lg:col-span-3 flex flex-col space-y-3.5 order-2 lg:order-1 items-stretch max-w-xs mx-auto lg:mx-0 w-full">
            <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest pl-4 font-mono">
              Quick Directory
            </span>
            
            <button
              onClick={onExploreMaterials}
              className="group px-5 py-4 bg-slate-900/60 hover:bg-slate-800/80 text-white rounded-2xl border border-slate-800 hover:border-blue-500/40 backdrop-blur-md transition duration-300 flex items-center justify-between cursor-pointer text-left shadow-sm hover:shadow-glow-blue"
            >
              <div className="flex items-center space-x-3">
                <LayoutGrid size={18} className="text-blue-400 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold tracking-wide">All Materials</span>
              </div>
              <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md">LIVE</span>
            </button>

            <button
              onClick={() => scrollToSection("about-section", "about")}
              className={`group px-5 py-4 rounded-2xl border backdrop-blur-md transition duration-300 flex items-center justify-between cursor-pointer text-left shadow-sm ${
                activeTab === "about"
                  ? "bg-blue-600/90 border-blue-500 text-white shadow-glow-blue"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Info size={18} className={activeTab === "about" ? "text-white" : "text-blue-400"} />
                <span className="text-xs font-semibold tracking-wide">About Portal</span>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => scrollToSection("contact-section", "contact")}
              className={`group px-5 py-4 rounded-2xl border backdrop-blur-md transition duration-300 flex items-center justify-between cursor-pointer text-left shadow-sm ${
                activeTab === "contact"
                  ? "bg-blue-600/90 border-blue-500 text-white shadow-glow-blue"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building size={18} className={activeTab === "contact" ? "text-white" : "text-blue-400"} />
                <span className="text-xs font-semibold tracking-wide">Contact Secretariat</span>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => scrollToSection("about-section", "stats")}
              className="group px-5 py-4 bg-slate-900/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-slate-700 backdrop-blur-md transition duration-300 flex items-center justify-between cursor-pointer text-left shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <FileCode size={18} className="text-blue-400" />
                <span className="text-xs font-semibold tracking-wide">Live Statistics</span>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* CENTER: Main Title & Text (Inspired by Ignitia style soft blue glow overlay) */}
          <div className="lg:col-span-5 text-center space-y-6 order-1 lg:order-2">
            <div className="flex justify-center">
              <SmebhawanLogo variant="full" size="lg" lightText={true} />
            </div>

            {/* Glowing Main Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-tight text-glow-blue">
                SMEBHAWAN
              </h1>
              <p className="text-xs md:text-sm font-bold text-amber-500 uppercase tracking-widest font-mono">
                National MSME Infrastructure Portal
              </p>
            </div>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-md mx-auto font-sans">
              Connecting India's manufacturing corridor. Link suppliers, trigger verified SMTP reports, and unlock Path B sandbox credit lines of ₹50,00,000 INR directly.
            </p>

            <div className="flex justify-center pt-2">
              <button
                onClick={onExploreMaterials}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-glow-blue transition duration-300 cursor-pointer flex items-center gap-2 border border-blue-500/50"
              >
                <span>Browse Directory</span>
                <ArrowDown size={14} className="-rotate-90" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: HUD Status Monitor (Inspired by Ignitia countdown widget layout) */}
          <div className="lg:col-span-4 order-3 flex justify-center lg:justify-end w-full">
            <div className="bg-slate-950/80 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition duration-500">
              {/* Corner Cyber HUD graphics */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/30"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/30"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <span className="text-[10px] font-mono font-bold text-blue-400 tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    LOGISTICS MONITOR ACTIVE
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">VER. 2.0</span>
                </div>

                {/* Cyber HUD Parameters Stack */}
                <div className="space-y-3 font-mono">
                  
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">GSTIN MANUFACTURERS</span>
                    <strong className="text-xs text-emerald-400 tracking-wide">100% AUDITED</strong>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">SANDBOX CREDIT LIMIT</span>
                    <strong className="text-xs text-amber-500 tracking-wide">₹50,00,000</strong>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">SMTP LOG GATEWAY</span>
                    <strong className="text-xs text-blue-400 tracking-wide">ONLINE</strong>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">DATABASE INTEGRITY</span>
                    <strong className="text-xs text-slate-200 tracking-wide">SECURE COIL</strong>
                  </div>

                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>LAST BLOCK AUTHENTICATED</span>
                  <span className="text-amber-500/90 font-bold">ACTIVE SYSTEM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Down Indicator */}
        <button 
          onClick={() => scrollToSection("about-section", "about")}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 text-slate-500 hover:text-white transition duration-300 cursor-pointer animate-bounce"
        >
          <ArrowDown size={24} />
        </button>
      </section>

      {/* 2. About Section */}
      <section 
        className="py-24 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-900 scroll-mt-16"
        id="about-section"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">About SmeBhawan</span>
            <h2 className="text-3xl font-bold font-display text-white text-glow-blue">
              Empowering Indian MSMEs with Transparency
            </h2>
            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full"></div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              SmeBhawan is a national B2B infrastructure portal designed to support small and medium enterprises. By providing direct tracking links, compliance checks, and secure credit lines, we make raw material procurement hassle-free.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-900 space-y-4 hover:border-blue-500/20 transition duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Cpu size={22} />
              </div>
              <h3 className="text-base font-bold text-white font-display">Automated Smart Sourcing</h3>
              <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">
                Browse verified manufacturer listings with fully integrated real-time dynamic clicks tracking. Monitor direct lead interactions instantly.
              </p>
            </div>

            <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-900 space-y-4 hover:border-amber-500/20 transition duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-base font-bold text-white font-display">Verified Payment Pathways</h3>
              <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">
                Choose between Path A for instant RTGS wire clearing or leverage Path B for sandbox-backed interest-bearing credit facilities up to ₹50,00,000 INR.
              </p>
            </div>

            <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-900 space-y-4 hover:border-blue-500/20 transition duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Truck size={22} />
              </div>
              <h3 className="text-base font-bold text-white font-display">SMTP-Aligned Logistics</h3>
              <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">
                Gain continuous automated updates. All buyer orders and compliance modifications trigger immediate dispatch confirmations directly to corporate mail servers.
              </p>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="bg-slate-950 border border-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-2xl md:text-3xl font-extrabold text-amber-500 font-display block">₹50L</span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider font-mono">Approved Credit Cap</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl md:text-3xl font-extrabold text-amber-500 font-display block">100%</span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider font-mono">GSTIN Audited Sellers</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl md:text-3xl font-extrabold text-amber-500 font-display block">2.4k+</span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider font-mono">Successful Matches</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl md:text-3xl font-extrabold text-amber-500 font-display block">0%</span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider font-mono">Hidden Sourcing Fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Section */}
      <section 
        className="py-24 px-6 bg-slate-950/40 backdrop-blur-md scroll-mt-16"
        id="contact-section"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Get in Touch</span>
              <h2 className="text-3xl font-bold font-display text-white text-glow-blue">Connect with Compliance Secretariat</h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Have questions regarding your GST verification status, corporate credit limits, or catalog hosting? Drop us an inquiry and our central agents will verify your request.
              </p>
            </div>

            <div className="space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/10">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase block tracking-wider font-mono">Email Address</span>
                  <a href="mailto:smehouse25@gmail.com" className="text-xs font-semibold text-slate-200 hover:text-blue-400 transition">
                    smehouse25@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/10">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase block tracking-wider font-mono">Phone Support</span>
                  <span className="text-xs font-semibold text-slate-200">
                    +91 11 4056 9284
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/10">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase block tracking-wider font-mono">Delhi Head Office</span>
                  <span className="text-xs font-semibold text-slate-200 block">
                    SmeBhawan Secretariat,
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Sadhna Enclave, Panchsheel Park, New Delhi, Delhi 110017
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-3xl p-8 shadow-2xl relative">
            <h3 className="text-base font-bold text-white font-display mb-6">Send a Message</h3>
            
            {submitted ? (
              <div className="p-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/10">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white">Message Dispatched!</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Your inquiry has been registered in the compliance queue. Secure confirmations routed via SMTP.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">Work Email</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. business@sme.org"
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Message Details</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or technical issue..."
                    rows={4}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-glow-blue border border-blue-500/30"
                >
                  <Send size={14} />
                  <span>Send Secure Message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
