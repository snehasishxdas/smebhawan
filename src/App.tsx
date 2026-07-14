import { useState, useEffect } from "react";
import { User, RawMaterial, LinkClick, ProcurementRequest, AppNotification, AuditLog } from "./types";
import { motion, AnimatePresence } from "motion/react";
import SmebhawanLogo from "./components/SmebhawanLogo";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import BuyerDashboard from "./components/BuyerDashboard";
import SupplierDashboard from "./components/SupplierDashboard";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/AuthModal";
import NotificationsInbox from "./components/NotificationsInbox";
import { 
  Bell, CheckCircle, Flame, ShieldAlert, Sparkles, Star, RefreshCw 
} from "lucide-react";

export default function App() {
  // Authentication & session state
  const [user, setUser] = useState<User | null>(null);
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active View Tab: home, buyer, supplier, admin
  const [activeView, setActiveView] = useState<string>("home");

  // Live active database lists
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [orders, setOrders] = useState<ProcurementRequest[]>([]);
  const [clicks, setClicks] = useState<LinkClick[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Push notifications logs from SSE Event Source
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState<AppNotification | null>(null);
  const [showNotificationsInbox, setShowNotificationsInbox] = useState(false);

  // Sign In modal parameters
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Automated Hero intro splash state & network connection loading indicator
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    if (showSplash) {
      const interval = setInterval(() => {
        setSplashProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowSplash(false);
            }, 300);
            return 100;
          }
          return prev + 5; // Increments to 100% in 2 seconds
        });
      }, 90);
      return () => clearInterval(interval);
    }
  }, [showSplash]);

  // Fetch all states from express server endpoints
  const fetchAllData = async () => {
    try {
      const materialsRes = await fetch("/api/raw-materials");
      const materialsData = await materialsRes.json();
      if (materialsData.materials) setMaterials(materialsData.materials);

      const clicksRes = await fetch("/api/click-analytics");
      const clicksData = await clicksRes.json();
      if (clicksData.clicks) setClicks(clicksData.clicks);

      const ordersRes = await fetch("/api/procurement-requests");
      const ordersData = await ordersRes.json();
      if (ordersData.list) setOrders(ordersData.list);

      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      if (usersData.users) setUsers(usersData.users);

      const notificationsRes = await fetch("/api/notifications");
      const notificationsData = await notificationsRes.json();
      if (notificationsData.notifications) setNotifications(notificationsData.notifications);

      const auditRes = await fetch("/api/audit-logs");
      const auditData = await auditRes.json();
      if (auditData.logs) setAuditLogs(auditData.logs);
    } catch (e) {
      console.error("Failed fetching systemic B2B databases:", e);
    }
  };

  const checkMe = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (meData.user) {
        setUser(meData.user);
        // Direct view routing on login to keep user context elegant
        if (meData.user.role === "buyer") setActiveView("buyer");
        else if (meData.user.role === "supplier") setActiveView("supplier");
        else if (meData.user.role === "admin") setActiveView("admin");
      }
      setDbConnected(meData.dbConnected || false);
    } catch (e) {
      console.error("Auth check issue:", e);
    } finally {
      setLoading(false);
    }
  };

  // Security session validation and enforcement
  useEffect(() => {
    // Skip checking during initial loading phase or when splash is showing
    if (loading || showSplash) return;

    if (user) {
      const allowed = 
        (activeView === "home") ||
        (activeView === "buyer" && user.role === "buyer") ||
        (activeView === "supplier" && user.role === "supplier") ||
        (activeView === "admin" && user.role === "admin");

      if (!allowed) {
        console.warn("Security policy violation: Unauthorised view path. Terminating session...");
        handleLogout();
      }
    } else {
      // If no user is logged in, only "home" view is permitted
      if (activeView !== "home") {
        console.warn("Security policy violation: Anonymous access to secured view. Redirecting to logout...");
        handleLogout();
      }
    }
  }, [activeView, user, loading, showSplash]);

  // Initialize and establish Real-Time SSE Listeners
  useEffect(() => {
    checkMe();
    fetchAllData();

    // Subscribe to SSE events
    const eventSource = new EventSource("/api/push-notifications/subscribe");
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "CONNECTION_ESTABLISHED") {
          console.log("Push notifications SSE channel active:", data.message);
          return;
        }

        const freshNotif: AppNotification = {
          id: Math.random().toString(),
          type: data.type,
          message: data.message,
          timestamp: data.timestamp || new Date().toISOString(),
          payload: data.payload,
        };

        // Append to running reactive stack
        setNotifications(prev => [freshNotif, ...prev]);
        setShowNotificationPopup(freshNotif);

        // Hide notification toast automatically after delay
        setTimeout(() => {
          setShowNotificationPopup(null);
        }, 6000);

        // Trigger dynamic database syncs based on live action categories
        fetchAllData();
        
        // Re-read profile parameters to assert latest pre-approved limit balances
        fetch("/api/auth/me")
          .then(res => res.json())
          .then(meData => {
            if (meData.user) setUser(meData.user);
          });

      } catch (err) {
        console.error("Failed parsing SSE event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("SSE EventSource closed or failed. Retrying lazily in background.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Handler: Customer triggers external URL sourcing link
  const handleRegisterClick = async (rawLinkSlug: string, materialId: string) => {
    try {
      // Simulate real-time leads click logs to test live granular Recharts reports
      const res = await fetch("/api/click-tracker/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawLink: rawLinkSlug, materialId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Instant visual feedback for B2B clicks tracking
        const clickMockAlert = {
          id: Math.random().toString(),
          type: "LINK_CLICK_LOGGED",
          message: `Lead tracker click logged for /${rawLinkSlug} - Unique click marked!`,
          timestamp: new Date().toISOString(),
        };
        setNotifications(prev => [clickMockAlert, ...prev]);
        setShowNotificationPopup(clickMockAlert);
        setTimeout(() => setShowNotificationPopup(null), 3000);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Submit procurement sourcing requests
  const handleSourcingRequest = async (reqPayload: any) => {
    try {
      const res = await fetch("/api/procurement-requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAllData();
        return true;
      } else {
        alert(data.error || "Order failed.");
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Handler: Confirm shipping received to reinstate limits
  const handleConfirmReceipt = async (orderId: string) => {
    try {
      const res = await fetch("/api/procurement-requests/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "Delivered" }),
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Repay Credit facility
  const handleRepayCredit = async (orderId: string) => {
    try {
      const res = await fetch("/api/procurement-requests/repay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });
      if (res.ok) {
        fetchAllData();
        checkMe();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Stripe direct subscriptions setup
  const handleStripeUpgrade = async (planName: string, priceAmount: number) => {
    try {
      const res = await fetch("/api/premium-subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, priceAmount }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Dynamic Nodemailer SMTP verification Reports
  const handleTriggerMail = async (targetMailId: string) => {
    const res = await fetch("/api/reports/trigger-smtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetEmail: targetMailId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "SMTP issue");
    }
  };

  // Handler: Publish new raw material (shared bySupplier and Admin)
  const handleCreateMaterial = async (mPayload: any) => {
    try {
      const res = await fetch("/api/raw-materials/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mPayload),
      });
      if (res.ok) {
        fetchAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Handler: Remove listed item
  const handleRemoveMaterial = async (id: string) => {
    try {
      const res = await fetch(`/api/raw-materials/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Handler: Toggle material status (sold / active)
  const handleToggleMaterialStatus = async (id: string, isSold: boolean) => {
    try {
      await fetch("/api/raw-materials/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isSold }),
      });
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Admin modifies customer limits, role or status
  const handleModifyUser = async (userPayload: any) => {
    try {
      const res = await fetch("/api/auth/modify-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Admin deletes user profile
  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/auth/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Update procurement PO status (Matched, QC_Verified, Shipped)
  const handleUpdateOrderStatus = async (orderPayload: any) => {
    try {
      const res = await fetch("/api/procurement-requests/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Admin approves or rejects raw material listed by supplier
  const handleApproveMaterial = async (id: string, approved: boolean) => {
    try {
      const res = await fetch("/api/raw-materials/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved }),
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Supplier submits edits for a raw material (needs Admin review)
  const handleEditMaterial = async (id: string, edits: any) => {
    try {
      const res = await fetch("/api/raw-materials/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...edits }),
      });
      if (res.ok) {
        fetchAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Handler: Admin approves or discards pending edits on a material
  const handleApproveEdits = async (id: string, approve: boolean) => {
    try {
      const res = await fetch("/api/raw-materials/approve-edits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approve }),
      });
      if (res.ok) {
        fetchAllData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setActiveView("home");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="rawlink_application_container">
      
      {/* Automatic Animated Intro Splash Hero Section */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, transition: { duration: 0.5, ease: "easeInOut" } }}
            className="fixed inset-0 bg-[#FAF8F5] z-[9999] flex flex-col items-center justify-center p-6"
            id="smebhawan_splash_screen"
          >
            <div className="max-w-md w-full flex flex-col items-center space-y-8 text-center">
              {/* Logo Animated Reveal */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <SmebhawanLogo variant="full" size="xl" lightText={false} />
              </motion.div>

              {/* Tagline / Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-2"
              >
                <p className="text-xs uppercase font-bold text-amber-700 tracking-widest">
                  National MSME Infrastructure Portal
                </p>
                <p className="text-[13px] text-slate-500 font-sans max-w-xs mx-auto leading-relaxed">
                  Connecting small and medium enterprises directly to raw materials and suppliers.
                </p>
              </motion.div>

              {/* Progress Line & Realtime value */}
              <motion.div 
                initial={{ opacity: 0, width: "60%" }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-full space-y-3 pt-4 max-w-xs"
              >
                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-800 transition-all duration-100 ease-out rounded-full"
                    style={{ width: `${splashProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span className="animate-pulse">BUILDING B2B PIPELINES...</span>
                  <span>{splashProgress}%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Toolbar */}
      <Header 
        user={user}
        dbConnected={dbConnected}
        notifications={notifications}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthOpen(true);
        }}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
        onToggleNotifications={() => setShowNotificationsInbox(prev => !prev)}
      />

      {/* 2. Main Body with dynamic active tabs */}
      <main className="flex-1 w-full bg-slate-50 relative">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-slate-500">
            <RefreshCw className="animate-spin text-blue-600" size={24} />
            <span>Establishing secure sessions over verified SMTP...</span>
          </div>
        ) : (
          <div className="animate-fade-in">
            {showNotificationsInbox ? (
              <NotificationsInbox 
                notifications={notifications} 
                onMarkRead={async (id) => {
                  try {
                    const res = await fetch("/api/notifications/mark-read", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id }),
                    });
                    if (res.ok) {
                      fetchAllData();
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
                onClose={() => setShowNotificationsInbox(false)}
              />
            ) : (
              <>
                {activeView === "home" && (
              <HomeView 
                user={user}
                materials={materials}
                onSubmitRequest={handleSourcingRequest}
                onRegisterClick={handleRegisterClick}
                onOpenAuth={(mode) => {
                  setAuthMode(mode);
                  setAuthOpen(true);
                }}
              />
            )}

            {activeView === "buyer" && user?.role === "buyer" && (
              <BuyerDashboard 
                user={user}
                orders={orders}
                notifications={notifications}
                materials={materials}
                onRepayCredit={handleRepayCredit}
                onConfirmReceipt={handleConfirmReceipt}
                onTriggerMail={handleTriggerMail}
                onSubmitRequest={handleSourcingRequest}
              />
            )}

            {activeView === "supplier" && user?.role === "supplier" && (
              <SupplierDashboard 
                user={user}
                materials={materials}
                clicks={clicks}
                orders={orders}
                onCreateMaterial={handleCreateMaterial}
                onRemoveMaterial={handleRemoveMaterial}
                onStripeUpgrade={handleStripeUpgrade}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onEditMaterial={handleEditMaterial}
              />
            )}

            {activeView === "admin" && user?.role === "admin" && (
              <AdminPanel 
                user={user}
                users={users}
                materials={materials}
                orders={orders}
                clicks={clicks}
                auditLogs={auditLogs}
                onModifyUser={handleModifyUser}
                onDeleteUser={handleDeleteUser}
                onAddMaterial={handleCreateMaterial}
                onRemoveMaterial={handleRemoveMaterial}
                onToggleMaterialStatus={handleToggleMaterialStatus}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onApproveMaterial={handleApproveMaterial}
                onApproveEdits={handleApproveEdits}
              />
            )}
              </>
            )}
          </div>
        )}
      </main>

      {/* 3. Footer Banner Row */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 font-sans shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display font-semibold text-sm text-white">smebhawan B2B</h4>
            <p className="text-[11px] text-gray-500">
              Verified SMTP Notifications aligned to smehouse25@gmail.com
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-mono text-[10px]">
            <span>MongoDB Atlas Cluster0</span>
            <span>•</span>
            <span>Stripe Premium APIs Configured</span>
            <span>•</span>
            <span>React Vite + Tailwind CSS v4</span>
          </div>
          <p className="text-[11px] text-gray-500 text-center">
            &copy; 2026 smebhawan MSME Global Industries. All rights reserved. Registered Indian B2B Sourcing.
          </p>
        </div>
      </footer>

      {/* 4. Global Auth Modal Router */}
      <AuthModal 
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(u) => {
          setUser(u);
          if (u.role === "buyer") setActiveView("buyer");
          else if (u.role === "supplier") setActiveView("supplier");
          else if (u.role === "admin") setActiveView("admin");
          fetchAllData();
        }}
      />

      {/* 5. SSE Real-Time Floating Push Toast Popup */}
      {showNotificationPopup && (
        <div className="fixed bottom-6 right-6 max-w-sm w-full bg-slate-950 text-white rounded-xl shadow-2xl border border-blue-500/30 p-4 flex items-start space-x-3 z-50 animate-bounce cursor-pointer" onClick={() => setShowNotificationPopup(null)}>
          <div className="p-1 px-1 text-xs font-bold text-amber-400 flex items-center space-x-1 uppercase shrink-0">
            <Bell size={16} className="text-blue-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-blue-400 block uppercase font-bold tracking-widest">{showNotificationPopup.type}</span>
            <p className="text-xs text-slate-100 font-medium leading-normal">{showNotificationPopup.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
