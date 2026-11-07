import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, LayoutDashboard, UploadCloud, Clock, BarChart2, 
  Bell, User, Sliders, LogOut, Menu, X, Cpu, Calendar 
} from 'lucide-react';

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { state: { toastMessage: 'Logged out successfully.' } });
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scan Transactions', path: '/scan', icon: UploadCloud },
    { name: 'Audit Ledger', path: '/history', icon: Clock },
    { name: 'Analytics & Risk', path: '/analytics', icon: BarChart2 },
    { name: 'Threat Alerts', path: '/alerts', icon: Bell, badgeCount: 2 },
    { name: 'Analyst Profile', path: '/profile', icon: User },
    { name: 'Model & Config', path: '/settings', icon: Sliders },
  ];

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/prediction/')) {
      return { 
        title: 'Forensic Investigation Trace', 
        subtitle: 'In-depth transaction anomaly analysis and audit evidence ledger' 
      };
    }
    switch (path) {
      case '/dashboard':
        return { 
          title: 'Threat Overview', 
          subtitle: 'Real-time transaction monitoring and fraud risk insights' 
        };
      case '/scan':
        return { 
          title: 'Scan Transactions', 
          subtitle: 'Upload a transaction file (CSV) for fraud analysis' 
        };
      case '/history':
        return { 
          title: 'Cryptographic Audit Ledger', 
          subtitle: 'Immutable logs of evaluated financial transactions' 
        };
      case '/analytics':
        return { 
          title: 'Threat & Behavioral Analytics', 
          subtitle: 'Aggregated heuristics, channel risk distributions, and anomaly patterns' 
        };
      case '/alerts':
        return { 
          title: 'Priority Threat Alert Feed', 
          subtitle: 'Chronological anomalies categorized by severity level' 
        };
      case '/profile':
        return { 
          title: 'Analyst Security Clearance Profile', 
          subtitle: 'Identity, access level, and investigation productivity' 
        };
      case '/settings':
        return { 
          title: 'System & Model Parameters', 
          subtitle: 'Configure classification boundaries and ML runtime settings' 
        };
      default:
        return { 
          title: 'FraudShield Console', 
          subtitle: 'Financial Threat Intelligence Platform' 
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-[#F5F4EF] text-[#182333] font-sans flex overflow-hidden">
      
      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* LEFT SIDEBAR: Clean White #FFFFFF */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-60 bg-[#FFFFFF] border-r border-[#E2E8F0]
        flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col">
          
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-[#E2E8F0]">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#00A878] flex items-center justify-center text-white shadow-xs">
                <Shield className="w-4 h-4 fill-white/20" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-[#101B2D]">
                FraudShield AI
              </span>
            </Link>

            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-[#64748B] hover:text-[#101B2D] rounded-lg md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                               (item.path === '/dashboard' && location.pathname.startsWith('/prediction/'));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-normal transition-all ${
                    isActive 
                      ? 'bg-[#00A878] text-white shadow-xs font-bold' 
                      : 'text-[#64748B] hover:text-[#101B2D] hover:bg-[#F5F4EF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badgeCount && (
                    <span className="w-4 h-4 rounded-full bg-[#E05252] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Analyst Card & Logout */}
        <div className="p-3 border-t border-[#E2E8F0] space-y-2">
          <Link 
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F4EF] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#00A878] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs font-bold text-[#101B2D] truncate">{user?.fullName || 'Prinsi prajapati'}</p>
              <p className="text-[10px] text-[#64748B] truncate">{user?.role || 'Fraud Analyst'}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#E05252] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR HEADER */}
        <header className="h-16 bg-[#FFFFFF] border-b border-[#E2E8F0] px-6 md:px-8 flex items-center justify-between shrink-0 z-30">
          
          {/* Left Title / Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#64748B] hover:text-[#101B2D] rounded-lg md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base font-extrabold text-[#101B2D] tracking-tight">
                {pageInfo.title}
              </h1>
              <p className="text-xs text-[#64748B] hidden sm:block">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Model telemetry pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F4EF] border border-[#E2E8F0] text-xs">
              <Cpu className="w-3.5 h-3.5 text-[#00A878]" />
              <span className="text-[#64748B]">ML Engine:</span>
              <span className="font-semibold text-[#101B2D]">Random Forest v1</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] ml-0.5" />
            </div>

            {/* Notifications panel */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#64748B] hover:text-[#101B2D] hover:bg-[#F5F4EF] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E05252] rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <span className="text-xs font-bold text-[#101B2D] uppercase tracking-wider">Recent Alerts</span>
                    <span className="text-[10px] font-semibold text-[#00A878] bg-[#E6F7F2] px-2 py-0.5 rounded">2 New</span>
                  </div>
                  <div className="space-y-2.5 mt-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#FDF2F2] border border-[#F8D0D0]">
                      <span className="font-bold text-[#E05252] block mb-0.5">High Anomaly Flagged</span>
                      <p className="text-[11px] text-[#64748B]">
                        Transfer of ₹ 4,20,000 flagged with 84% anomaly score.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#E6F7F2] border border-[#B3E8D8]">
                      <span className="font-bold text-[#00A878] block mb-0.5">Pipeline Verified</span>
                      <p className="text-[11px] text-[#64748B]">
                        Random Forest classifier loaded and running.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E2E8F0] text-center">
                    <Link 
                      to="/alerts"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-[#00A878] hover:underline"
                    >
                      View All Threat Alerts &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Date Range Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F4EF] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#64748B]">
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Aug 1, 2026 – Aug 13, 2026</span>
            </div>

          </div>
        </header>

        {/* PAGE WORKSPACE VIEWPORT: Warm Ivory #F5F4EF */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#F5F4EF]">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default AppLayout;
