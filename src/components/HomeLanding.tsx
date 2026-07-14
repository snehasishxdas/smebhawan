import React, { useState } from "react";
import SmebhawanLogo from "./SmebhawanLogo";
import { ArrowDown, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Cpu, Truck, ChevronRight } from "lucide-react";

interface HomeLandingProps {
  onExploreMaterials: () => void;
  theme: "dark" | "light";
}

export default function HomeLanding({ onExploreMaterials, theme }: HomeLandingProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`flex flex-col bg-transparent min-h-screen font-sans transition-colors duration-300 ${
      theme === "dark" ? "text-slate-100" : "text-slate-900"
    }`}>
      
      {/* 1. Full Screen Hero Section - Editorial BigDrop Style */}
      <section 
        className="relative h-[90vh] md:h-screen w-full flex items-center justify-start overflow-hidden px-6 md:px-16"
        id="hero-section"
      >
        {/* Background Video - mobile optimized with playsInline, loop, autoPlay and muted */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="/assets/home.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`w-full h-full object-cover scale-100 transition-all duration-1000 ${
              theme === "dark" ? "opacity-25" : "opacity-35"
            }`}
          />
          {/* Subtle gradient overlay to blend into the rest of the page */}
          <div className={`absolute inset-0 bg-gradient-to-b ${
            theme === "dark" 
              ? "from-slate-950/20 via-transparent to-[#05070c]" 
              : "from-white/10 via-transparent to-[#FAF8F5]"
          }`}></div>
        </div>

        {/* Content Container (Left-aligned, high-impact) */}
        <div className="relative z-10 max-w-6xl w-full mx-auto space-y-8 md:space-y-12 py-12">
          
          <div className="space-y-6 md:space-y-8 max-w-5xl">
            {/* Huge Tall Condensed Headline */}
            <h1 className={`font-condensed font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tight select-none ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              RAW MATERIAL SOURCING,<br />
              <span className={theme === "dark" ? "text-amber-500" : "text-amber-600"}>RE-IMAGINED.</span>
            </h1>

            {/* Subtext description */}
            <p className={`text-sm sm:text-base md:text-lg max-w-2xl font-sans leading-relaxed tracking-wide ${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}>
              India's premier digital pipeline connecting manufacturers directly to verified chemical, polymer, steel, and mineral suppliers. Verified paths, sandbox credit limits, and real-time tracking.
            </p>
          </div>

          {/* Action Row - Clean layout matching reference */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <button
              onClick={onExploreMaterials}
              className={`px-8 py-4 font-bold text-xs uppercase tracking-widest rounded-none transition duration-300 cursor-pointer shadow-md ${
                theme === "dark" 
                  ? "bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950" 
                  : "bg-slate-900 text-white hover:bg-amber-600 hover:text-white"
              }`}
            >
              Explore Directory
            </button>
            
            <button
              onClick={() => scrollToSection("contact-section")}
              className={`relative py-2 text-xs font-bold uppercase tracking-widest transition duration-300 cursor-pointer group ${
                theme === "dark" ? "text-white hover:text-amber-500" : "text-slate-800 hover:text-amber-600"
              }`}
            >
              Get In Touch
              <span className={`absolute bottom-0 left-0 w-full h-[2px] transform group-hover:scale-x-105 transition-transform duration-300 origin-left ${
                theme === "dark" ? "bg-amber-500" : "bg-amber-600"
              }`}></span>
            </button>
          </div>

        </div>

        {/* Big Yellow/Amber Down Indicator at bottom-right (Inspired by BigDrop layout) */}
        <div className="absolute bottom-12 right-6 md:right-16 z-10 flex flex-col items-center space-y-2 select-none">
          <span className={`text-[9px] font-mono font-bold tracking-widest uppercase rotate-90 translate-y-[-20px] ${
            theme === "dark" ? "text-slate-500" : "text-slate-400"
          }`}>
            SCROLL
          </span>
          <button 
            onClick={() => scrollToSection("about-section")}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition duration-300 cursor-pointer animate-bounce ${
              theme === "dark"
                ? "border-amber-500/30 hover:border-amber-500 text-amber-500 bg-slate-950/20"
                : "border-amber-500/50 hover:border-amber-600 text-amber-600 bg-white/40 shadow-xs"
            }`}
          >
            <ArrowDown size={20} />
          </button>
        </div>

      </section>

      {/* 2. About Section - Clean, Human-Designed Grid Layout */}
      <section 
        className={`py-24 px-6 md:px-16 border-b transition-colors duration-300 scroll-mt-16 ${
          theme === "dark" 
            ? "bg-slate-900/80 backdrop-blur-md border-slate-950 text-white" 
            : "bg-slate-100/90 backdrop-blur-md border-slate-200 text-slate-800"
        }`}
        id="about-section"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Title Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className={`text-[10px] font-bold uppercase tracking-widest font-mono block ${
              theme === "dark" ? "text-amber-500" : "text-amber-700"
            }`}>
              About SmeBhawan
            </span>
            <h2 className={`font-condensed font-bold text-4xl sm:text-5xl leading-none ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              EMPOWERING INDIAN MANUFACTURERS.
            </h2>
            <div className={`w-12 h-[2px] rounded-full ${
              theme === "dark" ? "bg-amber-500" : "bg-amber-600"
            }`}></div>
            <p className={`text-xs md:text-sm leading-relaxed max-w-md ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}>
              SmeBhawan is a national B2B infrastructure portal designed to support small and medium enterprises. By providing direct tracking links, compliance checks, and secure credit lines, we make raw material procurement hassle-free.
            </p>
          </div>

          {/* Right Columns: Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1 */}
            <div className={`space-y-4 p-7 transition-all duration-300 rounded-3xl shadow-xl flex flex-col justify-between group hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-slate-950/40 border border-slate-900 hover:border-amber-500/20"
                : "bg-white border border-slate-200/80 hover:border-amber-500/30"
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    theme === "dark"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/10"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}>
                    <Cpu size={18} />
                  </div>
                  <span className={`font-condensed font-bold text-xl select-none transition-colors duration-300 ${
                    theme === "dark" ? "text-slate-800 group-hover:text-amber-500/20" : "text-slate-200 group-hover:text-amber-500/25"
                  }`}>01</span>
                </div>
                <h3 className={`text-xs font-bold tracking-wider uppercase font-sans ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Smart Sourcing
                </h3>
                <p className={`text-[11px] leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-650"
                }`}>
                  Browse verified manufacturer listings with fully integrated real-time dynamic clicks tracking. Monitor direct lead interactions instantly.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`space-y-4 p-7 transition-all duration-300 rounded-3xl shadow-xl flex flex-col justify-between group hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-slate-950/40 border border-slate-900 hover:border-amber-500/20"
                : "bg-white border border-slate-200/80 hover:border-amber-500/30"
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    theme === "dark"
                      ? "bg-amber-50/10 text-amber-500 border-amber-500/10"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}>
                    <ShieldCheck size={18} />
                  </div>
                  <span className={`font-condensed font-bold text-xl select-none transition-colors duration-300 ${
                    theme === "dark" ? "text-slate-800 group-hover:text-amber-500/20" : "text-slate-200 group-hover:text-amber-500/25"
                  }`}>02</span>
                </div>
                <h3 className={`text-xs font-bold tracking-wider uppercase font-sans ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Verified Settle Path
                </h3>
                <p className={`text-[11px] leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-650"
                }`}>
                  Choose between Path A for instant RTGS wire clearing or leverage Path B for sandbox-backed interest-bearing credit facilities up to ₹50,00,000 INR.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className={`space-y-4 p-7 transition-all duration-300 rounded-3xl shadow-xl flex flex-col justify-between group sm:col-span-2 hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-slate-950/40 border border-slate-900 hover:border-amber-500/20"
                : "bg-white border border-slate-200/80 hover:border-amber-500/30"
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    theme === "dark"
                      ? "bg-amber-50/10 text-amber-500 border-amber-500/10"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}>
                    <Truck size={18} />
                  </div>
                  <span className={`font-condensed font-bold text-xl select-none transition-colors duration-300 ${
                    theme === "dark" ? "text-slate-800 group-hover:text-amber-500/20" : "text-slate-200 group-hover:text-amber-500/25"
                  }`}>03</span>
                </div>
                <h3 className={`text-xs font-bold tracking-wider uppercase font-sans ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  SMTP-Aligned Logistics Confirmation
                </h3>
                <p className={`text-[11px] leading-relaxed ${
                  theme === "dark" ? "text-slate-400" : "text-slate-650"
                }`}>
                  Gain continuous automated updates. All buyer orders and compliance modifications trigger immediate dispatch confirmations directly to corporate mail servers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Contact Section - Clean Form & Info Layout */}
      <section 
        className={`py-24 px-6 md:px-16 scroll-mt-16 border-b transition-colors duration-300 ${
          theme === "dark" 
            ? "bg-slate-950/40 border-slate-950 text-white" 
            : "bg-[#f3ede6]/40 border-slate-200 text-slate-800"
        }`}
        id="contact-section"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest font-mono block ${
                theme === "dark" ? "text-amber-500" : "text-amber-700"
              }`}>
                Get in Touch
              </span>
              <h2 className={`font-condensed font-bold text-4xl sm:text-5xl leading-none ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                CONNECT WITH CENTRAL COMPLIANCE.
              </h2>
              <p className={`text-xs md:text-sm leading-relaxed ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                Have questions regarding your GST verification status, corporate credit limits, or catalog hosting? Drop us an inquiry and our central agents will verify your request.
              </p>
            </div>

            <div className={`space-y-4 font-mono text-[11px] ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}>
              <div className="flex items-center space-x-3">
                <Mail size={14} className={theme === "dark" ? "text-amber-500" : "text-amber-600"} />
                <span className="text-slate-500">EMAIL:</span>
                <a href="mailto:smehouse25@gmail.com" className={`hover:text-amber-500 transition ${
                  theme === "dark" ? "text-slate-200" : "text-slate-800"
                }`}>
                  smehouse25@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={14} className={theme === "dark" ? "text-amber-500" : "text-amber-600"} />
                <span className="text-slate-500">PHONE:</span>
                <span className={theme === "dark" ? "text-slate-200" : "text-slate-850"}>+91 11 4056 9284</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={14} className={`mt-0.5 shrink-0 ${theme === "dark" ? "text-amber-500" : "text-amber-600"}`} />
                <span className="text-slate-500">OFFICE:</span>
                <span className={theme === "dark" ? "text-slate-200" : "text-slate-850"}>
                  Sadhna Enclave, Panchsheel Park, New Delhi, Delhi 110017
                </span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className={`p-8 rounded-none shadow-2xl transition-colors duration-300 border ${
            theme === "dark"
              ? "bg-slate-900/60 border-slate-800/80 lg:col-span-7"
              : "bg-white border-slate-200 lg:col-span-7"
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider font-sans mb-6 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Send a Sourcing Message
            </h3>
            
            {submitted ? (
              <div className="p-8 text-center space-y-4 animate-fade-in">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
                  theme === "dark" 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" 
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}>
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Message Dispatched!</h4>
                  <p className={`text-xs max-w-xs mx-auto ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    Your inquiry has been registered in the compliance queue. Secure confirmations routed via SMTP.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}>Full Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ramesh Kumar"
                      className={`w-full p-3 border text-xs focus:outline-none focus:border-amber-500 transition rounded-none ${
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-700"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}>Work Email</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="business@sme.org"
                      className={`w-full p-3 border text-xs focus:outline-none focus:border-amber-500 transition rounded-none ${
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-700"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-widest block font-mono ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>Message Details</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or technical issue..."
                    rows={4}
                    className={`w-full p-3 border text-xs focus:outline-none focus:border-amber-500 transition resize-none rounded-none ${
                      theme === "dark"
                        ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 font-bold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-none ${
                    theme === "dark"
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                      : "bg-amber-600 hover:bg-amber-700 text-white"
                  }`}
                >
                  <Send size={12} />
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
