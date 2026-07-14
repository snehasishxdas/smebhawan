import React, { useState } from "react";
import SmebhawanLogo from "./SmebhawanLogo";
import { ArrowDown, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Cpu, Truck, ChevronRight } from "lucide-react";

interface HomeLandingProps {
  onExploreMaterials: () => void;
}

export default function HomeLanding({ onExploreMaterials }: HomeLandingProps) {
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
    <div className="flex flex-col bg-transparent min-h-screen text-slate-100 font-sans">
      
      {/* 1. Full Screen Hero Section - Editorial BigDrop Style */}
      <section 
        className="relative h-[90vh] md:h-screen w-full flex items-center justify-start overflow-hidden px-6 md:px-16"
        id="hero-section"
      >
        {/* Background Overlay - transparent to show the global fixed background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/25 via-transparent to-slate-950/50"></div>

        {/* Content Container (Left-aligned, high-impact) */}
        <div className="relative z-10 max-w-6xl w-full mx-auto space-y-8 md:space-y-12 py-12">
          
          <div className="space-y-6 md:space-y-8 max-w-5xl">
            {/* Huge Tall Condensed Headline */}
            <h1 className="font-condensed font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tight text-white select-none">
              RAW MATERIAL SOURCING,<br />
              <span className="text-amber-500">RE-IMAGINED.</span>
            </h1>

            {/* Subtext description */}
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-sans leading-relaxed tracking-wide">
              India's premier digital pipeline connecting manufacturers directly to verified chemical, polymer, steel, and mineral suppliers. Verified paths, sandbox credit limits, and real-time tracking.
            </p>
          </div>

          {/* Action Row - Clean layout matching reference */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <button
              onClick={onExploreMaterials}
              className="px-8 py-4 bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs uppercase tracking-widest rounded-none transition duration-300 cursor-pointer shadow-md"
            >
              Explore Directory
            </button>
            
            <button
              onClick={() => scrollToSection("contact-section")}
              className="relative py-2 text-xs font-bold uppercase tracking-widest text-white hover:text-amber-500 transition duration-300 cursor-pointer group"
            >
              Get In Touch
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 transform group-hover:scale-x-105 transition-transform duration-300 origin-left"></span>
            </button>
          </div>

        </div>

        {/* Big Yellow/Amber Down Indicator at bottom-right (Inspired by BigDrop layout) */}
        <div className="absolute bottom-12 right-6 md:right-16 z-10 flex flex-col items-center space-y-2 select-none">
          <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase rotate-90 translate-y-[-20px]">
            SCROLL
          </span>
          <button 
            onClick={() => scrollToSection("about-section")}
            className="w-12 h-12 rounded-full border border-amber-500/30 hover:border-amber-500 text-amber-500 flex items-center justify-center transition duration-300 cursor-pointer animate-bounce bg-slate-950/20"
          >
            <ArrowDown size={20} />
          </button>
        </div>

      </section>

      {/* 2. About Section - Clean, Human-Designed Grid Layout */}
      <section 
        className="py-24 px-6 md:px-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-950 scroll-mt-16"
        id="about-section"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Title Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono block">
              About SmeBhawan
            </span>
            <h2 className="font-condensed font-bold text-4xl sm:text-5xl text-white leading-none">
              EMPOWERING INDIAN MANUFACTURERS.
            </h2>
            <div className="w-12 h-[2px] bg-amber-500 rounded-full"></div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md">
              SmeBhawan is a national B2B infrastructure portal designed to support small and medium enterprises. By providing direct tracking links, compliance checks, and secure credit lines, we make raw material procurement hassle-free.
            </p>
          </div>

          {/* Right Columns: Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 bg-slate-950/40 border border-slate-800/80 rounded-none">
              <Cpu className="text-amber-500" size={24} />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                Smart Sourcing
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Browse verified manufacturer listings with fully integrated real-time dynamic clicks tracking. Monitor direct lead interactions instantly.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-slate-950/40 border border-slate-800/80 rounded-none">
              <ShieldCheck className="text-amber-500" size={24} />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                Verified Settle Path
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Choose between Path A for instant RTGS wire clearing or leverage Path B for sandbox-backed interest-bearing credit facilities up to ₹50,00,000 INR.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-slate-950/40 border border-slate-800/80 rounded-none sm:col-span-2">
              <Truck className="text-amber-500" size={24} />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                SMTP-Aligned Logistics Confirmation
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Gain continuous automated updates. All buyer orders and compliance modifications trigger immediate dispatch confirmations directly to corporate mail servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Section - Clean Form & Info Layout */}
      <section 
        className="py-24 px-6 md:px-16 bg-slate-950/50 backdrop-blur-md scroll-mt-16 border-b border-slate-950"
        id="contact-section"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono block">
                Get in Touch
              </span>
              <h2 className="font-condensed font-bold text-4xl sm:text-5xl text-white leading-none">
                CONNECT WITH CENTRAL COMPLIANCE.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Have questions regarding your GST verification status, corporate credit limits, or catalog hosting? Drop us an inquiry and our central agents will verify your request.
              </p>
            </div>

            <div className="space-y-4 font-mono text-[11px] text-slate-300">
              <div className="flex items-center space-x-3">
                <Mail size={14} className="text-amber-500" />
                <span className="text-slate-500">EMAIL:</span>
                <a href="mailto:smehouse25@gmail.com" className="hover:text-amber-500 transition">
                  smehouse25@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={14} className="text-amber-500" />
                <span className="text-slate-500">PHONE:</span>
                <span>+91 11 4056 9284</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <span className="text-slate-500">OFFICE:</span>
                <span>
                  Sadhna Enclave, Panchsheel Park, New Delhi, Delhi 110017
                </span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 p-8 rounded-none shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-sans mb-6">
              Send a Sourcing Message
            </h3>
            
            {submitted ? (
              <div className="p-8 text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/10">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Message Dispatched!</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Your inquiry has been registered in the compliance queue. Secure confirmations routed via SMTP.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Full Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ramesh Kumar"
                      className="w-full p-3 bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-500 transition rounded-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Work Email</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="business@sme.org"
                      className="w-full p-3 bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-500 transition rounded-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Message Details</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or technical issue..."
                    rows={4}
                    className="w-full p-3 bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-500 transition resize-none rounded-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-none"
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
