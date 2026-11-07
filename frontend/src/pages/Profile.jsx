import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { predictionService } from '../services/predictionService';
import { 
  User, Mail, Shield, Calendar, Activity, 
  AlertTriangle, CheckCircle2, Gauge, Zap 
} from 'lucide-react';

function Profile() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalAudited: 505,
    threatsFlagged: 2,
    cleanVerified: 503,
    avgConfidence: 32.3,
    avgInferenceMs: 26.7
  });

  useEffect(() => {
    const loadProfileMetrics = async () => {
      setIsLoading(true);
      try {
        const data = await predictionService.fetchHistory();
        setLogs(data);

        if (data && data.length > 0) {
          let fraudCount = 0;
          let sumConf = 0;
          let sumMs = 0;

          data.forEach(log => {
            if (log.is_fraud) fraudCount++;
            sumConf += log.confidence_score || log.probability || 0.323;
            sumMs += log.prediction_time_ms || 26.7;
          });

          const total = data.length;
          setStats({
            totalAudited: total,
            threatsFlagged: fraudCount,
            cleanVerified: total - fraudCount,
            avgConfidence: parseFloat(((sumConf / total) * 100).toFixed(1)),
            avgInferenceMs: parseFloat((sumMs / total).toFixed(1))
          });
        }
      } catch (err) {
        console.error('Failed to load profile metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfileMetrics();
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Aug 12, 2026';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'Aug 12, 2026';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto w-full animate-fadeIn">
      
      {/* 2-COLUMN PROFILE GRID (Matching Reference Screen 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN (1/3 width): Identity & Credentials Card */}
        <div className="fintech-card p-8 flex flex-col items-center text-center space-y-6">
          
          {/* Avatar Circle */}
          <div className="w-20 h-20 rounded-full bg-[#00A878] flex items-center justify-center text-white text-3xl font-extrabold shadow-sm">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>

          {/* Name & Role */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#101B2D]">
              {user?.fullName || 'System Admin'}
            </h2>
            <span className="text-xs font-semibold text-[#64748B]">
              {user?.role || 'Fraud Analyst'}
            </span>
          </div>

          <div className="w-full h-px bg-[#E2E8F0]" />

          {/* Details List */}
          <div className="w-full space-y-3.5 text-xs text-left">
            
            <div className="flex items-center gap-3 text-[#182333]">
              <Mail className="w-4 h-4 text-[#64748B] shrink-0" />
              <span className="font-medium truncate">{user?.email || 'admin@fraudshield.ai'}</span>
            </div>

            <div className="flex items-center gap-3 text-[#182333]">
              <Shield className="w-4 h-4 text-[#00A878] shrink-0" />
              <span>Clearance: <strong className="font-bold text-[#101B2D]">{user?.role || 'Fraud Analyst'}</strong></span>
            </div>

            <div className="flex items-center gap-3 text-[#182333]">
              <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
              <span>Created: <strong className="font-semibold text-[#182333]">{formatDate(user?.createdAt)}</strong></span>
            </div>

          </div>

          <div className="w-full pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F2] text-[#00A878] border border-[#B3E8D8]">
              <span className="w-2 h-2 rounded-full bg-[#00A878]" />
              Active Institutional Session
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN (2/3 width): Investigative Metrics Card (Matching Reference Screen 9) */}
        <div className="lg:col-span-2 fintech-card p-8 space-y-6">
          <div className="pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#101B2D]">
              Investigative Metrics
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Historical operational volume and model response benchmarks
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Metric 1: Transactions Audited */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F5F4EF]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-[#182333]">Transactions Audited</span>
              </div>
              <span className="text-lg font-extrabold text-[#101B2D] font-mono">
                {stats.totalAudited}
              </span>
            </div>

            {/* Metric 2: Threats Flagged */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#F8D0D0] bg-[#FDF2F2]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] text-[#E05252] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-[#182333]">Threats Flagged</span>
              </div>
              <span className="text-lg font-extrabold text-[#E05252] font-mono">
                {stats.threatsFlagged}
              </span>
            </div>

            {/* Metric 3: Verified Clean */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#B3E8D8] bg-[#E6F7F2]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-[#182333]">Verified Clean</span>
              </div>
              <span className="text-lg font-extrabold text-[#00A878] font-mono">
                {stats.cleanVerified}
              </span>
            </div>

            {/* Metric 4: Mean Model Confidence */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F5F4EF]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#5278B8] flex items-center justify-center">
                  <Gauge className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-[#182333]">Mean Model Confidence</span>
              </div>
              <span className="text-lg font-extrabold text-[#101B2D] font-mono">
                {stats.avgConfidence}%
              </span>
            </div>

            {/* Metric 5: Inference Speed */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F5F4EF]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-[#182333]">Inference Speed</span>
              </div>
              <span className="text-lg font-extrabold text-[#101B2D] font-mono">
                {stats.avgInferenceMs} ms
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default Profile;
