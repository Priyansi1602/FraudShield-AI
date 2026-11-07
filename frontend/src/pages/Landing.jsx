import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, ArrowRight, CheckCircle2, TrendingUp, Search, 
  Lock, Cpu, FileCheck, Layers, BarChart3, Database, ChevronRight 
} from 'lucide-react';
import heroIllustration from '../assets/hero_fintech.png';
import heroImg from '../assets/hero.png';

function Landing() {
  const { isAuthenticated } = useAuth();

  const valueProps = [
    {
      title: 'Real-time Detection',
      desc: 'Identify fraud instantly',
      icon: Search,
    },
    {
      title: 'AI Risk Analysis',
      desc: 'ML-powered scoring',
      icon: Cpu,
    },
    {
      title: 'Transaction Monitoring',
      desc: 'Track & analyze activity',
      icon: TrendingUp,
    },
    {
      title: 'Audit & Compliance',
      desc: 'Tamper-proof records',
      icon: FileCheck,
    },
  ];

  const features = [
    {
      title: 'Random Forest Heuristics',
      desc: '100 decision trees evaluate multi-channel transactions with sub-10ms inference velocity, classifying complex balance depletion anomalies.',
      icon: Cpu,
    },
    {
      title: 'Automated CSV Batch Ingestion',
      desc: 'Upload multi-thousand row institutional transaction files with real-time schema validation and instant risk categorization.',
      icon: Layers,
    },
    {
      title: 'Cryptographic Audit Trail',
      desc: 'Every analyzed financial transfer is permanently committed with immutable probability indexes for regulatory compliance.',
      icon: Database,
    },
    {
      title: 'Forensic Case Investigation',
      desc: 'Deep inspection tools comparing origin and destination balance deltas against historical baseline activity.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4EF] text-[#182333] font-sans flex flex-col justify-between selection:bg-[#00A878]/20">
      
      {/* 1. TOP NAVBAR HEADER */}
      <header className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-[#E2E8F0] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E6F7F2] border border-[#B3E8D8] flex items-center justify-center text-[#00A878]">
            <Shield className="w-5 h-5 fill-[#00A878]/20" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#101B2D]">
            FraudShield AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
          <a href="#overview" className="hover:text-[#101B2D] transition-colors">Home</a>
          <a href="#product" className="hover:text-[#101B2D] transition-colors">Product</a>
          <a href="#solutions" className="hover:text-[#101B2D] transition-colors">Solutions</a>
          <a href="#how-it-works" className="hover:text-[#101B2D] transition-colors">How It Works</a>
          <a href="#security" className="hover:text-[#101B2D] transition-colors">Security</a>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A878] hover:bg-[#009268] text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <span>Console Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-semibold text-[#101B2D] hover:text-[#00A878] transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00A878] hover:bg-[#009268] text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="overview" className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-14 pb-12 flex-grow">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Hero Copy */}
          <div className="flex-1 space-y-6 text-left max-w-xl">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F7F2] border border-[#B3E8D8] text-xs font-semibold text-[#00A878]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A878]" />
              <span>AI-Powered Financial Security</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101B2D] tracking-tight leading-[1.08]">
              Detect. Analyze. <br />
              <span className="text-[#00A878]">Prevent Fraud.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base text-[#64748B] leading-relaxed max-w-lg">
              An intelligent financial fraud detection platform that analyzes transactions, identifies suspicious activity, and helps institutions stop financial loss in real time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00A878] hover:bg-[#009268] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#101B2D] font-semibold text-sm rounded-lg border border-[#E2E8F0] shadow-sm transition-all"
              >
                <span>View Demo</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Visual */}
          <div className="flex-1 w-full max-w-lg lg:max-w-xl flex justify-center items-center">
            <div className="relative w-full flex items-center justify-center">
              <img 
                src={heroIllustration} 
                alt="FraudShield AI Intelligent Financial Fraud Detection" 
                className="w-full h-auto object-contain select-none transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          </div>

        </div>

        {/* Value Proposition Cards Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-[#E2E8F0]">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="fintech-card p-4 flex items-center gap-3.5 hover:border-[#00A878]/30"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#101B2D]">{item.title}</h4>
                  <p className="text-xs text-[#64748B]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCT HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-[#FFFFFF] border-y border-[#E2E8F0] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#00A878] uppercase tracking-wider">
              Autonomous Surveillance
            </span>
            <h2 className="text-3xl font-extrabold text-[#101B2D]">
              How FraudShield AI Works
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              From real-time transaction ingestion to cryptographic audit trails, our pipeline ensures comprehensive anomaly detection in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F5F4EF]/50 space-y-3">
              <span className="text-xs font-mono font-bold text-[#00A878] bg-[#E6F7F2] px-2 py-0.5 rounded">01 INGEST</span>
              <h3 className="text-base font-bold text-[#101B2D]">Conduit Stream</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Seamlessly import transactions via REST API endpoints or upload batch institutional CSV records.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F5F4EF]/50 space-y-3">
              <span className="text-xs font-mono font-bold text-[#00A878] bg-[#E6F7F2] px-2 py-0.5 rounded">02 EXTRACT</span>
              <h3 className="text-base font-bold text-[#101B2D]">Feature Analysis</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Derives mathematical balance deltas, velocity changes, and origin-to-destination capital flows.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F5F4EF]/50 space-y-3">
              <span className="text-xs font-mono font-bold text-[#00A878] bg-[#E6F7F2] px-2 py-0.5 rounded">03 INFER</span>
              <h3 className="text-base font-bold text-[#101B2D]">Random Forest Scoring</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Trained ensemble evaluates risk probability against a 50% threshold to classify transactions.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F5F4EF]/50 space-y-3">
              <span className="text-xs font-mono font-bold text-[#00A878] bg-[#E6F7F2] px-2 py-0.5 rounded">04 AUDIT</span>
              <h3 className="text-base font-bold text-[#101B2D]">Cryptographic Log</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Immutable record logged to the database for forensic case inspection and AML compliance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ENTERPRISE FEATURES SECTION */}
      <section id="product" className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#00A878] uppercase tracking-wider">
            Institutional Standards
          </span>
          <h2 className="text-3xl font-extrabold text-[#101B2D]">
            Built for Modern Financial Intelligence
          </h2>
          <p className="text-sm text-[#64748B]">
            Engineered to provide enterprise analysts with full forensic oversight of financial networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="fintech-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center shrink-0 mt-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#101B2D]">{f.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PROFESSIONAL FOOTER */}
      <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
              <Shield className="w-4 h-4 fill-[#00A878]/20" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#101B2D] block">FraudShield AI</span>
              <span className="text-xs text-[#64748B]">Intelligent Financial Fraud Detection & Prevention</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#64748B]">
            <a href="#overview" className="hover:text-[#101B2D]">Overview</a>
            <a href="#how-it-works" className="hover:text-[#101B2D]">Pipeline</a>
            <a href="#product" className="hover:text-[#101B2D]">Features</a>
            <Link to="/login" className="hover:text-[#101B2D]">Analyst Login</Link>
          </div>

          <div className="text-xs text-[#94A3B8]">
            &copy; {new Date().getFullYear()} FraudShield AI. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Landing;
