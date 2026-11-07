import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Mail, Lock, User, Eye, EyeOff, 
  AlertCircle, CheckCircle2, ArrowRight 
} from 'lucide-react';
import illustration from '../assets/illustration.jpg';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

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
    if (signupError) setSignupError('');
  };

  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName) {
      tempErrors.fullName = 'Full name is required';
    }

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

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSignupError('');

    try {
      await signup(formData.fullName, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setSignupError(err.message || 'Server error during account registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4EF] flex flex-col lg:flex-row font-sans text-[#182333]">
      
      {/* LEFT COLUMN: Deep Navy Branding & Security Graphic */}
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

        {/* Center content */}
        <div className="my-auto py-8 space-y-6 max-w-lg">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Join FraudShield
            </h1>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Get access to advanced fraud detection and transaction intelligence.
            </p>
          </div>

          <div className="border border-[#1E293B] bg-[#162238] p-3 rounded-2xl shadow-xl overflow-hidden max-w-md">
            <img 
              src={illustration} 
              alt="FraudShield Network Security" 
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#64748B]">
          &copy; {new Date().getFullYear()} FraudShield AI &bull; Intelligent Financial Fraud Detection
        </div>

      </div>

      {/* RIGHT COLUMN: Clean Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-14 bg-[#F5F4EF]">
        
        <div className="w-full max-w-md fintech-card p-8 lg:p-10 space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-[#101B2D]">
              Create Account
            </h2>
            <p className="text-sm text-[#64748B]">
              Enter your details to register as a fraud analyst
            </p>
          </div>

          {signupError && (
            <div className="p-3.5 bg-[#FDF2F2] border border-[#F8D0D0] text-[#E05252] rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{signupError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-semibold text-[#182333]">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`fintech-input ${errors.fullName ? 'border-[#E05252]' : ''}`}
              />
              {errors.fullName && (
                <p className="text-[#E05252] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[#182333]">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`fintech-input ${errors.email ? 'border-[#E05252]' : ''}`}
              />
              {errors.email && (
                <p className="text-[#E05252] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#182333]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#182333]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`fintech-input pr-10 ${errors.confirmPassword ? 'border-[#E05252]' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#182333] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#E05252] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00A878] hover:bg-[#009268] text-white font-semibold rounded-lg text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-3"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#64748B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00A878] font-semibold hover:underline">
              Sign In
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;
