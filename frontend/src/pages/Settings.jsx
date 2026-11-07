import React, { useState } from 'react';
import { predictionService } from '../services/predictionService';
import { 
  Sliders, Cpu, RefreshCw, CheckCircle2, AlertTriangle, 
  Info, ShieldCheck 
} from 'lucide-react';

function Settings() {
  const [isReloading, setIsReloading] = useState(false);
  const [reloadMessage, setReloadMessage] = useState(null);

  const handleReloadModel = async () => {
    setIsReloading(true);
    setReloadMessage(null);
    try {
      const response = await predictionService.reloadModel();
      setReloadMessage({
        type: 'success',
        text: response.message || 'Machine learning model pipeline reloaded successfully.'
      });
    } catch (error) {
      setReloadMessage({
        type: 'error',
        text: error.message || 'Failed to reload model.'
      });
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto w-full animate-fadeIn">
      
      {/* 2-COLUMN CONFIGURATION GRID (Matching Reference Screen 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: Decision Boundary Controls */}
        <div className="fintech-card p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101B2D]">
                Decision Boundary Controls
              </h2>
              <p className="text-xs text-[#64748B]">Classification threshold sensitivity</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F5F4EF]/50 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-[#182333]">
                <span>Anomaly Probability Threshold</span>
                <span className="font-mono text-base font-extrabold text-[#00A878]">50.0%</span>
              </div>
              
              {/* Threshold Visual Bar */}
              <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#00A878]" style={{ width: '50%' }} />
                <div className="h-full bg-[#E05252]/40" style={{ width: '50%' }} />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
                <span>0% Safe</span>
                <span className="font-bold text-[#00A878]">50% Boundary</span>
                <span>100% Threat</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#B3E8D8] bg-[#E6F7F2]/40 space-y-1.5">
              <span className="text-xs font-bold text-[#00A878] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Threshold Rule
              </span>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Transactions with risk probability &gt; 50% are flagged as anomalies. This parameter is managed internally by the Random Forest classifier.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Model Configuration */}
        <div className="fintech-card p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101B2D]">
                Model Configuration
              </h2>
              <p className="text-xs text-[#64748B]">Scikit-Learn model pipeline state</p>
            </div>
          </div>

          <div className="space-y-4">
            
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F4EF]/50 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Model Engine:</span>
                <span className="font-bold text-[#101B2D]">Random Forest (Scikit-Learn)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Estimators:</span>
                <span className="font-mono font-bold text-[#00A878]">100 Trees</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Target Output:</span>
                <span className="font-mono font-bold text-[#101B2D]">is_fraud (Binary)</span>
              </div>
            </div>

            {reloadMessage && (
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                reloadMessage.type === 'success' 
                  ? 'bg-[#E6F7F2] border-[#B3E8D8] text-[#00A878]' 
                  : 'bg-[#FDF2F2] border-[#F8D0D0] text-[#E05252]'
              }`}>
                {reloadMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{reloadMessage.text}</span>
              </div>
            )}

            <button
              onClick={handleReloadModel}
              disabled={isReloading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#00A878] hover:bg-[#009268] text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isReloading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Reload Pipeline Weights</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Settings;
