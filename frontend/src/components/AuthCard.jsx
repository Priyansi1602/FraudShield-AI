import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, 
  CheckCircle2, ArrowRight, UserPlus, Zap, BarChart3, 
  Database, ShieldCheck, FileCheck 
} from 'lucide-react';
import authVisual from '../assets/auth_visual.png';

export default function AuthCard({ initialTab = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with props / URL changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: 'admin@fraudshield.ai',
    password: 'admin123',
  });
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  // Toast from route state or expired param
  useEffect(() => {
    if (location.state?.toastMessage) {
      setToast({
        message: location.state.toastMessage,
        type: 'success',
      });
      window.history.replaceState({}, document.title);
    } else if (new URLSearchParams(location.search).get('expired') === 'true') {
      setToast({
        message: 'Session expired. Please sign in again.',
        type: 'warning',
      });
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Tab switcher
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setFormError('');
    if (tab === 'login' && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    } else if (tab === 'register' && location.pathname !== '/signup') {
      navigate('/signup', { replace: true });
    }
  };

  // Quick Demo fill
  const fillDemoCredentials = () => {
    setLoginForm({
      email: 'admin@fraudshield.ai',
      password: 'admin123',
    });
    setErrors({});
    setFormError('');
  };

  // Form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
  };

  // Validation
  const validateLoginForm = () => {
    const temp = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginForm.email) {
      temp.email = 'Email address is required';
    } else if (!emailRegex.test(loginForm.email)) {
      temp.email = 'Please enter a valid institutional email';
    }
    if (!loginForm.password) {
      temp.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      temp.password = 'Password must be at least 6 characters';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validateRegisterForm = () => {
    const temp = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerForm.fullName.trim()) {
      temp.fullName = 'Full Name is required';
    }
    if (!registerForm.email) {
      temp.email = 'Email address is required';
    } else if (!emailRegex.test(registerForm.email)) {
      temp.email = 'Please enter a valid email address';
    }
    if (!registerForm.password) {
      temp.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      temp.password = 'Password must be at least 6 characters';
    }
    if (!registerForm.confirmPassword) {
      temp.confirmPassword = 'Confirm Password is required';
    } else if (registerForm.confirmPassword !== registerForm.password) {
      temp.confirmPassword = 'Passwords do not match';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Submission handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setFormError('');
    try {
      await login(loginForm.email, loginForm.password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setFormError('');
    try {
      await signup(registerForm.fullName, registerForm.email, registerForm.password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Server error during account registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F5] font-sans text-[#182333] relative overflow-hidden flex flex-col justify-between selection:bg-[#00A878]/20">
      
      {/* ABSTRACT CREAM, MINT AND EMERALD FULL-PAGE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Soft glowing radial ambient lights */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-[#00A878]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#34D399]/12 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-[#B3E8D8]/20 rounded-full blur-[140px]" />

        {/* Abstract Guilloche Waveforms & Vector Flow Lines */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-60" 
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Top Left Wave */}
          <path 
            d="M-100 180 C200 80, 400 320, 750 140 C1050 0, 1300 240, 1600 80" 
            stroke="#00A878" 
            strokeWidth="1.5" 
            strokeOpacity="0.18" 
            strokeDasharray="4 6" 
          />
          <path 
            d="M-80 220 C220 120, 420 360, 770 180 C1070 40, 1320 280, 1620 120" 
            stroke="#34D399" 
            strokeWidth="1.2" 
            strokeOpacity="0.22" 
          />

          {/* Bottom Left Flowing Emerald Mass */}
          <path 
            d="M-50 950 C120 780, 320 850, 480 720 C640 590, 520 460, 420 400 C300 320, 100 480, -80 540 Z" 
            fill="url(#emeraldFlow)" 
            opacity="0.85" 
          />

          {/* Bottom Right Guilloche Wave Lines */}
          <path 
            d="M950 920 C1100 780, 1260 840, 1500 710" 
            stroke="#00A878" 
            strokeWidth="1.5" 
            strokeOpacity="0.3" 
          />
          <path 
            d="M980 940 C1130 800, 1290 860, 1530 730" 
            stroke="#00A878" 
            strokeWidth="1.2" 
            strokeOpacity="0.25" 
          />
          <path 
            d="M1010 960 C1160 820, 1320 880, 1560 750" 
            stroke="#34D399" 
            strokeWidth="1.0" 
            strokeOpacity="0.2" 
          />
          <path 
            d="M1040 980 C1190 840, 1350 900, 1590 770" 
            stroke="#34D399" 
            strokeWidth="0.8" 
            strokeOpacity="0.15" 
          />

          <defs>
            <linearGradient id="emeraldFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A878" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#065F46" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#043E2F" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

      </div>

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-[#E2E8F0] text-[#182333] rounded-xl shadow-xl animate-fadeIn">
          <div className={`p-1 rounded-lg ${toast.type === 'success' ? 'bg-[#E6F7F2] text-[#00A878]' : 'bg-[#FFFBEB] text-[#D97706]'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">System Alert</span>
            <p className="text-xs font-semibold text-[#182333]">{toast.message}</p>
          </div>
        </div>
      )}

      {/* TOP BRAND HEADER */}
      <header className="pt-8 pb-4 px-6 flex flex-col items-center justify-center text-center z-10 relative">
        <Link to="/" className="inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="w-9 h-9 rounded-xl bg-[#00A878] flex items-center justify-center text-white shadow-md shadow-[#00A878]/25">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#101B2D]">
            FraudShield AI
          </span>
        </Link>
        <p className="text-xs font-semibold text-[#64748B] tracking-wide mt-1">
          Intelligent Financial Fraud Detection
        </p>
      </header>

      {/* MAIN CENTERED GLASSMORPHISM AUTHENTICATION CONTAINER */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-auto z-10 relative">
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,168,120,0.14),0_10px_30px_-10px_rgba(16,27,45,0.06)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 p-3 sm:p-4 gap-4 items-stretch">
            
            {/* LEFT INNER SECTION: Integrated Financial Intelligence Visualization */}
            <div className="lg:col-span-5 xl:col-span-6 bg-gradient-to-br from-[#064E3B] via-[#043E2F] to-[#02281E] rounded-2xl sm:rounded-[24px] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-inner min-h-[460px] lg:min-h-[560px]">
              
              {/* Internal ambient glowing circles */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#00A878]/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#34D399]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Title & Description */}
              <div className="relative z-10 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Secure Financial Transactions <br />
                  <span className="text-[#34D399]">with AI Intelligence</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#A7F3D0]/80 leading-relaxed max-w-sm">
                  Detect, analyze, and prevent fraudulent activities in real time with machine learning.
                </p>
              </div>

              {/* 3D Financial Security Artwork */}
              <div className="my-auto py-4 relative z-10 flex items-center justify-center">
                <img 
                  src={authVisual} 
                  alt="FraudShield Financial Intelligence Architecture" 
                  className="w-full max-w-[340px] sm:max-w-[370px] h-auto object-contain select-none drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>

              {/* Bottom 3 Telemetry Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#0A6952]/60 relative z-10">
                
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#065F46] text-[#34D399] flex items-center justify-center shrink-0 shadow-xs border border-[#0F766E]/50">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">1.4M+</p>
                    <p className="text-[10px] text-[#A7F3D0]/70 truncate">Txns Analyzed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#065F46] text-[#34D399] flex items-center justify-center shrink-0 shadow-xs border border-[#0F766E]/50">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">99.6%</p>
                    <p className="text-[10px] text-[#A7F3D0]/70 truncate">Accuracy</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#065F46] text-[#34D399] flex items-center justify-center shrink-0 shadow-xs border border-[#0F766E]/50">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">2,847</p>
                    <p className="text-[10px] text-[#A7F3D0]/70 truncate">Blocked</p>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT INNER SECTION: Authentication Form with Tabs */}
            <div className="lg:col-span-7 xl:col-span-6 p-4 sm:p-8 flex flex-col justify-between">
              
              <div>
                {/* TABS SWITCHER (Login / Register) */}
                <div className="flex justify-end mb-6">
                  <div className="inline-flex p-1 bg-[#F1F5F2] rounded-full border border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('login')}
                      className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'login'
                          ? 'bg-[#00A878] text-white shadow-sm'
                          : 'text-[#64748B] hover:text-[#101B2D]'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Login</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabSwitch('register')}
                      className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'register'
                          ? 'bg-[#00A878] text-white shadow-sm'
                          : 'text-[#64748B] hover:text-[#101B2D]'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </button>
                  </div>
                </div>

                {/* ERROR BANNER */}
                {formError && (
                  <div className="mb-5 p-3.5 bg-[#FDF2F2] border border-[#F8D0D0] text-[#E05252] rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* DYNAMIC FORM VIEWS */}
                {activeTab === 'login' ? (
                  /* ================= LOGIN FORM ================= */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1 mb-2">
                      <h3 className="text-2xl font-extrabold text-[#101B2D] tracking-tight">
                        Welcome Back 👋
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748B]">
                        Sign in to access your FraudShield AI dashboard
                      </p>
                    </div>

                    {/* Quick Demo Fill Banner */}
                    <div className="p-3 bg-[#E6F7F2]/80 border border-[#B3E8D8] rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#00A878] text-white flex items-center justify-center font-bold text-[10px]">
                          Demo
                        </div>
                        <div>
                          <span className="font-bold text-[#101B2D]">admin@fraudshield.ai</span>
                          <span className="text-[#64748B] ml-1.5 font-mono text-[11px]">/ admin123</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="px-2.5 py-1 bg-[#00A878] hover:bg-[#009268] text-white text-[11px] font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Fill Demo
                      </button>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-[#101B2D]">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          placeholder="analyst@institution.com"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.email 
                              ? 'border-[#E05252] bg-[#FDF2F2] text-[#E05252]' 
                              : 'border-[#E2E8F0] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15 bg-white text-[#101B2D]'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-[#E05252] flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#101B2D]">
                          Password
                        </label>
                        <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact system administrator (admin@fraudshield.ai) for credentials recovery.'); }} className="text-xs font-semibold text-[#00A878] hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.password 
                              ? 'border-[#E05252] bg-[#FDF2F2] text-[#E05252]' 
                              : 'border-[#E2E8F0] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15 bg-white text-[#101B2D]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#101B2D] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-[#E05252] flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>

                    {/* Remember me Checkbox */}
                    <div className="flex items-center pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#64748B] select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-[#CBD5E1] text-[#00A878] focus:ring-[#00A878] accent-[#00A878]"
                        />
                        <span>Remember session on this computer</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3 px-4 bg-[#00A878] hover:bg-[#009268] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* ================= REGISTER FORM ================= */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="space-y-1 mb-1">
                      <h3 className="text-2xl font-extrabold text-[#101B2D] tracking-tight">
                        Create Account 🚀
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748B]">
                        Enter your details to register as a fraud analyst
                      </p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1 text-left">
                      <label className="block text-xs font-bold text-[#101B2D]">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={registerForm.fullName}
                          onChange={handleRegisterChange}
                          placeholder="Sarah Jenkins"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.fullName 
                              ? 'border-[#E05252] bg-[#FDF2F2] text-[#E05252]' 
                              : 'border-[#E2E8F0] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15 bg-white text-[#101B2D]'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-[#E05252] flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1 text-left">
                      <label className="block text-xs font-bold text-[#101B2D]">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          placeholder="analyst@institution.com"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.email 
                              ? 'border-[#E05252] bg-[#FDF2F2] text-[#E05252]' 
                              : 'border-[#E2E8F0] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15 bg-white text-[#101B2D]'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-[#E05252] flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1 text-left">
                      <label className="block text-xs font-bold text-[#101B2D]">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          placeholder="At least 6 characters"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.password 
                              ? 'border-[#E05252] bg-[#FDF2F2] text-[#E05252]' 
                              : 'border-[#E2E8F0] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15 bg-white text-[#101B2D]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#101B2D] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-[#E05252] flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-1 text-left">
                      <label className="block text-xs font-bold text-[#101B2D]">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={registerForm.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="Re-enter password"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.confirmPassword 
                              ? 'border-[#E05252] bg-[#FDF2F2] text-[#E05252]' 
                              : 'border-[#E2E8F0] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15 bg-white text-[#101B2D]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#101B2D] cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-[#E05252] flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>

                    {/* Register Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3 px-4 bg-[#00A878] hover:bg-[#009268] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Analyst Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Bottom Switch Tab Prompt */}
              <div className="pt-6 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
                {activeTab === 'login' ? (
                  <p>
                    New to FraudShield?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('register')}
                      className="font-bold text-[#00A878] hover:underline cursor-pointer ml-1"
                    >
                      Create an account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('login')}
                      className="font-bold text-[#00A878] hover:underline cursor-pointer ml-1"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* THREE FEATURE HIGHLIGHTS BELOW THE AUTHENTICATION CONTAINER */}
      <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-8 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Feature 1 */}
          <div className="flex items-start gap-3 p-3.5 bg-white/75 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs hover:bg-white hover:shadow-sm transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#E6F7F2] text-[#00A878] flex items-center justify-center shrink-0 border border-[#B3E8D8]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#101B2D]">Real-time Detection</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                Identify suspicious activity instantly
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3 p-3.5 bg-white/75 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs hover:bg-white hover:shadow-sm transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#E6F7F2] text-[#00A878] flex items-center justify-center shrink-0 border border-[#B3E8D8]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#101B2D]">AI Risk Scoring</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                Predict and prevent financial fraud
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3 p-3.5 bg-white/75 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs hover:bg-white hover:shadow-sm transition-all">
            <div className="w-8 h-8 rounded-xl bg-[#E6F7F2] text-[#00A878] flex items-center justify-center shrink-0 border border-[#B3E8D8]">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#101B2D]">Audit & Compliance</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                Tamper-proof records & reports
              </p>
            </div>
          </div>

        </div>

        {/* Legal notice */}
        <p className="text-center text-[11px] text-[#94A3B8] mt-4">
          &copy; {new Date().getFullYear()} FraudShield AI &bull; Intelligent Financial Fraud Detection & Prevention.
        </p>
      </footer>

    </div>
  );
}
