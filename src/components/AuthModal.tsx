import React, { useState } from "react";
import { User } from "../types";
import { CheckCircle, ShieldAlert, X, Building, Mail, Lock, FileText, ArrowRight, User as UserIcon, HelpCircle, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialMode: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode,
}: AuthModalProps) {
  if (!isOpen) return null;

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "supplier">("buyer");
  const [gstNumber, setGstNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Live OTP verification variables
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [registrationPending, setRegistrationPending] = useState(false);

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    setOtpSent(false);
    setOtpCode("");
    setOtpMessage(null);
    setError(null);
    setRegistrationPending(false);
  };

  const handleResendOtp = async () => {
    setError(null);
    setOtpMessage(null);
    setLoading(true);
    try {
      const payload = {
        email,
        role,
        gstNumber,
        companyName: companyName || email.split("@")[0],
        contactName,
        aboutCompany,
        password,
        mode
      };
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpMessage("Resent! Check your inbox (including spam folder) for the new OTP code.");
      } else {
        setError(data.error || "SMTP was unable to dispatch a fresh verification code.");
      }
    } catch (err: any) {
      setError("SMTP service issue: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please specify your work email address.");
      return;
    }
    setError(null);
    setOtpMessage(null);
    setLoading(true);

    const isAminLogin = email.toLowerCase().trim() === "smehouse25@gmail.com";

    if (!otpSent) {
      // Direct Admin Login bypasses OTP
      if (mode === "login" && isAminLogin) {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            onAuthSuccess(data.user);
            onClose();
          } else {
            setError(data.error || "Invalid administrator credentials.");
          }
        } catch (err: any) {
          setError("Admin Direct Login failure: " + err.message);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Step 1: Send OTP code via SMTP
      try {
        const payload = {
          email,
          role,
          gstNumber,
          companyName: companyName || email.split("@")[0],
          contactName,
          aboutCompany,
          password: password || "secure_otp_session",
          mode,
        };

        const res = await fetch("/api/auth/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOtpSent(true);
          setOtpMessage(data.message || "A secure 6-digit OTP code has been dispatched to your email box!");
        } else {
          setError(data.error || "Failed to dispatch verification code via SMTP.");
        }
      } catch (err: any) {
        setError("SMTP service contact error: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Verify OTP
      if (!otpCode || otpCode.trim().length !== 6) {
        setError("Please enter the complete 6-digit verification code.");
        setLoading(false);
        return;
      }

      try {
        const payload = {
          email,
          otp: otpCode.trim(),
          mode,
        };

        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (mode === "register") {
            // New register waits for admin approval!
            setRegistrationPending(true);
          } else {
            // Successful Login
            onAuthSuccess(data.user);
            onClose();
          }
        } else {
          setError(data.error || "The verification OTP you entered is incorrect.");
        }
      } catch (err: any) {
        setError("OTP verification failure: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const isAdminEmailEntered = email.toLowerCase().trim() === "smehouse25@gmail.com";

  return (
    <div className="fixed inset-0 bg-brand-blue/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="auth_portal_modal">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center relative">
          <div>
            <h2 className="text-xl font-display font-semibold tracking-tight">
              {registrationPending 
                ? "Verification Successful!" 
                : mode === "register" 
                  ? "SmeBhawan Portal Onboarding" 
                  : "Account Secure Login"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {registrationPending 
                ? "Your business details have been securely logged" 
                : mode === "register" 
                  ? "Access Indian MSME procurement & credit networks" 
                  : "Access your customized dashboard and raw link clicks"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scroll-body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {registrationPending ? (
            /* Successful onboarding pending review layout */
            <div className="text-center py-6 px-4 space-y-5 animate-fade-in" id="registration_pending_display">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-200 animate-bounce">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">Application Under Audit</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Your business credentials have been successfully verified via email OTP. Your profile is now waiting for compliance review by the <strong>SmeBhawan Secretariat</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 text-left p-4 rounded-xl text-xs space-y-2 text-gray-700">
                <p className="font-semibold text-slate-900 border-b pb-1.5 mb-1.5 flex justify-between">
                  <span>Submitted File Checklist:</span>
                  <span className="text-emerald-600 font-bold">✓ VERIFIED</span>
                </p>
                <p>• 🏢 <strong>Organization:</strong> {companyName || email.split("@")[0]}</p>
                <p>• 👤 <strong>Contact Name:</strong> {contactName || "SME Executive"}</p>
                <p>• 📋 <strong>GSTIN Identity:</strong> {gstNumber || "Not Provided"}</p>
                <p>• 🔑 <strong>Assigned Role:</strong> {role.toUpperCase()}</p>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-gray-500 italic">
                  An automated confirmation email has been dispatched from <strong className="text-slate-700">smehouse25@gmail.com</strong>. We will notify you once your account becomes live on our platform.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow transition-all focus:outline-none cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                  <div className="p-3 bg-rose-50 border-l-4 border-rose-600 text-rose-800 text-xs rounded flex space-x-2 animate-pulse">
                    <ShieldAlert size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {otpSent ? (
                  /* Verification OTP Entry Template */
                  <div className="space-y-4 py-2 animate-fade-in">
                    <div className="bg-blue-50/80 border border-blue-200/50 p-4 rounded-xl text-xs text-blue-900 leading-relaxed font-sans space-y-1">
                      <p className="font-bold flex items-center gap-1 text-[13px]">
                        <CheckCircle size={15} className="text-blue-600 shrink-0" />
                        <span>One-Time Code Dispatched!</span>
                      </p>
                      <p className="text-slate-600">
                        We have triggered a secure transaction verification using Gmail SMTP to activate your live account. Please enter the 6-digit OTP code sent to:
                      </p>
                      <p className="font-semibold text-slate-800 underline font-mono select-all pt-0.5">{email}</p>
                    </div>

                    {otpMessage && (
                      <p className="text-xs text-emerald-600 font-medium font-sans bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
                        ✓ {otpMessage}
                      </p>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">6-Digit OTP Verification Code</label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Enter 123456"
                        className="w-full text-center py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-blue-900 font-mono"
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-slate-500 hover:text-slate-800 underline cursor-pointer font-medium"
                      >
                        ← Edit email/persona
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                        disabled={loading}
                      >
                        Resend code via SMTP
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Regular Credentials Inputs Template */
                  <>
                    {/* Persona Switch: only for registering */}
                    {mode === "register" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Select Business Persona</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setRole("buyer")}
                            className={`p-3 rounded-lg border text-left flex flex-col transition cursor-pointer ${
                              role === "buyer" 
                                ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-2 ring-blue-500/10" 
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <span className="text-sm font-semibold">MSME Buyer</span>
                            <span className="text-[10px] text-gray-500 mt-1 font-sans">Submit GST to redeem ₹50L pre-approved credit line.</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRole("supplier")}
                            className={`p-3 rounded-lg border text-left flex flex-col transition cursor-pointer ${
                              role === "supplier" 
                                ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-2 ring-blue-500/10" 
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <span className="text-sm font-semibold">Supplier/Vendor</span>
                            <span className="text-[10px] text-gray-500 mt-1 font-sans">List materials, build trackers & analyze clicks.</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">Work Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@business.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        {isAdminEmailEntered ? "Administrator Secret Password" : "Login Password"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                          required
                        />
                      </div>
                    </div>

                    {/* Register specific details */}
                    {mode === "register" && (
                      <>
                        {/* Contact Name & Company Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 block">Your Contact Name</label>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="text"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="E.g. Rajesh Kumar"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 block">Company Legal Name</label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="E.g. TATA Fab Unit"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* GST Number */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 block">Business GSTIN Registration Number</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              value={gstNumber}
                              onChange={(e) => setGstNumber(e.target.value)}
                              placeholder="E.g. 27AAAAA1111A1Z1"
                              maxLength={15}
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-mono"
                              required
                            />
                          </div>
                        </div>

                        {/* About Company / business description */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 block">About Company / Business Profile</label>
                          <textarea
                            value={aboutCompany}
                            onChange={(e) => setAboutCompany(e.target.value)}
                            placeholder="Describe your manufacturing scale, raw material needs, or product category details..."
                            rows={2}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-sans resize-none"
                            required
                          />
                        </div>

                        <p className="text-[10px] text-gray-400 leading-normal font-sans">
                          * Submission of a valid Indian GSTIN number is verified with official NIC databases prior to admin onboarding review.
                        </p>
                      </>
                    )}
                  </>
                )}

                {/* Action button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow transition-all focus:outline-none focus:ring flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {loading 
                      ? "Authenticating Session..." 
                      : otpSent 
                        ? "Verify OTP & Access Portal" 
                        : mode === "register" 
                          ? "Request Onboarding OTP" 
                          : isAdminEmailEntered 
                            ? "Log in as Administrator" 
                            : "Request Secure Login OTP"}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Toggle Register/Login link */}
              <div className="text-center text-xs text-gray-600 pt-2 border-t border-gray-100">
                {mode === "register" ? (
                  <p>
                    Already have a B2B business profile?{" "}
                    <button 
                      onClick={() => handleModeSwitch("login")}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Sign In instead
                    </button>
                  </p>
                ) : (
                  <p>
                    New partner material applicant?{" "}
                    <button 
                      onClick={() => handleModeSwitch("register")}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Create business account
                    </button>
                  </p>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
