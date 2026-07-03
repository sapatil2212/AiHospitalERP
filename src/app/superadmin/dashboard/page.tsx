"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SupportModal from "@/components/SupportModal";
import {
  LayoutDashboard, Building2, Activity, Settings, HelpCircle,
  LogOut, Search, Bell, CheckCircle2, Plus,
  Shield, X, ChevronDown, Eye, Power, Trash2, MoreVertical,
  Menu, CreditCard, RefreshCcw, Ban, Play, DollarSign, Users, Stethoscope,
  Inbox, CalendarClock, Phone, Mail,
} from "lucide-react";

type Hospital = {
  id: string; name: string; email: string; mobile: string;
  isVerified: boolean; createdAt: string;
  patients: number; doctors: number; staff: number;
  appointments: number; departments: number;
  trialStartDate: string | null; trialEndDate: string | null;
  subscriptionStatus: string; subscriptionPlan: string | null;
  billingCycle: string | null; subscriptionStartDate: string | null;
  subscriptionEndDate: string | null; paymentsCount: number;
};
type ActivityItem = { time: string; msg: string; type: string };
type DashboardStats = { totalHospitals: number; verifiedHospitals: number; pendingHospitals: number; totalPatients: number; totalDoctors: number; totalStaff: number; totalAppointments: number };
type MonthlyGrowth = { month: string; value: number };
type DemoRequest = {
  id: string; hospitalName: string; adminName: string; email: string;
  mobile: string; city: string | null; preferredDate: string | null;
  preferredTime: string | null; message: string | null; status: string;
  createdAt: string;
};
type DemoStats = { new: number; contacted: number; scheduled: number; converted: number; closed: number; total: number };
type Tab = "overview" | "hospitals" | "demos" | "activity" | "settings";

const DEMO_STATUSES = ["NEW", "CONTACTED", "SCHEDULED", "CONVERTED", "CLOSED"];

const demoStatusStyle = (s: string): { color: string; bg: string; dot: string } => {
  switch (s) {
    case "NEW": return { color: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" };
    case "CONTACTED": return { color: "#b45309", bg: "#fffbeb", dot: "#f59e0b" };
    case "SCHEDULED": return { color: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6" };
    case "CONVERTED": return { color: "#15803d", bg: "#f0fdf4", dot: "#22c55e" };
    case "CLOSED": return { color: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" };
    default: return { color: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" };
  }
};

const formatDemoDate = (d: string | null) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
};
const formatDemoTime = (t: string | null) => {
  if (!t) return "";
  if (t.includes(":")) { const [h, m] = t.split(":"); const hr = parseInt(h, 10); return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`; }
  return t;
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.25)}
input,select,button,textarea{font-family:'Inter',sans-serif}

/* Layout */
.sa-root{display:flex;height:100vh;overflow:hidden;font-family:'Inter',sans-serif;background:#f8fafc;color:#0f172a}
.sa-overlay{display:none;position:fixed;inset:0;background:rgba(15,23,42,0.3);z-index:45;backdrop-filter:blur(6px)}
.sa-overlay.open{display:block}

/* Sidebar */
.sa-sb{width:240px;background:#ffffff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:50;transition:transform .25s cubic-bezier(.4,0,.2,1)}
.sa-sb-logo{display:flex;align-items:center;gap:12px;padding:22px 20px 20px;border-bottom:1px solid #f1f5f9}
.sa-nav{flex:1;padding:20px 12px;overflow-y:auto;display:flex;flex-direction:column;gap:4px}
.sa-nav-label{font-size:10px;font-weight:700;color:#64748b;letter-spacing:.1em;text-transform:uppercase;padding:0 10px;margin:16px 0 6px}
.sa-nav-label:first-child{margin-top:0}
.sa-nav-btn{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border-radius:10px;border:none;background:transparent;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;text-align:left;position:relative}
.sa-nav-btn:hover{background:#f1f5f9;color:#0f172a}
.sa-nav-btn.active{background:rgba(220,38,38,0.06);color:#dc2626;font-weight:600}
.sa-nav-btn.active::before{content:'';position:absolute;left:-12px;top:50%;transform:translateY(-50%);width:3px;height:20px;background:#dc2626;border-radius:0 3px 3px 0;box-shadow:0 0 8px #dc2626}
.sa-nav-btn svg{flex-shrink:0;opacity:.7;transition:transform .2s}
.sa-nav-btn:hover svg{transform:translateX(2px)}
.sa-nav-btn.active svg,.sa-nav-btn:hover svg{opacity:1}
.sa-sb-footer{padding:16px;border-top:1px solid #f1f5f9}
.sa-sb-user{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:10px}
.sa-sb-avatar{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#dc2626,#991b1b);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.sa-sb-uname{font-size:12px;font-weight:600;color:#0f172a}
.sa-sb-urole{font-size:10px;color:#dc2626;font-weight:500;margin-top:1px}
.sa-sb-logout{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:10px;border-radius:8px;border:1px solid rgba(220,38,38,0.15);background:rgba(220,38,38,0.05);color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}
.sa-sb-logout:hover{background:rgba(220,38,38,0.1);border-color:rgba(220,38,38,0.25)}

/* Topbar */
.sa-main{margin-left:240px;flex:1;display:flex;flex-direction:column;height:100vh;overflow:hidden}
.sa-topbar{height:64px;background:#ffffff;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;padding:0 28px;flex-shrink:0}
.sa-burger{display:none;width:36px;height:36px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .15s}
.sa-burger:hover{background:rgba(220,38,38,0.05)}
.sa-search{display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0 12px;height:38px;width:280px;transition:all .2s}
.sa-search:focus-within{border-color:#dc2626;background:#ffffff;box-shadow:0 0 0 3px rgba(220,38,38,0.08)}
.sa-search input{background:transparent;border:none;outline:none;font-size:13px;color:#0f172a;width:100%;font-family:'Inter',sans-serif}
.sa-search input::placeholder{color:#94a3b8}
.sa-topbar-actions{display:flex;align-items:center;gap:10px}
.sa-icon-btn{width:38px;height:38px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;position:relative;flex-shrink:0}
.sa-icon-btn:hover{background:#f1f5f9;border-color:#cbd5e1}
.sa-notif-badge{position:absolute;top:8px;right:8px;width:6px;height:6px;border-radius:50%;background:#dc2626;border:1.5px solid #ffffff;box-shadow:0 0 8px #dc2626}
.sa-profile-btn{display:flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;transition:all .15s}
.sa-profile-btn:hover{background:#f1f5f9;border-color:#cbd5e1}
.sa-profile-av{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,#dc2626,#991b1b);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff}
.sa-profile-name{font-size:12px;font-weight:600;color:#0f172a}
.sa-profile-role{font-size:10px;color:#64748b}

/* Content */
.sa-content{flex:1;overflow-y:auto;padding:28px 28px 40px}
.sa-page-header{margin-bottom:24px}
.sa-page-title{font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-.025em;line-height:1.2}
.sa-page-sub{font-size:13px;color:#64748b;margin-top:4px}

/* Stats Grid */
.sa-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px}
.sa-stat-card{background:#ffffff;border:1px solid #e8ecf0;border-radius:16px;padding:20px;display:flex;align-items:flex-start;gap:14px;transition:all .25s cubic-bezier(.4,0,.2,1)}
.sa-stat-card:hover{border-color:#dc2626;transform:translateY(-2px)}
.sa-stat-icon{width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sa-stat-label{font-size:12px;font-weight:500;color:#64748b;margin-bottom:4px}
.sa-stat-val{font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-.03em;line-height:1}
.sa-stat-sub{font-size:11px;color:#94a3b8;margin-top:6px}

/* Dashboard Cards */
.sa-dashboard-card{background:#ffffff;border:1px solid #e8ecf0;border-radius:16px;overflow:hidden;margin-bottom:24px;width:100%}
.sa-dashboard-card-header{padding:18px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f1f5f9}
.sa-dashboard-card-header-left{display:flex;flex-direction:column;gap:3px}
.sa-dashboard-card-title{font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-0.01em}
.sa-dashboard-card-sub{font-size:12px;color:#64748b}
.sa-dashboard-card-body{padding:24px}

/* Table */
.sa-table-wrap{overflow-x:auto;width:100%}
.sa-table{width:100%;border-collapse:collapse;min-width:700px;font-size:13px}
.sa-table thead tr{border-bottom:1px solid #e2e8f0}
.sa-table th{text-align:left;font-size:11px;font-weight:600;color:#64748b;letter-spacing:.05em;text-transform:uppercase;padding:14px 18px;white-space:nowrap;background:#f8fafc}
.sa-table td{padding:16px 18px;color:#334155;border-bottom:1px solid #f1f5f9;vertical-align:middle}
.sa-table tbody tr:last-child td{border-bottom:none}
.sa-table tbody tr{transition:background .15s}
.sa-table tbody tr:hover td{background:#f8fafc}
.sa-td-main{font-weight:600;color:#0f172a;font-size:13px}
.sa-td-sub{font-size:11px;color:#64748b;margin-top:2px}

/* Badge */
.sa-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap;line-height:1.4}
.sa-badge-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

/* Buttons */
.sa-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:'Inter',sans-serif;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;border:none}
.sa-btn-sm{height:32px;padding:0 12px;border-radius:8px;font-size:12px}
.sa-btn-md{height:40px;padding:0 16px;border-radius:8px;font-size:13px}
.sa-btn-primary{background:linear-gradient(135deg, #dc2626 0%, #991b1b 100%);color:#ffffff;box-shadow:0 4px 12px rgba(220,38,38,0.15)}
.sa-btn-primary:hover{background:linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);box-shadow:0 6px 20px rgba(220,38,38,0.25);transform:translateY(-1px)}
.sa-btn-ghost{background:transparent;color:#64748b;border:1px solid #e2e8f0}
.sa-btn-ghost:hover{background:#f1f5f9;color:#0f172a}
.sa-btn-danger{background:#ef4444;color:#ffffff;box-shadow:0 4px 12px rgba(239,68,68,0.1)}
.sa-btn-danger:hover{background:#dc2626;box-shadow:0 6px 20px rgba(239,68,68,0.2);transform:translateY(-1px)}
.sa-btn:disabled{opacity:.5;cursor:not-allowed;transform:none !important}

/* Action row button */
.sa-action-btn{width:32px;height:32px;border-radius:8px;border:1px solid #e2e8f0;background:#ffffff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0}
.sa-action-btn:hover{background:#f1f5f9;border-color:#cbd5e1;color:#0f172a}

/* Dropdown */
.sa-dropdown{position:fixed;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 12px 36px rgba(0,0,0,0.08);z-index:9999;min-width:200px;padding:6px;overflow:hidden}
.sa-dropdown-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;border:none;background:transparent;text-align:left;cursor:pointer;font-size:12px;font-weight:500;border-radius:7px;transition:all .12s;font-family:'Inter',sans-serif;color:#334155}
.sa-dropdown-item:hover{background:#f1f5f9;color:#0f172a}
.sa-dropdown-divider{height:1px;background:#f1f5f9;margin:4px 0}
.sa-dropdown-section{padding:4px 12px 2px;font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em}

/* Modal */
.sa-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,0.3);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:sa-fade .15s ease}
@keyframes sa-fade{from{opacity:0}to{opacity:1}}
.sa-modal{background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:0;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.08);animation:sa-up .2s ease}
@keyframes sa-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.sa-modal-header{padding:24px 24px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.sa-modal-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sa-modal-title{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:2px}
.sa-modal-sub{font-size:13px;color:#64748b}
.sa-modal-close{width:32px;height:32px;border-radius:7px;border:1px solid #e2e8f0;background:#ffffff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .15s;color:#64748b}
.sa-modal-close:hover{background:#fef2f2;border-color:#fecaca;color:#ef4444}
.sa-modal-body{padding:20px 24px}
.sa-modal-footer{padding:0 24px 24px;display:flex;gap:10px}

/* Form */
.sa-field{margin-bottom:14px}
.sa-label{display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:6px;letter-spacing:.01em}
.sa-input{width:100%;height:40px;padding:0 12px;background:#f9fafb;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;color:#0f172a;font-family:'Inter',sans-serif;outline:none;transition:border-color .15s,box-shadow .15s}
.sa-input:hover{border-color:#cbd5e1}
.sa-input:focus{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,0.08)}
.sa-input::placeholder{color:#cbd5e1}
.sa-select{width:100%;height:40px;padding:0 10px;background:#f9fafb;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;color:#0f172a;font-family:'Inter',sans-serif;outline:none;cursor:pointer;transition:border-color .15s,box-shadow .15s;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
.sa-select:hover{border-color:#cbd5e1}
.sa-select:focus{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,0.08)}
.sa-select option { background:#ffffff; color:#0f172a; }
.sa-textarea{width:100%;padding:10px 12px;background:#f9fafb;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;color:#0f172a;font-family:'Inter',sans-serif;outline:none;resize:vertical;transition:border-color .15s}
.sa-textarea:focus{border-color:#dc2626;box-shadow:0 0 0 3px rgba(220,38,38,0.08)}

/* Info block in modals */
.sa-info-block{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:16px}
.sa-info-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:6px}
.sa-info-row:last-child{margin-bottom:0}
.sa-info-key{color:#64748b;font-weight:500}
.sa-info-val{color:#0f172a;font-weight:600}

/* Alert blocks */
.sa-alert{border-radius:10px;padding:12px 16px;font-size:13px;font-weight:500;margin-bottom:16px}
.sa-alert-warn{background:#fffbeb;border:1px solid #fde68a;color:#b45309}
.sa-alert-danger{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c}
.sa-alert-success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}

/* Messages */
.sa-msg{font-size:12px;text-align:center;padding:8px;border-radius:7px;font-weight:500}
.sa-msg-ok{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.sa-msg-err{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}

/* Activity */
.sa-activity-item{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid #f1f5f9}
.sa-activity-item:last-child{border-bottom:none}
.sa-activity-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px}
.sa-activity-msg{font-size:13px;color:#334155;font-weight:500;line-height:1.5}
.sa-activity-time{font-size:11px;color:#64748b;margin-top:3px}

/* Spinner */
.sa-spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(0,0,0,.15);border-top-color:#0f172a;border-radius:50%;animation:sa-spin .65s linear infinite}
@keyframes sa-spin{to{transform:rotate(360deg)}}
.sa-spin-dark{border:2px solid #e2e8f0;border-top-color:#dc2626}

/* Empty state */
.sa-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 0;gap:12px;color:#64748b}
.sa-empty-icon{width:48px;height:48px;border-radius:12px;background:#f8fafc;display:flex;align-items:center;justify-content:center}
.sa-empty-title{font-size:14px;font-weight:600;color:#475569}
.sa-empty-sub{font-size:12px;color:#64748b}

/* Profile dropdown */
.sa-pdrop{position:absolute;top:calc(100% + 8px);right:0;width:200px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,0.08);z-index:70;padding:6px;overflow:hidden}

/* Responsive */
@media(max-width:1100px){.sa-stats-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .sa-sb{transform:translateX(-100%)}
  .sa-sb.open{transform:translateX(0)}
  .sa-main{margin-left:0}
  .sa-burger{display:flex}
  .sa-search{width:200px}
  .sa-topbar{padding:0 16px;gap:8px}
}
@media(max-width:600px){
  .sa-search{width:140px}
  .sa-profile-name,.sa-profile-role{display:none}
  .sa-content{padding:16px 12px 32px}
  .sa-stats-grid{grid-template-columns:1fr 1fr}
  .sa-topbar{padding:0 12px}
}
`;



export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [newHospital, setNewHospital] = useState({ hospitalName: "", adminName: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [demoStats, setDemoStats] = useState<DemoStats>({ new: 0, contacted: 0, scheduled: 0, converted: 0, closed: 0, total: 0 });
  const [demoLoading, setDemoLoading] = useState(true);
  const [demoStatusUpdating, setDemoStatusUpdating] = useState<string | null>(null);
  const [demoDeleting, setDemoDeleting] = useState<string | null>(null);
  const [viewDemo, setViewDemo] = useState<DemoRequest | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ totalHospitals: 0, verifiedHospitals: 0, pendingHospitals: 0, totalPatients: 0, totalDoctors: 0, totalStaff: 0, totalAppointments: 0 });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [viewHospital, setViewHospital] = useState<Hospital | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Hospital | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top?: number; bottom?: number; right: number; isBelow: boolean } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [subModal, setSubModal] = useState<{ hospital: Hospital; action: string } | null>(null);
  const [subPlan, setSubPlan] = useState("STARTER");
  const [subCycle, setSubCycle] = useState("MONTHLY");
  const [subLoading, setSubLoading] = useState(false);
  const [subMsg, setSubMsg] = useState("");
  const [payModal, setPayModal] = useState<Hospital | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payPlan, setPayPlan] = useState("STARTER");
  const [payCycle, setPayCycle] = useState("MONTHLY");
  const [payNotes, setPayNotes] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState("");
  const [payHistory, setPayHistory] = useState<any[]>([]);
  const [payHistoryLoading, setPayHistoryLoading] = useState(false);

  const [editHospital, setEditHospital] = useState<Hospital | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    isVerified: false,
    subscriptionStatus: "TRIAL",
    subscriptionPlan: "",
    billingCycle: "",
    trialStartDate: "",
    trialEndDate: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
  });

  const openEditModal = (h: Hospital) => {
    setEditHospital(h);
    setEditForm({
      name: h.name,
      email: h.email,
      mobile: h.mobile,
      isVerified: h.isVerified,
      subscriptionStatus: h.subscriptionStatus || "TRIAL",
      subscriptionPlan: h.subscriptionPlan || "",
      billingCycle: h.billingCycle || "",
      trialStartDate: h.trialStartDate ? new Date(h.trialStartDate).toISOString().split('T')[0] : "",
      trialEndDate: h.trialEndDate ? new Date(h.trialEndDate).toISOString().split('T')[0] : "",
      subscriptionStartDate: h.subscriptionStartDate ? new Date(h.subscriptionStartDate).toISOString().split('T')[0] : "",
      subscriptionEndDate: h.subscriptionEndDate ? new Date(h.subscriptionEndDate).toISOString().split('T')[0] : "",
    });
    setActionMenu(null);
  };

  const handleUpdateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHospital) return;
    setUpdating(true);
    setUpdateMsg("");
    try {
      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        mobile: editForm.mobile,
        isVerified: editForm.isVerified,
        subscriptionStatus: editForm.subscriptionStatus,
        subscriptionPlan: editForm.subscriptionPlan || null,
        billingCycle: editForm.billingCycle || null,
        trialStartDate: editForm.trialStartDate || null,
        trialEndDate: editForm.trialEndDate || null,
        subscriptionStartDate: editForm.subscriptionStartDate || null,
        subscriptionEndDate: editForm.subscriptionEndDate || null,
      };

      const res = await fetch(`/api/superadmin/hospitals/${editHospital.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (d.success) {
        setUpdateMsg("✓ Hospital updated successfully!");
        setHospitals(prev => prev.map(x => x.id === editHospital.id ? { ...x, ...payload } : x));
        setTimeout(() => {
          setEditHospital(null);
          setUpdateMsg("");
          window.location.reload();
        }, 1500);
      } else {
        setUpdateMsg(d.message || "Failed to update hospital.");
      }
    } catch {
      setUpdateMsg("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };


  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" }).then(r => r.json()).then(d => {
      if (!d.success || d.data?.role !== "SUPER_ADMIN") router.push("/superadmin/login");
      else setLoading(false);
    }).catch(() => router.push("/superadmin/login"));
  }, [router]);

  useEffect(() => {
    if (loading) return;
    setDataLoading(true);
    fetch("/api/superadmin/dashboard", { credentials: "include" }).then(r => r.json()).then(d => {
      if (d.success) { setHospitals(d.data.hospitals); setStats(d.data.stats); setRecentActivity(d.data.recentActivity); }
    }).catch(console.error).finally(() => setDataLoading(false));
  }, [loading]);

  const loadDemoRequests = () => {
    setDemoLoading(true);
    fetch("/api/demo-requests", { credentials: "include" }).then(r => r.json()).then(d => {
      if (d.success) { setDemoRequests(d.data.requests || []); setDemoStats(d.data.stats); }
    }).catch(console.error).finally(() => setDemoLoading(false));
  };

  useEffect(() => {
    if (loading) return;
    loadDemoRequests();
  }, [loading]);

  const updateDemoStatus = async (id: string, status: string) => {
    setDemoStatusUpdating(id);
    try {
      const res = await fetch(`/api/demo-requests/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ status }),
      });
      const d = await res.json();
      if (d.success) {
        setDemoRequests(prev => prev.map(x => x.id === id ? { ...x, status } : x));
        loadDemoRequests();
      }
    } catch (e) { console.error(e); }
    finally { setDemoStatusUpdating(null); }
  };

  const deleteDemoRequest = async (id: string) => {
    setDemoDeleting(id);
    try {
      const res = await fetch(`/api/demo-requests/${id}`, { method: "DELETE", credentials: "include" });
      const d = await res.json();
      if (d.success) { setDemoRequests(prev => prev.filter(x => x.id !== id)); setViewDemo(null); loadDemoRequests(); }
    } catch (e) { console.error(e); }
    finally { setDemoDeleting(null); }
  };

  useEffect(() => {
    if (loading) return;
    const es = new EventSource("/api/notifications/stream");
    es.onmessage = (e) => { try { const d = JSON.parse(e.data); if (d.unread !== undefined) setUnreadCount(d.unread); } catch {} };
    es.onerror = () => es.close();
    return () => es.close();
  }, [loading]);

  const handleToggleStatus = async (h: Hospital) => {
    setActionLoading(h.id);
    try {
      const res = await fetch(`/api/superadmin/hospitals/${h.id}/toggle`, { method: "PATCH", credentials: "include" });
      const data = await res.json();
      if (data.success) setHospitals(prev => prev.map(x => x.id === h.id ? { ...x, isVerified: !x.isVerified } : x));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); setActionMenu(null); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading(deleteConfirm.id);
    try {
      const res = await fetch(`/api/superadmin/hospitals/${deleteConfirm.id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) { setHospitals(prev => prev.filter(h => h.id !== deleteConfirm.id)); setDeleteConfirm(null); }
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleSubAction = async () => {
    if (!subModal) return;
    setSubLoading(true); setSubMsg("");
    try {
      const body: any = { action: subModal.action };
      if (subModal.action === "activate_subscription") { body.plan = subPlan; body.cycle = subCycle; }
      const res = await fetch(`/api/superadmin/hospitals/${subModal.hospital.id}/subscription`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setSubMsg("✓ " + data.message); setTimeout(() => { setSubModal(null); setSubMsg(""); window.location.reload(); }, 1400); }
      else setSubMsg(data.message || "Failed");
    } catch { setSubMsg("Network error. Please try again."); }
    finally { setSubLoading(false); }
  };

  const openPayModal = async (h: Hospital) => {
    setPayModal(h); setPayAmount(""); setPayNotes(""); setPayMsg("");
    setPayPlan(h.subscriptionPlan || "STARTER"); setPayCycle(h.billingCycle || "MONTHLY");
    setActionMenu(null); setPayHistoryLoading(true);
    try { const res = await fetch(`/api/superadmin/hospitals/${h.id}/subscription`, { credentials: "include" }); const data = await res.json(); if (data.success) setPayHistory(data.data || []); } catch {}
    finally { setPayHistoryLoading(false); }
  };

  const handleRecordPayment = async () => {
    if (!payModal || !payAmount) return;
    setPayLoading(true); setPayMsg("");
    try {
      const res = await fetch(`/api/superadmin/hospitals/${payModal.id}/subscription`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ amount: payAmount, plan: payPlan, cycle: payCycle, notes: payNotes }) });
      const data = await res.json();
      if (data.success) {
        setPayMsg("✓ " + data.message);
        const hRes = await fetch(`/api/superadmin/hospitals/${payModal.id}/subscription`, { credentials: "include" }); const hData = await hRes.json(); if (hData.success) setPayHistory(hData.data || []);
        setTimeout(() => setPayMsg(""), 3000); setPayAmount(""); setPayNotes("");
      } else setPayMsg(data.message || "Failed");
    } catch { setPayMsg("Network error. Please try again."); }
    finally { setPayLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newHospital.password !== newHospital.confirmPassword) {
      setCreateMsg("Passwords do not match");
      return;
    }
    setCreating(true); setCreateMsg("");
    try {
      const res = await fetch("/api/hospital/create", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(newHospital) });
      const d = await res.json();
      if (d.success) { setCreateMsg("✓ Hospital created successfully!"); setTimeout(() => { setShowCreate(false); window.location.reload(); }, 1500); }
      else setCreateMsg(d.message || "Failed to create hospital.");
    } catch { setCreateMsg("Network error. Please try again."); }
    finally { setCreating(false); }
  };

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); router.push("/superadmin/login"); };

  const getSubBadge = (h: Hospital) => {
    const s = h.subscriptionStatus;
    const trialEnd = h.trialEndDate ? new Date(h.trialEndDate) : null;
    if (s === "TRIAL" && trialEnd) {
      const days = Math.ceil((trialEnd.getTime() - Date.now()) / 86400000);
      if (days <= 0) return { label: "Trial Expired", color: "#dc2626", bg: "#fef2f2", dot: "#dc2626" };
      return { label: `Trial · ${days}d left`, color: "#b45309", bg: "#fffbeb", dot: "#f59e0b" };
    }
    if (s === "ACTIVE") return { label: h.subscriptionPlan || "Active", color: "#15803d", bg: "#f0fdf4", dot: "#22c55e" };
    if (s === "EXPIRED") return { label: "Expired", color: "#dc2626", bg: "#fef2f2", dot: "#dc2626" };
    if (s === "SUSPENDED") return { label: "Suspended", color: "#b91c1c", bg: "#fef2f2", dot: "#dc2626" };
    if (s === "CANCELLED") return { label: "Cancelled", color: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" };
    return { label: s || "—", color: "#64748b", bg: "#f1f5f9", dot: "#94a3b8" };
  };

  const filtered = hospitals.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", flexDirection: "column", gap: 16 }}>
      <style>{`@keyframes sa-spin{to{transform:rotate(360deg)}}.sa-spin-dark{display:inline-block;width:28px;height:28px;border:2.5px solid #e2e8f0;border-top-color:#dc2626;border-radius:50%;animation:sa-spin .65s linear infinite}`}</style>
      <div className="sa-spin-dark" />
      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Verifying access...</span>
    </div>
  );

  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { id: "hospitals", label: "Hospitals", icon: <Building2 size={16} /> },
    { id: "demos", label: "Demo Requests", icon: <Inbox size={16} /> },
    { id: "activity", label: "Activity Log", icon: <Activity size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  const STAT_CARDS = [
    { label: "Total Hospitals", val: stats.totalHospitals, sub: `${stats.pendingHospitals} pending approval`, icon: <Building2 size={20} color="#fff" />, iconBg: "#dc2626", trend: null },
    { label: "Active Tenants", val: stats.verifiedHospitals, sub: "verified & enabled", icon: <CheckCircle2 size={20} color="#fff" />, iconBg: "#16a34a", trend: null },
    { label: "Total Patients", val: stats.totalPatients.toLocaleString(), sub: "across all hospitals", icon: <Users size={20} color="#fff" />, iconBg: "#7c3aed", trend: null },
    { label: "Total Doctors", val: stats.totalDoctors.toLocaleString(), sub: "registered practitioners", icon: <Stethoscope size={20} color="#fff" />, iconBg: "#0891b2", trend: null },
  ];

  const subActionLabel: Record<string, string> = {
    activate_subscription: "Activate Subscription",
    extend_trial: "Extend Trial",
    suspend: "Suspend Hospital",
    cancel: "Cancel Subscription",
    reactivate: "Reactivate Hospital",
  };

  const activeHospital = hospitals.find(x => x.id === actionMenu);

  return (
    <>
      <style suppressHydrationWarning>{CSS}</style>

      {/* Edit Hospital Modal */}
      {editHospital && (
        <div className="sa-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setEditHospital(null); }}>
          <div className="sa-modal" style={{ maxWidth: 540 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="sa-modal-icon" style={{ background: "#eff6ff" }}><Building2 size={20} color="#2563eb" /></div>
                <div><div className="sa-modal-title">Edit Hospital Details</div><div className="sa-modal-sub">Modify details and subscription status</div></div>
              </div>
              <button className="sa-modal-close" onClick={() => setEditHospital(null)}><X size={16} color="#64748b" /></button>
            </div>
            <form onSubmit={handleUpdateHospital}>
              <div className="sa-modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                  <div className="sa-field" style={{ gridColumn: "1/-1" }}>
                    <label className="sa-label">Hospital Name</label>
                    <input type="text" className="sa-input" value={editForm.name} onChange={e => setEditForm(n => ({ ...n, name: e.target.value }))} required />
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Contact Email</label>
                    <input type="email" className="sa-input" value={editForm.email} onChange={e => setEditForm(n => ({ ...n, email: e.target.value }))} required />
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Mobile</label>
                    <input type="text" className="sa-input" value={editForm.mobile} onChange={e => setEditForm(n => ({ ...n, mobile: e.target.value }))} required />
                  </div>
                  
                  <div className="sa-field" style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
                    <input type="checkbox" id="edit-verified" checked={editForm.isVerified} onChange={e => setEditForm(n => ({ ...n, isVerified: e.target.checked }))} style={{ cursor: "pointer" }} />
                    <label htmlFor="edit-verified" className="sa-label" style={{ margin: 0, cursor: "pointer" }}>Is Verified / Account Enabled</label>
                  </div>

                  <div className="sa-dropdown-divider" style={{ gridColumn: "1/-1", margin: "12px 0" }} />
                  
                  <div className="sa-field">
                    <label className="sa-label">Subscription Status</label>
                    <select className="sa-select" value={editForm.subscriptionStatus} onChange={e => setEditForm(n => ({ ...n, subscriptionStatus: e.target.value }))}>
                      <option value="TRIAL">Trial</option>
                      <option value="ACTIVE">Active</option>
                      <option value="EXPIRED">Expired</option>
                      <option value="SUSPENDED">Suspended</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Subscription Plan</label>
                    <select className="sa-select" value={editForm.subscriptionPlan} onChange={e => setEditForm(n => ({ ...n, subscriptionPlan: e.target.value }))}>
                      <option value="">None (Trial / Expired)</option>
                      <option value="STARTER">Starter</option>
                      <option value="PROFESSIONAL">Professional</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Billing Cycle</label>
                    <select className="sa-select" value={editForm.billingCycle} onChange={e => setEditForm(n => ({ ...n, billingCycle: e.target.value }))}>
                      <option value="">None</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                  <div className="sa-field" />

                  <div className="sa-field">
                    <label className="sa-label">Trial Start Date</label>
                    <input type="date" className="sa-input" value={editForm.trialStartDate} onChange={e => setEditForm(n => ({ ...n, trialStartDate: e.target.value }))} />
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Trial End Date</label>
                    <input type="date" className="sa-input" value={editForm.trialEndDate} onChange={e => setEditForm(n => ({ ...n, trialEndDate: e.target.value }))} />
                  </div>

                  <div className="sa-field">
                    <label className="sa-label">Subscription Start Date</label>
                    <input type="date" className="sa-input" value={editForm.subscriptionStartDate} onChange={e => setEditForm(n => ({ ...n, subscriptionStartDate: e.target.value }))} />
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Subscription End Date</label>
                    <input type="date" className="sa-input" value={editForm.subscriptionEndDate} onChange={e => setEditForm(n => ({ ...n, subscriptionEndDate: e.target.value }))} />
                  </div>
                </div>
                {updateMsg && <div className={`sa-msg ${updateMsg.startsWith("✓") ? "sa-msg-ok" : "sa-msg-err"}`} style={{ marginTop: 12 }}>{updateMsg}</div>}
              </div>
              <div className="sa-modal-footer">
                <button type="button" className="sa-btn sa-btn-md sa-btn-ghost" style={{ flex: 1 }} onClick={() => setEditHospital(null)}>Cancel</button>
                <button type="submit" className="sa-btn sa-btn-md sa-btn-primary" style={{ flex: 2, background: "#2563eb" }} disabled={updating}>
                  {updating ? <span className="sa-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Hospital Modal */}
      {showCreate && (
        <div className="sa-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div className="sa-modal" style={{ maxWidth: 480 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="sa-modal-icon" style={{ background: "#fef2f2" }}><Building2 size={20} color="#dc2626" /></div>
                <div><div className="sa-modal-title">Onboard New Hospital</div><div className="sa-modal-sub">Create a tenant and its first admin account</div></div>
              </div>
              <button className="sa-modal-close" onClick={() => setShowCreate(false)}><X size={16} color="#64748b" /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="sa-modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                  {[
                    { key: "hospitalName", label: "Hospital Name", placeholder: "City General Hospital", span: 2 },
                    { key: "adminName", label: "Admin Name", placeholder: "Dr. John Doe", span: 1 },
                    { key: "mobile", label: "Mobile", placeholder: "+91 9876543210", span: 1 },
                    { key: "email", label: "Email Address", placeholder: "admin@hospital.com", span: 2 },
                    { key: "password", label: "Password", placeholder: "Min. 6 characters", span: 1 },
                    { key: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter password", span: 1 },
                  ].map(f => (
                    <div key={f.key} className="sa-field" style={{ gridColumn: f.span === 2 ? "1/-1" : undefined }}>
                      <label className="sa-label">{f.label}</label>
                      <input type={f.key.toLowerCase().includes("password") ? "password" : "text"} className="sa-input" placeholder={f.placeholder} value={(newHospital as any)[f.key]} onChange={e => setNewHospital(n => ({ ...n, [f.key]: e.target.value }))} required />
                    </div>
                  ))}
                </div>
                {createMsg && <div className={`sa-msg ${createMsg.startsWith("✓") ? "sa-msg-ok" : "sa-msg-err"}`} style={{ marginTop: 4 }}>{createMsg}</div>}
              </div>
              <div className="sa-modal-footer">
                <button type="button" className="sa-btn sa-btn-md sa-btn-ghost" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="sa-btn sa-btn-md sa-btn-primary" style={{ flex: 1 }} disabled={creating}>
                  {creating ? <span className="sa-spin" /> : <><Plus size={15} />Create Hospital</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {subModal && (
        <div className="sa-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) { setSubModal(null); setSubMsg(""); } }}>
          <div className="sa-modal" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="sa-modal-icon" style={{ background: "#f5f3ff" }}><CreditCard size={20} color="#7c3aed" /></div>
                <div><div className="sa-modal-title">{subActionLabel[subModal.action] || "Manage Subscription"}</div><div className="sa-modal-sub">{subModal.hospital.name}</div></div>
              </div>
              <button className="sa-modal-close" onClick={() => { setSubModal(null); setSubMsg(""); }}><X size={16} color="#64748b" /></button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-info-block">
                <div className="sa-info-row">
                  <span className="sa-info-key">Current Status</span>
                  <span className="sa-info-val">{getSubBadge(subModal.hospital).label}</span>
                </div>
                {subModal.hospital.subscriptionPlan && (
                  <div className="sa-info-row">
                    <span className="sa-info-key">Plan</span>
                    <span className="sa-info-val">{subModal.hospital.subscriptionPlan} / {subModal.hospital.billingCycle?.toLowerCase()}</span>
                  </div>
                )}
              </div>
              {subModal.action === "activate_subscription" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                  <div className="sa-field">
                    <label className="sa-label">Subscription Plan</label>
                    <select className="sa-select" value={subPlan} onChange={e => setSubPlan(e.target.value)}>
                      <option value="STARTER">Starter</option>
                      <option value="PROFESSIONAL">Professional</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </div>
                  <div className="sa-field">
                    <label className="sa-label">Billing Cycle</label>
                    <select className="sa-select" value={subCycle} onChange={e => setSubCycle(e.target.value)}>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                </div>
              )}
              {subModal.action === "extend_trial" && <div className="sa-alert sa-alert-warn">The trial will be extended by 14 days from today.</div>}
              {(subModal.action === "suspend" || subModal.action === "cancel") && <div className="sa-alert sa-alert-danger">{subModal.action === "suspend" ? "Hospital will be suspended. All users will be blocked from logging in." : "Subscription will be cancelled. This cannot be automatically reversed."}</div>}
              {subModal.action === "reactivate" && <div className="sa-alert sa-alert-success">{subModal.hospital.subscriptionPlan ? "Hospital will be reactivated under their existing subscription plan." : "Hospital will receive a fresh 14-day trial period."}</div>}
              {subMsg && <div className={`sa-msg ${subMsg.startsWith("✓") ? "sa-msg-ok" : "sa-msg-err"}`} style={{ marginTop: 4 }}>{subMsg}</div>}
            </div>
            <div className="sa-modal-footer">
              <button type="button" className="sa-btn sa-btn-md sa-btn-ghost" style={{ flex: 1 }} onClick={() => { setSubModal(null); setSubMsg(""); }}>Cancel</button>
              <button type="button" className="sa-btn sa-btn-md sa-btn-primary" style={{ flex: 2, background: (subModal.action === "suspend" || subModal.action === "cancel") ? "#ef4444" : "#dc2626" }} disabled={subLoading} onClick={handleSubAction}>
                {subLoading ? <span className="sa-spin" /> : subActionLabel[subModal.action]?.split(" ")[0] + " " + (subActionLabel[subModal.action]?.split(" ").slice(1).join(" ") || "")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {payModal && (
        <div className="sa-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) { setPayModal(null); setPayMsg(""); } }}>
          <div className="sa-modal" style={{ maxWidth: 520 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="sa-modal-icon" style={{ background: "#f0fdf4" }}><DollarSign size={20} color="#16a34a" /></div>
                <div><div className="sa-modal-title">Payment Tracker</div><div className="sa-modal-sub">{payModal.name}</div></div>
              </div>
              <button className="sa-modal-close" onClick={() => { setPayModal(null); setPayMsg(""); }}><X size={16} color="#64748b" /></button>
            </div>
            <div className="sa-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                <div className="sa-field" style={{ gridColumn: "1/-1" }}>
                  <label className="sa-label">Amount (INR)</label>
                  <input type="number" className="sa-input" placeholder="e.g. 5000" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                </div>
                <div className="sa-field">
                  <label className="sa-label">Subscription Plan</label>
                  <select className="sa-select" value={payPlan} onChange={e => setPayPlan(e.target.value)}>
                    <option value="STARTER">Starter</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
                <div className="sa-field">
                  <label className="sa-label">Billing Cycle</label>
                  <select className="sa-select" value={payCycle} onChange={e => setPayCycle(e.target.value)}>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div className="sa-field" style={{ gridColumn: "1/-1" }}>
                  <label className="sa-label">Notes (Optional)</label>
                  <input type="text" className="sa-input" placeholder="Payment reference, cheque no., etc." value={payNotes} onChange={e => setPayNotes(e.target.value)} />
                </div>
              </div>
              {payMsg && <div className={`sa-msg ${payMsg.startsWith("✓") ? "sa-msg-ok" : "sa-msg-err"}`} style={{ marginBottom: 12 }}>{payMsg}</div>}
              <button type="button" className="sa-btn sa-btn-md sa-btn-primary" style={{ width: "100%", background: "#16a34a" }} disabled={payLoading || !payAmount} onClick={handleRecordPayment}>
                {payLoading ? <span className="sa-spin" /> : <><DollarSign size={15} />Record Payment & Activate</>}
              </button>

              {/* Payment History */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Payment History</div>
                {payHistoryLoading ? (
                  <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>Loading...</div>
                ) : payHistory.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>No payments recorded yet.</div>
                ) : (
                  <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                    {payHistory.map((p: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>₹{Number(p.amount)?.toLocaleString()}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{p.plan} · {p.cycle?.toLowerCase()}{p.notes ? ` · ${p.notes}` : ""}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#334155" }}>{new Date(p.paidAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>Valid till {new Date(p.validUntil).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Hospital Modal */}
      {viewHospital && (
        <div className="sa-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setViewHospital(null); }}>
          <div className="sa-modal" style={{ maxWidth: 560 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="sa-modal-icon" style={{ background: "#eff6ff" }}><Building2 size={20} color="#3b82f6" /></div>
                <div><div className="sa-modal-title">{viewHospital.name}</div><div className="sa-modal-sub">Hospital Details</div></div>
              </div>
              <button className="sa-modal-close" onClick={() => setViewHospital(null)}><X size={16} color="#64748b" /></button>
            </div>
            <div className="sa-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Email", value: viewHospital.email },
                  { label: "Mobile", value: viewHospital.mobile },
                  { label: "Patients", value: viewHospital.patients },
                  { label: "Doctors", value: viewHospital.doctors },
                  { label: "Staff", value: viewHospital.staff },
                  { label: "Departments", value: viewHospital.departments },
                  { label: "Joined", value: new Date(viewHospital.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
                  { label: "Payments Made", value: viewHospital.paymentsCount },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px 14px", borderRadius: 9, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Subscription Info</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Status", value: getSubBadge(viewHospital).label },
                    { label: "Plan", value: viewHospital.subscriptionPlan || "N/A" },
                    { label: "Cycle", value: viewHospital.billingCycle || "N/A" },
                    { label: "Trial Start", value: viewHospital.trialStartDate ? new Date(viewHospital.trialStartDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "N/A" },
                    { label: "Trial End", value: viewHospital.trialEndDate ? new Date(viewHospital.trialEndDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "N/A" },
                    { label: "Sub. End", value: viewHospital.subscriptionEndDate ? new Date(viewHospital.subscriptionEndDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "N/A" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="sa-modal-footer">
              <button type="button" className="sa-btn sa-btn-md sa-btn-ghost" style={{ flex: 1 }} onClick={() => setViewHospital(null)}>Close</button>
              <button type="button" className="sa-btn sa-btn-md sa-btn-primary" style={{ flex: 2 }} onClick={() => { setSubModal({ hospital: viewHospital, action: "activate_subscription" }); setSubPlan(viewHospital.subscriptionPlan || "STARTER"); setSubCycle(viewHospital.billingCycle || "MONTHLY"); setViewHospital(null); }}>
                <CreditCard size={15} />Manage Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="sa-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="sa-modal" style={{ maxWidth: 420 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="sa-modal-icon" style={{ background: "#fef2f2" }}><Trash2 size={20} color="#dc2626" /></div>
                <div><div className="sa-modal-title">Delete Hospital</div><div className="sa-modal-sub">This action cannot be undone</div></div>
              </div>
              <button className="sa-modal-close" onClick={() => setDeleteConfirm(null)}><X size={16} color="#64748b" /></button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-alert sa-alert-danger" style={{ marginBottom: 12 }}>
                You are about to permanently delete <strong>&quot;{deleteConfirm.name}&quot;</strong> and all associated data.
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 9, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>This will delete:</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[`${deleteConfirm.patients} patient records`, `${deleteConfirm.doctors} doctor accounts`, `${deleteConfirm.staff} staff members`, "All appointments, billing & clinical data"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="sa-modal-footer">
              <button type="button" className="sa-btn sa-btn-md sa-btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button type="button" className="sa-btn sa-btn-md sa-btn-danger" style={{ flex: 2 }} onClick={handleDelete} disabled={actionLoading === deleteConfirm.id}>
                {actionLoading === deleteConfirm.id ? <span className="sa-spin" /> : <><Trash2 size={15} />Delete Permanently</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Shell */}
      <div className="sa-root">
        {sidebarOpen && <div className="sa-overlay open" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`sa-sb${sidebarOpen ? " open" : ""}`}>
          <div className="sa-sb-logo" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 20px" }}>
            <img src="/logo/aihospitalerp-logo.png" alt="AiHospitalERP" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </div>
          <nav className="sa-nav">
            <div className="sa-nav-label">Navigation</div>
            {NAV.map(n => (
              <button key={n.id} className={`sa-nav-btn${tab === n.id ? " active" : ""}`} onClick={() => { setTab(n.id); setSidebarOpen(false); }}>
                {n.icon}{n.label}
              </button>
            ))}
            <div className="sa-nav-label">Support</div>
            <button className="sa-nav-btn" onClick={() => setSupportOpen(true)}><HelpCircle size={16} />Help & Support</button>
          </nav>
          <div className="sa-sb-footer">
            <div className="sa-sb-user">
              <div className="sa-sb-avatar">SA</div>
              <div><div className="sa-sb-uname">Super Admin</div><div className="sa-sb-urole">Root Access</div></div>
            </div>
            <button className="sa-sb-logout" onClick={logout}><LogOut size={14} />Log Out</button>
          </div>
        </aside>

        {/* Main */}
        <main className="sa-main">
          {/* Topbar */}
          <header className="sa-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="sa-burger" onClick={() => setSidebarOpen(o => !o)}>
                {sidebarOpen ? <X size={18} color="#dc2626" /> : <Menu size={18} color="#64748b" />}
              </button>
              <div className="sa-search">
                <Search size={15} color="#94a3b8" />
                <input placeholder="Search hospitals..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="sa-topbar-actions">
              <button className="sa-icon-btn">
                <Bell size={17} color="#64748b" />
                {unreadCount > 0 && <span className="sa-notif-badge" />}
              </button>
              <div style={{ position: "relative" }}>
                <button className="sa-profile-btn" onClick={() => setProfileOpen(o => !o)}>
                  <div className="sa-profile-av">SA</div>
                  <div><div className="sa-profile-name">Super Admin</div><div className="sa-profile-role">Root</div></div>
                  <ChevronDown size={14} color="#94a3b8" />
                </button>
                {profileOpen && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 60 }} onClick={() => setProfileOpen(false)} />
                    <div className="sa-pdrop">
                      <button className="sa-dropdown-item" style={{ color: "#ef4444" }} onClick={logout} onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <LogOut size={15} color="#ef4444" />Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="sa-content">
            {/* ─── Overview ─── */}
            {tab === "overview" && (
              <>
                <div className="sa-page-header">
                  <div className="sa-page-title">Dashboard</div>
                  <div className="sa-page-sub">Platform overview — all hospitals and subscriptions at a glance</div>
                </div>

                <div className="sa-stats-grid">
                  {STAT_CARDS.map((s, i) => (
                    <div key={i} className="sa-stat-card">
                      <div className="sa-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                      <div>
                        <div className="sa-stat-label">{s.label}</div>
                        <div className="sa-stat-val">{s.val}</div>
                        <div className="sa-stat-sub">{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sa-dashboard-card">
                  <div className="sa-dashboard-card-header">
                    <div className="sa-dashboard-card-header-left">
                      <div className="sa-dashboard-card-title">Registered Hospitals</div>
                      <div className="sa-dashboard-card-sub">{hospitals.length} tenants onboarded</div>
                    </div>
                    <button className="sa-btn sa-btn-sm sa-btn-primary" style={{ padding: "0 10px", gap: 4 }} onClick={() => setShowCreate(true)}><Plus size={14} />Add Hospital</button>
                  </div>
                  {dataLoading ? (
                    <div style={{ padding: 48, textAlign: "center" }}>
                      <div style={{ display: "inline-block", width: 24, height: 24, border: "2px solid #e2e8f0", borderTop: "2px solid #dc2626", borderRadius: "50%", animation: "sa-spin .65s linear infinite" }} />
                    </div>
                  ) : (
                    <div className="sa-table-wrap">
                      <table className="sa-table">
                        <thead><tr><th>#</th><th>Hospital</th><th>Email</th><th>Subscription</th><th>Patients</th><th>Status</th><th>Joined</th><th></th></tr></thead>
                        <tbody>
                          {filtered.length === 0 ? (
                            <tr><td colSpan={8}>
                              <div className="sa-empty"><div className="sa-empty-icon"><Building2 size={22} color="#94a3b8" /></div><div className="sa-empty-title">No hospitals found</div><div className="sa-empty-sub">Try adjusting your search filter</div></div>
                            </td></tr>
                          ) : filtered.map((h, i) => {
                            const sb = getSubBadge(h);
                            return (
                              <tr key={h.id}>
                                <td style={{ color: "#94a3b8", fontSize: 12, width: 40 }}>{i + 1}</td>
                                <td>
                                  <div className="sa-td-main">{h.name}</div>
                                  <div className="sa-td-sub">{h.mobile}</div>
                                </td>
                                <td style={{ color: "#64748b" }}>{h.email}</td>
                                <td>
                                  <span className="sa-badge" style={{ background: sb.bg, color: sb.color }}>
                                    <span className="sa-badge-dot" style={{ background: sb.dot }} />{sb.label}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 600, color: "#0f172a" }}>{h.patients.toLocaleString()}</td>
                                <td>
                                  <span className="sa-badge" style={h.isVerified ? { background: "#f0fdf4", color: "#15803d" } : { background: "#fefce8", color: "#b45309" }}>
                                    <span className="sa-badge-dot" style={{ background: h.isVerified ? "#22c55e" : "#f59e0b" }} />
                                    {h.isVerified ? "Active" : "Pending"}
                                  </span>
                                </td>
                                <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(h.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                                <td>
                                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                    <button className="sa-action-btn" onClick={() => setViewHospital(h)} title="View details"><Eye size={15} color="#64748b" /></button>
                                    <button className="sa-action-btn" title="More actions" onClick={(e) => {
                                        const r = e.currentTarget.getBoundingClientRect();
                                        const spaceAbove = r.top;
                                        const useDropdownBelow = spaceAbove < 320;
                                        setMenuPos(useDropdownBelow ? {
                                          top: r.bottom + 6,
                                          right: window.innerWidth - r.right,
                                          isBelow: true
                                        } : {
                                          bottom: window.innerHeight - r.top + 6,
                                          right: window.innerWidth - r.right,
                                          isBelow: false
                                        });
                                        setActionMenu(actionMenu === h.id ? null : h.id);
                                    }}><MoreVertical size={15} color="#64748b" /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ─── Hospitals ─── */}
            {tab === "hospitals" && (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                  <div><div className="sa-page-title">All Hospitals</div><div className="sa-page-sub">{filtered.length} of {hospitals.length} hospitals</div></div>
                  <button className="sa-btn sa-btn-md sa-btn-primary" style={{ padding: "0 12px", gap: 4 }} onClick={() => setShowCreate(true)}><Plus size={15} />Add Hospital</button>
                </div>
                <div className="sa-dashboard-card">
                  {dataLoading ? (
                    <div style={{ padding: 48, textAlign: "center" }}>
                      <div style={{ display: "inline-block", width: 24, height: 24, border: "2px solid #e2e8f0", borderTop: "2px solid #dc2626", borderRadius: "50%", animation: "sa-spin .65s linear infinite" }} />
                    </div>
                  ) : (
                    <div className="sa-table-wrap">
                      <table className="sa-table">
                        <thead><tr><th>#</th><th>Hospital</th><th>Contact</th><th>Subscription</th><th>Plan / Cycle</th><th>Patients</th><th>Doctors</th><th>Status</th><th>Joined</th><th></th></tr></thead>
                        <tbody>
                          {filtered.length === 0 ? (
                            <tr><td colSpan={10}><div className="sa-empty"><div className="sa-empty-icon"><Building2 size={22} color="#94a3b8" /></div><div className="sa-empty-title">No hospitals found</div></div></td></tr>
                          ) : filtered.map((h, i) => {
                            const sb = getSubBadge(h);
                            return (
                              <tr key={h.id}>
                                <td style={{ color: "#94a3b8", fontSize: 12, width: 40 }}>{i + 1}</td>
                                <td><div className="sa-td-main">{h.name}</div></td>
                                <td>
                                  <div style={{ fontSize: 12, color: "#334155" }}>{h.email}</div>
                                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{h.mobile}</div>
                                </td>
                                <td><span className="sa-badge" style={{ background: sb.bg, color: sb.color }}><span className="sa-badge-dot" style={{ background: sb.dot }} />{sb.label}</span></td>
                                <td style={{ fontSize: 12, color: "#64748b" }}>{h.subscriptionPlan || "—"}{h.billingCycle ? ` / ${h.billingCycle.toLowerCase()}` : ""}</td>
                                <td style={{ fontWeight: 600, color: "#0f172a" }}>{h.patients}</td>
                                <td style={{ fontWeight: 600, color: "#0f172a" }}>{h.doctors}</td>
                                <td><span className="sa-badge" style={h.isVerified ? { background: "#f0fdf4", color: "#15803d" } : { background: "#fefce8", color: "#b45309" }}><span className="sa-badge-dot" style={{ background: h.isVerified ? "#22c55e" : "#f59e0b" }} />{h.isVerified ? "Active" : "Pending"}</span></td>
                                <td style={{ fontSize: 12, color: "#64748b" }}>{new Date(h.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}</td>
                                <td>
                                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                    <button className="sa-action-btn" onClick={() => setViewHospital(h)}><Eye size={15} color="#64748b" /></button>
                                    <button className="sa-action-btn" title="More actions" onClick={(e) => {
                                        const r = e.currentTarget.getBoundingClientRect();
                                        const spaceAbove = r.top;
                                        const useDropdownBelow = spaceAbove < 320;
                                        setMenuPos(useDropdownBelow ? {
                                          top: r.bottom + 6,
                                          right: window.innerWidth - r.right,
                                          isBelow: true
                                        } : {
                                          bottom: window.innerHeight - r.top + 6,
                                          right: window.innerWidth - r.right,
                                          isBelow: false
                                        });
                                        setActionMenu(actionMenu === h.id ? null : h.id);
                                    }}><MoreVertical size={15} color="#64748b" /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ─── Demo Requests ─── */}
            {tab === "demos" && (
              <>
                <div className="sa-page-header">
                  <div className="sa-page-title">Demo Requests</div>
                  <div className="sa-page-sub">Leads submitted from the website Contact / Book a Demo page</div>
                </div>

                {/* Stats */}
                <div className="sa-stats-grid">
                  {[
                    { label: "Total Requests", val: demoStats.total, sub: "all time", icon: <Inbox size={20} color="#fff" />, iconBg: "#dc2626" },
                    { label: "New", val: demoStats.new, sub: "awaiting contact", icon: <Bell size={20} color="#fff" />, iconBg: "#3b82f6" },
                    { label: "Scheduled", val: demoStats.scheduled, sub: "demo booked", icon: <CalendarClock size={20} color="#fff" />, iconBg: "#8b5cf6" },
                    { label: "Converted", val: demoStats.converted, sub: "became customers", icon: <CheckCircle2 size={20} color="#fff" />, iconBg: "#16a34a" },
                  ].map((s) => (
                    <div key={s.label} className="sa-stat-card">
                      <div className="sa-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                      <div>
                        <div className="sa-stat-label">{s.label}</div>
                        <div className="sa-stat-val">{s.val}</div>
                        <div className="sa-stat-sub">{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sa-dashboard-card">
                  <div className="sa-dashboard-card-header">
                    <div className="sa-dashboard-card-header-left">
                      <div className="sa-dashboard-card-title">All Demo Requests</div>
                      <div className="sa-dashboard-card-sub">{demoRequests.length} request{demoRequests.length === 1 ? "" : "s"}</div>
                    </div>
                    <button className="sa-btn sa-btn-ghost sa-btn-sm" onClick={loadDemoRequests} disabled={demoLoading}>
                      <RefreshCcw size={14} /> Refresh
                    </button>
                  </div>
                  <div className="sa-dashboard-card-body" style={{ padding: 0 }}>
                    {demoLoading ? (
                      <div className="sa-empty"><div className="sa-spin sa-spin-dark" /><div className="sa-empty-sub">Loading demo requests...</div></div>
                    ) : demoRequests.length === 0 ? (
                      <div className="sa-empty">
                        <div className="sa-empty-icon"><Inbox size={22} color="#94a3b8" /></div>
                        <div className="sa-empty-title">No demo requests yet</div>
                        <div className="sa-empty-sub">New requests from the Contact page will appear here</div>
                      </div>
                    ) : (
                      <div className="sa-table-wrap">
                        <table className="sa-table">
                          <thead>
                            <tr>
                              <th>Hospital / Contact</th>
                              <th>Contact Info</th>
                              <th>Preferred Slot</th>
                              <th>Submitted</th>
                              <th>Status</th>
                              <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {demoRequests.map((d) => {
                              const st = demoStatusStyle(d.status);
                              return (
                                <tr key={d.id}>
                                  <td>
                                    <div className="sa-td-main">{d.hospitalName}</div>
                                    <div className="sa-td-sub">{d.adminName}{d.city ? ` · ${d.city}` : ""}</div>
                                  </td>
                                  <td>
                                    <div className="sa-td-sub" style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={12} /> {d.email}</div>
                                    <div className="sa-td-sub" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}><Phone size={12} /> {d.mobile}</div>
                                  </td>
                                  <td>
                                    <div className="sa-td-main" style={{ fontSize: 12 }}>{formatDemoDate(d.preferredDate)}</div>
                                    <div className="sa-td-sub">{formatDemoTime(d.preferredTime)}</div>
                                  </td>
                                  <td>
                                    <div className="sa-td-sub">{formatDemoDate(d.createdAt)}</div>
                                  </td>
                                  <td>
                                    <select
                                      className="sa-select"
                                      style={{ height: 32, fontSize: 12, width: 140, color: st.color, background: st.bg, borderColor: "transparent", fontWeight: 600 }}
                                      value={d.status}
                                      disabled={demoStatusUpdating === d.id}
                                      onChange={(e) => updateDemoStatus(d.id, e.target.value)}
                                    >
                                      {DEMO_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                                    </select>
                                  </td>
                                  <td>
                                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                      <button className="sa-action-btn" title="View details" onClick={() => setViewDemo(d)}><Eye size={14} /></button>
                                      <button className="sa-action-btn" title="Delete" style={{ color: "#ef4444" }} disabled={demoDeleting === d.id} onClick={() => deleteDemoRequest(d.id)}>
                                        {demoDeleting === d.id ? <span className="sa-spin sa-spin-dark" /> : <Trash2 size={14} />}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ─── Activity ─── */}
            {tab === "activity" && (
              <>
                <div className="sa-page-header">
                  <div className="sa-page-title">Activity Log</div>
                  <div className="sa-page-sub">Recent platform events and actions</div>
                </div>
                <div className="sa-dashboard-card">
                  <div className="sa-dashboard-card-body">
                    {recentActivity.length === 0 ? (
                      <div className="sa-empty"><div className="sa-empty-icon"><Activity size={22} color="#94a3b8" /></div><div className="sa-empty-title">No recent activity</div><div className="sa-empty-sub">Events will appear here as they occur</div></div>
                    ) : recentActivity.map((a, i) => (
                      <div key={i} className="sa-activity-item">
                        <div className="sa-activity-dot" style={{ background: a.type === "success" ? "#22c55e" : a.type === "warn" ? "#f59e0b" : a.type === "danger" ? "#ef4444" : "#3b82f6" }} />
                        <div>
                          <div className="sa-activity-msg">{a.msg}</div>
                          <div className="sa-activity-time">{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── Settings ─── */}
            {tab === "settings" && (
              <>
                <div className="sa-page-header">
                  <div className="sa-page-title">Settings</div>
                  <div className="sa-page-sub">Platform configuration and system information</div>
                </div>
                <div className="sa-dashboard-card">
                  <div className="sa-dashboard-card-header">
                    <div className="sa-dashboard-card-header-left">
                      <div className="sa-dashboard-card-title">System Information</div>
                    </div>
                  </div>
                  <div className="sa-dashboard-card-body">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        ["Platform", "AiHospitalERP SaaS"],
                        ["Role", "Super Administrator"],
                        ["Timezone", "IST (UTC+5:30)"],
                        ["Authentication", "JWT + HTTP-only Cookies"],
                        ["Session TTL", "7 Days"],
                        ["Database", "MySQL · TiDB Cloud"],
                      ].map(([k, v]) => (
                        <div key={k} style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{k}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {actionMenu && activeHospital && menuPos && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 9998 }} onClick={() => { setActionMenu(null); setMenuPos(null); }} />
          <div className="sa-dropdown" style={{
            position: "fixed",
            right: menuPos.right,
            zIndex: 9999,
            ...(menuPos.isBelow ? { top: menuPos.top } : { bottom: menuPos.bottom })
          }}>
            <div className="sa-dropdown-section">Subscription</div>
            <button className="sa-dropdown-item" style={{ color: "#7c3aed" }} onClick={() => { setSubModal({ hospital: activeHospital, action: "activate_subscription" }); setSubPlan(activeHospital.subscriptionPlan || "STARTER"); setSubCycle(activeHospital.billingCycle || "MONTHLY"); setActionMenu(null); }} onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <CreditCard size={14} />Manage Subscription
            </button>
            <button className="sa-dropdown-item" style={{ color: "#16a34a" }} onClick={() => openPayModal(activeHospital)} onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <DollarSign size={14} />Record Payment
            </button>
            {(activeHospital.subscriptionStatus === "TRIAL" || activeHospital.subscriptionStatus === "EXPIRED") && (
              <button className="sa-dropdown-item" style={{ color: "#b45309" }} onClick={() => { setSubModal({ hospital: activeHospital, action: "extend_trial" }); setActionMenu(null); }} onMouseEnter={e => e.currentTarget.style.background = "#fffbeb"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <RefreshCcw size={14} />Extend Trial
              </button>
            )}
            {(activeHospital.subscriptionStatus === "SUSPENDED" || activeHospital.subscriptionStatus === "CANCELLED") && (
              <button className="sa-dropdown-item" style={{ color: "#16a34a" }} onClick={() => { setSubModal({ hospital: activeHospital, action: "reactivate" }); setActionMenu(null); }} onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Play size={14} />Reactivate
              </button>
            )}
            {activeHospital.subscriptionStatus === "ACTIVE" && (
              <button className="sa-dropdown-item" style={{ color: "#b45309" }} onClick={() => { setSubModal({ hospital: activeHospital, action: "suspend" }); setActionMenu(null); }} onMouseEnter={e => e.currentTarget.style.background = "#fffbeb"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Ban size={14} />Suspend
              </button>
            )}
            <div className="sa-dropdown-divider" />
            <div className="sa-dropdown-section">Account</div>
            <button className="sa-dropdown-item" style={{ color: "#2563eb" }} onClick={() => openEditModal(activeHospital)} onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <Settings size={14} />Edit Details
            </button>
            <button className="sa-dropdown-item" style={{ color: activeHospital.isVerified ? "#b45309" : "#16a34a" }} onClick={() => handleToggleStatus(activeHospital)} disabled={actionLoading === activeHospital.id} onMouseEnter={e => e.currentTarget.style.background = activeHospital.isVerified ? "#fffbeb" : "#f0fdf4"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <Power size={14} />{activeHospital.isVerified ? "Disable Hospital" : "Enable Hospital"}
            </button>
            <button className="sa-dropdown-item" style={{ color: "#dc2626" }} onClick={() => { setDeleteConfirm(activeHospital); setActionMenu(null); }} onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <Trash2 size={14} />Delete Hospital
            </button>
          </div>
        </>
      )}

      {/* ─── Demo Request Detail Modal ─── */}
      {viewDemo && (
        <div className="sa-modal-backdrop" onClick={() => setViewDemo(null)}>
          <div className="sa-modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="sa-modal-icon" style={{ background: "#f5f3ff" }}><Inbox size={20} color="#7c3aed" /></div>
                <div>
                  <div className="sa-modal-title">{viewDemo.hospitalName}</div>
                  <div className="sa-modal-sub">Demo request from {viewDemo.adminName}</div>
                </div>
              </div>
              <button className="sa-modal-close" onClick={() => setViewDemo(null)}><X size={16} color="#64748b" /></button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-info-block">
                <div className="sa-info-row"><span className="sa-info-key">Contact Name</span><span className="sa-info-val">{viewDemo.adminName}</span></div>
                <div className="sa-info-row"><span className="sa-info-key">Email</span><span className="sa-info-val">{viewDemo.email}</span></div>
                <div className="sa-info-row"><span className="sa-info-key">Phone</span><span className="sa-info-val">{viewDemo.mobile}</span></div>
                {viewDemo.city && <div className="sa-info-row"><span className="sa-info-key">City</span><span className="sa-info-val">{viewDemo.city}</span></div>}
                <div className="sa-info-row"><span className="sa-info-key">Preferred Date</span><span className="sa-info-val">{formatDemoDate(viewDemo.preferredDate)}</span></div>
                <div className="sa-info-row"><span className="sa-info-key">Preferred Time</span><span className="sa-info-val">{formatDemoTime(viewDemo.preferredTime) || "—"}</span></div>
                <div className="sa-info-row"><span className="sa-info-key">Submitted</span><span className="sa-info-val">{formatDemoDate(viewDemo.createdAt)}</span></div>
                <div className="sa-info-row"><span className="sa-info-key">Status</span><span className="sa-info-val">{viewDemo.status.charAt(0) + viewDemo.status.slice(1).toLowerCase()}</span></div>
              </div>
              {viewDemo.message && (
                <div className="sa-field">
                  <label className="sa-label">Message</label>
                  <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}>{viewDemo.message}</div>
                </div>
              )}
            </div>
            <div className="sa-modal-footer">
              <a className="sa-btn sa-btn-md sa-btn-ghost" style={{ flex: 1 }} href={`mailto:${viewDemo.email}`}><Mail size={15} /> Email</a>
              <a className="sa-btn sa-btn-md sa-btn-primary" style={{ flex: 1 }} href={`tel:${viewDemo.mobile}`}><Phone size={15} /> Call</a>
            </div>
          </div>
        </div>
      )}

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
