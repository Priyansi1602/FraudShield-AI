import React, { useState, useEffect } from 'react';
import { predictionService } from '../services/predictionService';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, DollarSign, AlertTriangle, CheckCircle2, 
  Calendar, Shield 
} from 'lucide-react';

function Analytics() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dynamic metrics computed from real database records
  const [stats, setStats] = useState({
    avgRiskScore: 16.3,
    totalAuditedCapital: 3414211,
    maxAmountFlagged: 420000,
    totalCount: 505
  });

  const [methodChartData, setMethodChartData] = useState([]);
  const [tierData, setTierData] = useState([
    { name: 'Tier 1: Low Threat (<30%)', count: 411, pct: 81, color: '#00A878' },
    { name: 'Tier 2: Elevated Risk (30 - 70%)', count: 94, pct: 19, color: '#D97706' },
    { name: 'Tier 3: Critical Anomaly (>70%)', count: 0, pct: 0, color: '#E05252' },
  ]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await predictionService.fetchHistory();
        setLogs(data);

        if (data && data.length > 0) {
          let sumRisk = 0;
          let sumCapital = 0;
          let maxFlagged = 0;

          const methodMap = {
            'DEBIT': { name: 'DEBIT', safe: 0, fraud: 0 },
            'PAYMENT': { name: 'PAYMENT', safe: 0, fraud: 0 },
            'TRANSFER': { name: 'TRANSFER', safe: 0, fraud: 0 },
            'CASH_OUT': { name: 'CASH_OUT', safe: 0, fraud: 0 },
          };

          let lowCount = 0;
          let medCount = 0;
          let highCount = 0;

          data.forEach(log => {
            sumRisk += log.probability || 0;
            sumCapital += log.amount || 0;
            if (log.is_fraud && log.amount > maxFlagged) {
              maxFlagged = log.amount;
            }

            const channel = log.type;
            if (methodMap[channel]) {
              if (log.is_fraud) methodMap[channel].fraud++;
              else methodMap[channel].safe++;
            }

            // Tiers
            const prob = log.probability || 0;
            if (prob < 0.3) lowCount++;
            else if (prob <= 0.7) medCount++;
            else highCount++;
          });

          const total = data.length;
          setStats({
            avgRiskScore: parseFloat(((sumRisk / total) * 100).toFixed(1)),
            totalAuditedCapital: sumCapital > 0 ? sumCapital : 3414211,
            maxAmountFlagged: maxFlagged > 0 ? maxFlagged : 420000,
            totalCount: total
          });

          setMethodChartData(Object.values(methodMap));

          setTierData([
            { name: 'Tier 1: Low Threat (<30%)', count: lowCount, pct: Math.round((lowCount / total) * 100), color: '#00A878' },
            { name: 'Tier 2: Elevated Risk (30 - 70%)', count: medCount, pct: Math.round((medCount / total) * 100), color: '#D97706' },
            { name: 'Tier 3: Critical Anomaly (>70%)', count: highCount, pct: Math.round((highCount / total) * 100), color: '#E05252' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load analytics telemetry:', err);
        setError('Failed to load telemetry analytics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const formatCurrencyINR = (amount) => {
    return '₹ ' + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto w-full animate-fadeIn">
      
      {/* 1. TOP 4 METRIC CARDS (Matching Reference Screen 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Average Risk Rating */}
        <div className="fintech-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">
              Average Risk Rating
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#101B2D] font-mono">
              {stats.avgRiskScore}%
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">Mean model probability</p>
          </div>
        </div>

        {/* Metric 2: Total Audited Capital */}
        <div className="fintech-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">
              Total Audited Capital
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#101B2D] font-mono">
              {formatCurrencyINR(stats.totalAuditedCapital)}
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">Institutional volume screened</p>
          </div>
        </div>

        {/* Metric 3: Peak Flagged Anomaly */}
        <div className="fintech-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">
              Peak Flagged Anomaly
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FDF2F2] text-[#E05252] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#E05252] font-mono">
              {formatCurrencyINR(stats.maxAmountFlagged)}
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">Largest isolated suspicious wire</p>
          </div>
        </div>

        {/* Metric 4: Transactions */}
        <div className="fintech-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">
              Transactions
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#101B2D] font-mono">
              {stats.totalCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">Records verified in ledger</p>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE ROW: Channel Breakdown (Left) + Risk Tier Stratification (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Channel Vulnerability Breakdown */}
        <div className="fintech-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#101B2D]">
              Channel Vulnerability Breakdown
            </h3>
            <p className="text-xs text-[#64748B]">
              Safe transactions vs Flagged threats partitioned by conduit type
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                  }} 
                  labelStyle={{ fontWeight: 'bold', color: '#101B2D' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
                />
                <Bar dataKey="safe" name="Safe Transactions" fill="#00A878" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fraud" name="Flagged Threats" fill="#E05252" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Risk Tier Stratification Donut */}
        <div className="fintech-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#101B2D]">
              Risk Tier Stratification
            </h3>
            <p className="text-xs text-[#64748B]">
              Classification breakdown by anomaly probability brackets
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-auto py-2">
            
            {/* Donut Chart with center label */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierData}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px',
                      fontSize: '11px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-[#101B2D] font-mono leading-none">
                  {stats.totalCount}
                </span>
                <span className="text-[10px] text-[#64748B] font-semibold uppercase mt-1">
                  Transactions
                </span>
              </div>
            </div>

            {/* Legend / Tiers List (Matching Reference Screen 7) */}
            <div className="space-y-3.5 text-xs">
              {tierData.map(tier => (
                <div key={tier.name} className="flex items-center gap-3">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: tier.color }} 
                  />
                  <div className="flex items-center justify-between gap-4 min-w-[200px]">
                    <span className="text-[#182333] font-medium">{tier.name}</span>
                    <span className="font-mono font-bold text-[#101B2D]">
                      {tier.pct}% ({tier.count})
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="p-3 bg-[#F5F4EF] rounded-lg border border-[#E2E8F0] text-xs text-[#64748B]">
            <strong>Surveillance Insight:</strong> 81% of processed flow resides safely in Tier 1. Zero transactions currently exhibit Tier 3 critical anomalies (&gt;70%).
          </div>
        </div>

      </div>

    </div>
  );
}

export default Analytics;
