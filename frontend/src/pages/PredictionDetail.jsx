import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, Shield, 
  FileCheck, Clock, ArrowRight, CornerDownRight 
} from 'lucide-react';

function PredictionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Analyst Action state
  const [reviewStatus, setReviewStatus] = useState('Awaiting Review');
  const [showStatusToast, setShowStatusToast] = useState(false);

  // Analyst checklist
  const [checklist, setChecklist] = useState({
    kycVerified: false,
    balanceIntegrity: false,
    velocityChecked: false
  });

  useEffect(() => {
    const fetchRecord = async () => {
      setIsLoading(true);
      setError('');
      try {
        const logs = await predictionService.fetchHistory();
        const found = logs.find(item => String(item.id) === String(id));
        if (found) {
          setRecord(found);
        } else {
          setError('The requested prediction log record could not be located in the database.');
        }
      } catch (err) {
        console.error('Error fetching record details:', err);
        setError('Failed to query prediction history ledger.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleChecklistChange = (key) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReviewAction = (status) => {
    setReviewStatus(status);
    setShowStatusToast(true);
    setTimeout(() => setShowStatusToast(false), 3500);
  };

  const formatCurrencyINR = (amount) => {
    return '₹ ' + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto w-full animate-fadeIn">
      
      {/* Toast Alert */}
      {showStatusToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-[#B3E8D8] text-[#182333] rounded-xl shadow-lg animate-fadeIn">
          <div className="p-1 rounded-lg bg-[#E6F7F2] text-[#00A878]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">Analyst Action</span>
            <p className="text-xs font-semibold text-[#182333]">Status updated: {reviewStatus}</p>
          </div>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link 
          to="/history" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#00A878] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Audit Ledger
        </Link>
      </div>

      {isLoading ? (
        <div className="fintech-card p-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#00A878] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#64748B] font-semibold">Loading forensic trace...</p>
        </div>
      ) : error || !record ? (
        <div className="fintech-card p-12 text-center space-y-3 max-w-md mx-auto">
          <AlertTriangle className="w-8 h-8 text-[#E05252] mx-auto" />
          <h3 className="text-sm font-bold text-[#101B2D]">Record Not Found</h3>
          <p className="text-xs text-[#64748B]">{error || 'Ledger entry does not exist.'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Case Header */}
          <div className="fintech-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider block">
                FORENSIC CASE INVESTIGATION
              </span>
              <h2 className="text-2xl font-extrabold text-[#101B2D] font-mono">
                #LOG-{record.id}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#182333] px-3 py-1 rounded-md bg-[#F5F4EF] border border-[#E2E8F0]">
                {record.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                record.is_fraud
                  ? 'bg-[#FDF2F2] border-[#F8D0D0] text-[#E05252]'
                  : 'bg-[#E6F7F2] border-[#B3E8D8] text-[#00A878]'
              }`}>
                {record.is_fraud ? 'FLAGGED ANOMALY' : 'SAFE VERIFIED'}
              </span>
            </div>
          </div>

          {/* Capital Flow Artifacts Row */}
          <div className="fintech-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#101B2D]">
              Capital Flow Movement
            </h3>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-6 rounded-xl border border-[#E2E8F0] bg-[#F5F4EF]/50">
              
              {/* Origin Account */}
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] flex-1 space-y-2">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block pb-1 border-b border-[#E2E8F0]">
                  Origin Account
                </span>
                <div className="space-y-1 text-xs font-mono">
                  <p className="flex justify-between text-[#64748B]">
                    <span>Balance Before:</span>
                    <strong className="text-[#101B2D]">{formatCurrencyINR(record.oldbalanceOrg)}</strong>
                  </p>
                  <p className="flex justify-between text-[#64748B]">
                    <span>Balance After:</span>
                    <strong className="text-[#101B2D]">{formatCurrencyINR(record.newbalanceOrig)}</strong>
                  </p>
                  <div className="h-px bg-[#E2E8F0] my-1" />
                  <p className="flex justify-between font-bold text-[#E05252]">
                    <span>Depletion Delta:</span>
                    <span>-{formatCurrencyINR(record.oldbalanceOrg - record.newbalanceOrig)}</span>
                  </p>
                </div>
              </div>

              {/* Middle Transfer Amount */}
              <div className="flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Transferred Amount
                </span>
                <div className="px-5 py-2.5 bg-[#E6F7F2] border border-[#B3E8D8] text-[#00A878] rounded-xl text-lg font-extrabold font-mono shadow-sm">
                  {formatCurrencyINR(record.amount)}
                </div>
                <div className="h-6 w-px bg-[#CBD5E1] my-2" />
                <span className="text-[10px] font-mono text-[#00A878] font-bold">100% ROUTED</span>
              </div>

              {/* Destination Account */}
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] flex-1 space-y-2">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block pb-1 border-b border-[#E2E8F0]">
                  Destination Account
                </span>
                <div className="space-y-1 text-xs font-mono">
                  <p className="flex justify-between text-[#64748B]">
                    <span>Balance Before:</span>
                    <strong className="text-[#101B2D]">{formatCurrencyINR(record.oldbalanceDest)}</strong>
                  </p>
                  <p className="flex justify-between text-[#64748B]">
                    <span>Balance After:</span>
                    <strong className="text-[#101B2D]">{formatCurrencyINR(record.newbalanceDest)}</strong>
                  </p>
                  <div className="h-px bg-[#E2E8F0] my-1" />
                  <p className="flex justify-between font-bold text-[#00A878]">
                    <span>Inward Delta:</span>
                    <span>+{formatCurrencyINR(record.newbalanceDest - record.oldbalanceDest)}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 2-Column: Risk Assessment & Actions (Left) + Model Evidence (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            <div className="lg:col-span-2 space-y-6">
              
              {/* Risk Calibration Meter */}
              <div className="fintech-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#101B2D]">
                    Risk Probability Calibration
                  </h3>
                  <span className="text-base font-extrabold text-[#E05252] font-mono">
                    {(record.probability * 100).toFixed(1)}% Score
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-3 bg-[#E2E8F0] rounded-full flex overflow-hidden">
                    <div className="h-full bg-[#00A878]" style={{ width: '50%' }} />
                    <div className="h-full bg-[#E05252]" style={{ width: '50%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-mono text-[#64748B]">
                    <span>0% Safe</span>
                    <span className="text-[#00A878] font-bold">50% Decision Boundary</span>
                    <span>100% Critical Threat</span>
                  </div>
                </div>
              </div>

              {/* Investigator Verification Protocol */}
              <div className="fintech-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#101B2D]">
                  Investigator Verification Protocol
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 text-xs text-[#182333] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.kycVerified}
                      onChange={() => handleChecklistChange('kycVerified')}
                      className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#00A878] focus:ring-[#00A878]"
                    />
                    <span>Verify associated customer identity credentials and originator KYC status</span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-[#182333] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.balanceIntegrity}
                      onChange={() => handleChecklistChange('balanceIntegrity')}
                      className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#00A878] focus:ring-[#00A878]"
                    />
                    <span>Audit balance deltas against raw account statement ledgers</span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-[#182333] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.velocityChecked}
                      onChange={() => handleChecklistChange('velocityChecked')}
                      className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#00A878] focus:ring-[#00A878]"
                    />
                    <span>Inspect transaction velocity and IP geo-correlation indicators</span>
                  </label>

                  <div className="pt-3 border-t border-[#E2E8F0] flex gap-3">
                    <button
                      onClick={() => handleReviewAction('CLEARED & ARCHIVED')}
                      className="px-4 py-2 bg-[#F5F4EF] hover:bg-[#EAE8E0] text-[#101B2D] rounded-lg text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
                    >
                      Clear & Archive
                    </button>
                    <button
                      onClick={() => handleReviewAction('ESCALATED TO AML')}
                      className="px-4 py-2 bg-[#E05252] hover:bg-[#C93B3B] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Escalate to AML Unit
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Model Evidence */}
            <div className="fintech-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#101B2D]">
                Model Evidence Ledger
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">MODEL</span>
                  <span className="font-bold text-[#101B2D]">Random Forest</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">DECISION THRESHOLD</span>
                  <span className="font-bold text-[#00A878]">50.0%</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B]">RISK PROBABILITY</span>
                  <span className="font-bold text-[#E05252]">{(record.probability * 100).toFixed(2)}%</span>
                </div>
                {record.prediction_time_ms && (
                  <div className="flex justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="text-[#64748B]">INFERENCE LATENCY</span>
                    <span className="font-bold text-[#101B2D]">{record.prediction_time_ms.toFixed(2)} ms</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#64748B]">FINAL VERDICT</span>
                  <span className={`font-bold uppercase ${record.is_fraud ? 'text-[#E05252]' : 'text-[#00A878]'}`}>
                    {record.is_fraud ? 'FLAGGED ANOMALY' : 'SAFE VERIFIED'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default PredictionDetail;
