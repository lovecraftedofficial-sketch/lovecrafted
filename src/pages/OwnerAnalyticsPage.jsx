import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Users,
  Heart,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Download,
  RefreshCw,
  Laptop,
  Smartphone,
  Tablet,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Sliders,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import {
  getAnalyticsData,
  verifyOwnerPin,
  setOwnerPin,
  exportAnalyticsJSON,
  exportKeepsakesCSV,
  seedSampleAnalytics,
  resetAllAnalytics,
  trackKeepsakeCreated,
  trackPageView,
} from "../services/analyticsService";

const AUTH_STORAGE_KEY = "lc_owner_analytics_auth";

export default function OwnerAnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [data, setData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [filterTemplate, setFilterTemplate] = useState("all");

  // Load analytics data (Local + Netlify Cloud Hybrid)
  const refreshData = async () => {
    setIsRefreshing(true);
    let report = getAnalyticsData();

    // If zero visits (brand new), automatically seed sample demonstration data
    if (report.totalVisits === 0 && report.totalKeepsakesCreated === 0) {
      seedSampleAnalytics();
      report = getAnalyticsData();
    }
    setData(report);

    // Try pulling multi-device cloud stats from Netlify Function
    try {
      const res = await fetch("/.netlify/functions/analytics");
      if (res.ok) {
        const cloud = await res.json();
        if (cloud && cloud.cloud) {
          setData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              totalVisits: Math.max(prev.totalVisits || 0, cloud.totalVisits || 0),
              uniqueVisitors: Math.max(prev.uniqueVisitors || 0, cloud.uniqueVisitorsCount || 0),
              totalKeepsakesPublished: Math.max(prev.totalKeepsakesPublished || 0, cloud.totalStoriesCount || 0),
              cloudConnected: true,
            };
          });
        }
      }
    } catch {}

    setTimeout(() => setIsRefreshing(false), 400);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // Handle PIN unlock
  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    if (verifyOwnerPin(pinInput)) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch {}
      setIsAuthenticated(true);
      setPinError("");
      toast.success("Welcome, Creator! Owner Access Granted 👑");
    } else {
      setPinError("Invalid PIN. Default Master PIN is 7799.");
      toast.error("Incorrect PIN. Please try again.");
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    setIsAuthenticated(false);
    setPinInput("");
    toast.info("Portal locked securely.");
  };

  // Change PIN handler
  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPin.length < 4) {
      toast.error("PIN must be at least 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match.");
      return;
    }
    if (setOwnerPin(newPin)) {
      toast.success("Owner Master PIN updated successfully!");
      setIsChangePinOpen(false);
      setNewPin("");
      setConfirmPin("");
    } else {
      toast.error("Failed to update PIN.");
    }
  };

  // Quick simulate event for testing
  const handleSimulateVisitor = () => {
    trackPageView("/marketplace");
    trackPageView("/editor/celebration-of-you");
    refreshData();
    toast.success("Simulated 2 live visitor page views! 👁️");
  };

  const handleSimulateKeepsake = () => {
    const sampleNames = [
      { p1: "Liam", p2: "Sophia", t: "celebration-of-you", title: "Celebration of Sophia" },
      { p1: "Ethan", p2: "Emma", t: "aurora-noire", title: "Aurora Noire Keepsake" },
      { p1: "Noah", p2: "Olivia", t: "whispers-of-love", title: "Love in Bloom Keepsake" },
    ];
    const picked = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    trackKeepsakeCreated({
      templateId: picked.t,
      title: picked.title,
      partner1: picked.p1,
      partner2: picked.p2,
      isPublished: true,
      slug: `${picked.p1}-${picked.p2}`.toLowerCase(),
    });
    refreshData();
    toast.success(`Created sample keepsake for ${picked.p1} & ${picked.p2}! 💍`);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all analytics counters?")) {
      resetAllAnalytics();
      refreshData();
      toast.success("Analytics counters cleared.");
    }
  };

  // Filtered keepsakes
  const filteredKeepsakes = useMemo(() => {
    if (!data?.recentKeepsakes) return [];
    if (filterTemplate === "all") return data.recentKeepsakes;
    return data.recentKeepsakes.filter((k) => k.templateId === filterTemplate);
  }, [data, filterTemplate]);

  // ==========================================
  // VIEW: SECURITY PIN LOCK SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070305] text-[#f5e6d3] flex items-center justify-center p-4 selection:bg-[#ff7395]/30">
        <div className="fixed inset-0 bg-gradient-to-tr from-[#1a0612] via-[#0b0308] to-[#040103] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff7395]/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-[#ffb8ce]/25 bg-[#12050e]/90 p-7 sm:p-9 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(255,115,149,0.25)] space-y-6"
        >
          {/* Header Badge */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff7395] to-[#d81b5c] flex items-center justify-center text-white shadow-lg shadow-rose-500/25 mb-1">
              <ShieldCheck className="size-7" />
            </div>
            <span className="text-[10px] tracking-[0.25em] font-mono uppercase px-3 py-1 rounded-full bg-[#ff7395]/15 text-[#ffb8ce] border border-[#ff7395]/30">
              CONFIDENTIAL OWNER PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              LoveCrafted Analytics
            </h1>
            <p className="text-xs text-[#ffc5d5]/70 max-w-xs leading-relaxed font-sans">
              Enter your secret Owner Master PIN to view visitor intelligence and keepsake creation metrics.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#ffd0e0] flex items-center gap-1.5">
                <Key className="size-3.5 text-[#ff7395]" />
                Owner Security PIN
              </label>
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                className="w-full h-12 text-center text-2xl font-mono tracking-[0.4em] rounded-2xl border border-[#ffb8ce]/30 bg-[#1c0817] text-white placeholder:text-[#ffc5d5]/20 focus:border-[#ff7395] focus:ring-2 focus:ring-[#ff7395]/20 focus:outline-none transition-all"
              />
              {pinError && (
                <p className="text-xs text-rose-400 text-center font-sans mt-1">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#ff8dae] via-[#e61e5c] to-[#c2184b] text-sm font-bold text-white shadow-lg hover:shadow-rose-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Unlock className="size-4" />
              <span>Unlock Analytics Portal</span>
            </button>
          </form>

          {/* Master PIN Hint for Owner */}
          <div className="p-3.5 rounded-2xl border border-[#ffb8ce]/15 bg-[#1f0919]/50 flex items-start gap-2.5 text-[11px] text-[#ffc5d5]/80">
            <HelpCircle className="size-4 text-[#ff7395] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Default Master PIN: <span className="font-mono text-[#ffb8ce] font-bold">7799</span></p>
              <p className="text-[#ffc5d5]/60 mt-0.5">
                This portal is strictly hidden from regular visitors. You can change this PIN anytime inside settings.
              </p>
            </div>
          </div>

          <div className="text-center pt-1">
            <Link
              to="/"
              className="text-xs text-[#ffc5d5]/50 hover:text-white transition-colors"
            >
              ← Back to LoveCrafted Main Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // VIEW: FULL OWNER ANALYTICS DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070305] text-[#f5e6d3] font-sans selection:bg-[#ff7395]/30 pb-20">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1a0612] via-[#090206] to-[#040103] -z-10" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-[#ff7395]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* TOP OWNER NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-[#ffb8ce]/15 bg-[#0e040b]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff7395] to-[#d81b5c] flex items-center justify-center text-white shadow-md font-bold text-lg">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  LoveCrafted Analytics Portal
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-medium">
                  Live & Isolated
                </span>
              </div>
              <p className="text-[11px] text-[#ffc5d5]/60 font-sans hidden sm:block">
                Zero impact on website speed · Private owner data stream
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              title="Refresh Data"
              className="p-2.5 rounded-xl border border-[#ffb8ce]/20 bg-[#1f0919] text-[#ffc5d5] hover:text-white hover:border-[#ff7395] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              onClick={exportKeepsakesCSV}
              title="Export CSV"
              className="p-2.5 rounded-xl border border-[#ffb8ce]/20 bg-[#1f0919] text-[#ffc5d5] hover:text-white hover:border-[#ff7395] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setIsChangePinOpen(true)}
              title="Change Security PIN"
              className="p-2.5 rounded-xl border border-[#ffb8ce]/20 bg-[#1f0919] text-[#ffc5d5] hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <Key className="size-3.5" />
              <span className="hidden lg:inline">Change PIN</span>
            </button>

            <button
              onClick={handleLock}
              className="px-3.5 py-2.5 rounded-xl bg-[#ff7395]/15 border border-[#ff7395]/30 text-[#ffb8ce] hover:bg-[#ff7395]/25 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <Lock className="size-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* TOP BANNER WITH TEST TOOLS */}
        <div className="rounded-3xl border border-[#ffb8ce]/20 bg-gradient-to-r from-[#1f0918]/80 via-[#150510]/80 to-[#1f0918]/80 p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-lg text-white font-medium flex items-center gap-2">
              <Sparkles className="size-4 text-[#ff7395]" />
              Executive Metrics & Real-Time Pulse
            </h2>
            <p className="text-xs text-[#ffc5d5]/70 max-w-2xl leading-relaxed">
              Tracking every visitor session, page hit, keepsake customization, and published order across devices.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSimulateVisitor}
              className="px-3 py-1.5 rounded-xl border border-[#ffb8ce]/30 bg-[#290d21] text-[11px] font-semibold text-[#ffd0e0] hover:text-white hover:bg-[#ff7395]/20 transition-all cursor-pointer flex items-center gap-1"
            >
              + Simulate Visitor Hit
            </button>
            <button
              type="button"
              onClick={handleSimulateKeepsake}
              className="px-3 py-1.5 rounded-xl border border-[#ffb8ce]/30 bg-[#290d21] text-[11px] font-semibold text-[#ffd0e0] hover:text-white hover:bg-[#ff7395]/20 transition-all cursor-pointer flex items-center gap-1"
            >
              + Simulate Keepsake Created
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              Reset Counters
            </button>
          </div>
        </div>

        {/* 5 EXECUTIVE KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {/* 1. Total Visits */}
          <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#14060f]/80 p-4 sm:p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#ffc5d5]/70 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Total Website Visits</span>
              <Eye className="size-4 text-[#ff7395]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {data?.totalVisits?.toLocaleString() || 0}
            </div>
            <p className="text-[10px] text-emerald-400 font-sans mt-1.5 flex items-center gap-1">
              <TrendingUp className="size-3" /> Pageviews & sessions
            </p>
          </div>

          {/* 2. Unique Visitors */}
          <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#14060f]/80 p-4 sm:p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#ffc5d5]/70 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Unique People</span>
              <Users className="size-4 text-[#dfc19c]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#dfc19c] tracking-tight">
              {data?.uniqueVisitors?.toLocaleString() || 0}
            </div>
            <p className="text-[10px] text-[#dfc19c]/80 font-sans mt-1.5">
              Individual devices / visitors
            </p>
          </div>

          {/* 3. Keepsakes Created */}
          <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#14060f]/80 p-4 sm:p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#ffc5d5]/70 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Keepsakes Crafted</span>
              <Heart className="size-4 text-[#ff7395]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#ff7395] tracking-tight">
              {data?.totalKeepsakesCreated?.toLocaleString() || 0}
            </div>
            <p className="text-[10px] text-pink-300 font-sans mt-1.5">
              Drafts started in studio
            </p>
          </div>

          {/* 4. Keepsakes Published */}
          <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#14060f]/80 p-4 sm:p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#ffc5d5]/70 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Live & Activated</span>
              <Sparkles className="size-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-300 tracking-tight">
              {data?.totalKeepsakesPublished?.toLocaleString() || 0}
            </div>
            <p className="text-[10px] text-emerald-400/80 font-sans mt-1.5">
              Public shareable keepsakes
            </p>
          </div>

          {/* 5. Conversion Rate */}
          <div className="col-span-2 lg:col-span-1 rounded-3xl border border-[#ffb8ce]/20 bg-[#14060f]/80 p-4 sm:p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#ffc5d5]/70 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider">Conversion Rate</span>
              <ArrowUpRight className="size-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-purple-300 tracking-tight">
              {data?.conversionRate || "0.0%"}
            </div>
            <p className="text-[10px] text-purple-300/80 font-sans mt-1.5">
              Visitors who crafted keepsakes
            </p>
          </div>
        </div>

        {/* VISUAL CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: 7-Day Trend (Visits vs Keepsakes) */}
          <div className="lg:col-span-2 rounded-3xl border border-[#ffb8ce]/20 bg-[#12050e]/90 p-5 sm:p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-white">Daily Traffic & Keepsake Growth</h3>
                <p className="text-xs text-[#ffc5d5]/60">Total visits vs romantic keepsakes crafted over the last 7 days</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-sans">
                <span className="flex items-center gap-1.5 text-[#ff7395]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff7395]" /> Visits
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Keepsakes
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7395" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff7395" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorKeepsakes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffb8ce" strokeOpacity={0.08} />
                  <XAxis dataKey="date" stroke="#ffc5d5" strokeOpacity={0.4} fontSize={11} />
                  <YAxis stroke="#ffc5d5" strokeOpacity={0.4} fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c0716",
                      borderColor: "rgba(255, 184, 206, 0.25)",
                      borderRadius: "1rem",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#ff7395"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorVisits)"
                  />
                  <Area
                    type="monotone"
                    dataKey="keepsakes"
                    stroke="#34d399"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorKeepsakes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Device Share */}
          <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#12050e]/90 p-5 sm:p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-white">Visitor Devices</h3>
              <p className="text-xs text-[#ffc5d5]/60">Mobile vs Desktop audience share</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.deviceStats || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(data?.deviceStats || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c0716",
                      borderColor: "rgba(255, 184, 206, 0.25)",
                      borderRadius: "1rem",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ffb8ce]/10 text-center">
              <div>
                <p className="text-[10px] text-[#dfc19c] flex items-center justify-center gap-1">
                  <Laptop className="size-3" /> Desktop
                </p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">
                  {data?.deviceStats?.find((d) => d.name === "Desktop")?.value || 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#ff7395] flex items-center justify-center gap-1">
                  <Smartphone className="size-3" /> Mobile
                </p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">
                  {data?.deviceStats?.find((d) => d.name === "Mobile")?.value || 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-purple-400 flex items-center justify-center gap-1">
                  <Tablet className="size-3" /> Tablet
                </p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">
                  {data?.deviceStats?.find((d) => d.name === "Tablet")?.value || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* POPULAR TEMPLATES & PAGE BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Templates */}
          <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#12050e]/90 p-5 sm:p-6 backdrop-blur-md space-y-4">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Heart className="size-4 text-[#ff7395]" />
              Most Popular Keepsake Templates
            </h3>
            <div className="space-y-3 pt-1">
              {(data?.templateStats || []).length === 0 ? (
                <p className="text-xs text-[#ffc5d5]/50 py-4 text-center">No template creations recorded yet.</p>
              ) : (
                data.templateStats.map((item, idx) => (
                  <div key={item.id} className="p-3 rounded-2xl border border-[#ffb8ce]/15 bg-[#1b0817] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#ff7395]/20 text-[#ffb8ce] font-mono text-xs flex items-center justify-center font-bold">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <p className="text-[10px] font-mono text-[#ffc5d5]/60">Template ID: {item.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-[#ff7395]">
                        {item.count}
                      </span>
                      <span className="text-[10px] text-[#ffc5d5]/60 block">crafted</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Page Views */}
          <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#12050e]/90 p-5 sm:p-6 backdrop-blur-md space-y-4">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Eye className="size-4 text-[#dfc19c]" />
              Page Traffic Breakdown
            </h3>
            <div className="space-y-3 pt-1">
              {(data?.pageStats || []).slice(0, 5).map((page) => (
                <div key={page.path} className="p-3 rounded-2xl border border-[#ffb8ce]/15 bg-[#1b0817] flex items-center justify-between">
                  <div className="font-mono text-xs text-[#ffd0e0] truncate max-w-xs">
                    {page.path === "/" ? "/ (Homepage)" : page.path}
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-[#dfc19c]">
                    {page.count} <span className="text-[10px] text-[#ffc5d5]/50 font-sans font-normal">views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KEEPSAKES CREATION FEED & LOG TABLE */}
        <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#12050e]/90 p-5 sm:p-7 backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="size-4 text-[#ff7395]" />
                Recent Keepsakes Created by Users
              </h3>
              <p className="text-xs text-[#ffc5d5]/60">
                Detailed record of keepsakes customized and published by customers.
              </p>
            </div>

            {/* Template Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="h-9 px-3 rounded-xl border border-[#ffb8ce]/30 bg-[#1b0817] text-xs text-white focus:outline-none"
              >
                <option value="all">All Templates ({data?.recentKeepsakes?.length || 0})</option>
                <option value="celebration-of-you">Celebration of You</option>
                <option value="aurora-noire">Aurora Noire</option>
                <option value="whispers-of-love">Love in Bloom</option>
                <option value="sunset-love">Sunset Love</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#ffb8ce]/15">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#1e0719] text-[#ffd0e0] font-mono text-[11px] uppercase tracking-wider border-b border-[#ffb8ce]/15">
                <tr>
                  <th className="py-3 px-4">Keepsake Title</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Partners</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffb8ce]/10 bg-[#12040e]">
                {filteredKeepsakes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#ffc5d5]/50">
                      No keepsakes matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredKeepsakes.map((k) => (
                    <tr key={k.id} className="hover:bg-[#1f0919]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {k.title}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#ffb8ce]">
                        {k.templateId}
                      </td>
                      <td className="py-3.5 px-4 text-[#ffd0e0]">
                        {k.partner1} & {k.partner2}
                      </td>
                      <td className="py-3.5 px-4">
                        {k.status === "published" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-medium">
                            <CheckCircle2 className="size-2.5" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-medium">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#ffc5d5]/60 text-[11px]">
                        {new Date(k.timestamp).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={k.status === "published" ? `/v/${k.slug}?active=true` : `/editor/${k.templateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff7395] hover:text-white transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT VISITOR STREAM */}
        <div className="rounded-3xl border border-[#ffb8ce]/20 bg-[#12050e]/90 p-5 sm:p-7 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Users className="size-4 text-[#dfc19c]" />
                Live Visitor Traffic Stream
              </h3>
              <p className="text-xs text-[#ffc5d5]/60">Most recent visitor page hits across devices</p>
            </div>
            <span className="text-[11px] font-mono text-[#ffc5d5]/50">
              Showing last {data?.recentVisits?.length || 0} hits
            </span>
          </div>

          <div className="space-y-2">
            {(data?.recentVisits || []).slice(0, 10).map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-2xl border border-[#ffb8ce]/10 bg-[#160613] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-[#ff7395]/15 text-[#ff7395]">
                    {v.device === "Mobile" ? <Smartphone className="size-3.5" /> : <Laptop className="size-3.5" />}
                  </span>
                  <div>
                    <span className="font-mono text-white font-medium">{v.path}</span>
                    <span className="text-[10px] text-[#ffc5d5]/50 block">Source: {v.referrer || "Direct"}</span>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-[#ffc5d5]/60">
                  {new Date(v.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* CHANGE PIN MODAL */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#ffb8ce]/30 bg-[#150612] p-6 text-[#f5e6d3] shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Key className="size-4 text-[#ff7395]" />
              Update Master PIN
            </h3>
            <p className="text-xs text-[#ffc5d5]/70">
              Set a new 4-digit PIN for accessing this owner analytics portal.
            </p>

            <form onSubmit={handleChangePin} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#ffd0e0]">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full h-10 text-center font-mono tracking-widest rounded-xl border border-[#ffb8ce]/30 bg-[#1e071a] text-white focus:outline-none focus:border-[#ff7395]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#ffd0e0]">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full h-10 text-center font-mono tracking-widest rounded-xl border border-[#ffb8ce]/30 bg-[#1e071a] text-white focus:outline-none focus:border-[#ff7395]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePinOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-[#ffb8ce]/20 bg-[#1a0615] text-xs font-semibold text-[#ffc5d5] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#ff7395] to-[#d81b5c] text-xs font-bold text-white shadow-md hover:opacity-90"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
