import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Mail, Lock, Eye, EyeOff, AlertCircle, 
  CheckCircle2, ArrowRight 
} from 'lucide-react';
import illustration from '../assets/illustration.jpg';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: 'admin@fraudshield.ai',
    password: 'admin123',
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToast({
        message: location.state.toastMessage,
        type: 'success'
      });
      window.history.replaceState({}, document.title);
    } else if (new URLSearchParams(location.search).get('expired') === 'true') {
      setToast({
        message: 'Session expired. Please log in again.',
        type: 'warning'
      });
      window.history.replaceState({}, document.title, '/login');
    }
  }, [location]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@fraudshield.ai',
      password: 'admin123'
    });
    setErrors({});
    setLoginError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (loginError) setLoginError('');
  };

  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      tempErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    try {
      await login(formData.email, formData.password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4EF] flex flex-col lg:flex-row font-sans text-[#182333]">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-[#E2E8F0] text-[#182333] rounded-xl shadow-lg animate-fadeIn">
          <div className={`p-1 rounded-lg ${toast.type === 'success' ? 'bg-[#E6F7F2] text-[#00A878]' : 'bg-[#FFFBEB] text-[#D97706]'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">System Alert</span>
            <p className="text-xs font-semibold text-[#182333]">{toast.message}</p>
          </div>
        </div>
      )}

      {/* LEFT COLUMN: Deep Navy Branding & Security Illustration */}
      <div className="lg:w-[50%] bg-[#101B2D] flex flex-col justify-between p-8 lg:p-14 text-white relative">
        
        {/* Brand header */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00A878]/20 border border-[#00A878]/40 flex items-center justify-center text-[#00A878]">
            <Shield className="w-5 h-5 fill-[#00A878]/30" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">
            FraudShield AI
          </span>
        </Link>

        {/* Center illustration & statement */}
        <div className="my-auto py-8 space-y-6 max-w-lg">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Secure Access to <br />FraudShield
            </h1>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Monitor transactions, detect fraud, and manage alerts in real time.
            </p>
          </div>

          <div className="border border-[#1E293B] bg-[#162238] p-3 rounded-2xl shadow-xl overflow-hidden max-w-md">
            <img 
              src={illustration} 
              alt="FraudShield Security Credentials" 
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#64748B]">
          &copy; {new Date().getFullYear()} FraudShield AI &bull; Intelligent Financial Fraud Detection
        </div>

      </div>

      {/* RIGHT COLUMN: Clean Authentication Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-14 bg-[#F5F4EF]">
        
        <div className="w-full max-w-md fintech-card p-8 lg:p-10 space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-[#101B2D]">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-[#64748B]">
              Sign in to your analyst account
            </p>
          </div>

          {/* Demo account auto-fill banner */}
          <div className="p-3 bg-[#E6F7F2] border border-[#B3E8D8] rounded-lg flex items-center justify-between">
            <div className="text-xs text-[#101B2D]">
              <span className="font-bold text-[#00A878] block">Demo Analyst Account:</span>
              <span className="font-mono text-[#64748B]">admin@fraudshield.ai / admin123</span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2.5 py-1 bg-white hover:bg-[#F8FAFC] border border-[#B3E8D8] text-[#00A878] rounded text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Fill Demo
            </button>
          </div>

          {loginError && (
            <div className="p-3.5 bg-[#FDF2F2] border border-[#F8D0D0] text-[#E05252] rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[#182333]">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@fraudshield.ai"
                  className={`fintech-input ${errors.email ? 'border-[#E05252]' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-[#E05252] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-semibold text-[#182333]">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-semibold text-[#5278B8] hover:underline">
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`fintech-input pr-10 ${errors.password ? 'border-[#E05252]' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#182333] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#E05252] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#CBD5E1] text-[#00A878] focus:ring-[#00A878] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-xs text-[#64748B] select-none cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00A878] hover:bg-[#009268] text-white font-semibold rounded-lg text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#64748B]">
            New to FraudShield?{' '}
            <Link to="/signup" className="text-[#00A878] font-semibold hover:underline">
              Create an account
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
