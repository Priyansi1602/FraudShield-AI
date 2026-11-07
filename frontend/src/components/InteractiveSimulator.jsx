import React, { useState } from 'react';
import { predictionService } from '../services/predictionService';
import { 
  FiPlay, FiZap, FiCheckCircle, FiAlertTriangle, 
  FiRefreshCw, FiSliders, FiDollarSign, FiActivity 
} from 'react-icons/fi';
import soundFx from '../utils/soundEffects';

function InteractiveSimulator({ onNewPrediction }) {
  const [formData, setFormData] = useState({
    type: 'TRANSFER',
    amount: 250000,
    oldbalanceOrg: 250000,
    newbalanceOrig: 0,
    oldbalanceDest: 10000,
    newbalanceDest: 260000
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const quickPresets = [
    { label: 'High-Risk Wire ($450k)', type: 'TRANSFER', amount: 450000, oldOrg: 450000, newOrg: 0, oldDest: 0, newDest: 0 },
    { label: 'Mule Cash-Out ($180k)', type: 'CASH_OUT', amount: 180000, oldOrg: 180000, newOrg: 0, oldDest: 50000, newDest: 230000 },
    { label: 'Normal Coffee ($4.50)', type: 'PAYMENT', amount: 4.5, oldOrg: 1200, newOrg: 1195.5, oldDest: 0, newDest: 0 },
    { label: 'Merchant Deposit ($25k)', type: 'CASH_IN', amount: 25000, oldOrg: 10000, newOrg: 35000, oldDest: 80000, newDest: 55000 }
  ];

  const applyPreset = (preset) => {
    soundFx.playClick();
    setFormData({
      type: preset.type,
      amount: preset.amount,
      oldbalanceOrg: preset.oldOrg,
      newbalanceOrig: preset.newOrg,
      oldbalanceDest: preset.oldDest,
      newbalanceDest: preset.newDest
    });
    setResult(null);
    setError('');
  };

  const handleRunInference = async (e) => {
    if (e) e.preventDefault();
    setIsEvaluating(true);
    setError('');
    soundFx.playClick();

    try {
      const res = await predictionService.predictFraud(formData);
      setResult(res);

      if (res.is_fraud) {
        soundFx.playAlert();
      } else {
        soundFx.playSuccess();
      }

      if (onNewPrediction) {
        onNewPrediction(res);
      }
    } catch (err) {
      setError(err.message || 'Simulation inference request failed.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FiZap className="text-amber-400 text-lg animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Interactive ML Scenario Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test any arbitrary transaction parameters in real-time against the live ML Random Forest model.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {quickPresets.map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Controls Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Type */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Channel Conduit
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-semibold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="TRANSFER">TRANSFER (Wire / Interbank)</option>
                <option value="CASH_OUT">CASH_OUT (Atm / Counter Liquidation)</option>
                <option value="PAYMENT">PAYMENT (Merchant POS / Online)</option>
                <option value="CASH_IN">CASH_IN (Deposit / Inward)</option>
                <option value="DEBIT">DEBIT (Direct Charge)</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Transfer Amount ($)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Old Balance Origin */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Origin Balance Before ($)
              </label>
              <input
                type="number"
                value={formData.oldbalanceOrg}
                onChange={(e) => setFormData({ ...formData, oldbalanceOrg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* New Balance Origin */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Origin Balance After ($)
              </label>
              <input
                type="number"
                value={formData.newbalanceOrig}
                onChange={(e) => setFormData({ ...formData, newbalanceOrig: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Old Balance Destination */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Dest Balance Before ($)
              </label>
              <input
                type="number"
                value={formData.oldbalanceDest}
                onChange={(e) => setFormData({ ...formData, oldbalanceDest: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* New Balance Destination */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Dest Balance After ($)
              </label>
              <input
                type="number"
                value={formData.newbalanceDest}
                onChange={(e) => setFormData({ ...formData, newbalanceDest: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRunInference}
              disabled={isEvaluating}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiPlay className="text-xs" />
                  <span>Execute ML Inference</span>
                </>
              )}
            </button>

            {error && (
              <span className="text-xs text-rose-400 font-semibold">{error}</span>
            )}
          </div>
        </div>

        {/* Live Result Gauge Gauge Column (1 col) */}
        <div className="bg-[#090d18] border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
            Live Model Verdict
          </span>

          {result ? (
            <div className="space-y-3 w-full animate-fadeIn">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke={result.is_fraud ? "#f43f5e" : "#10b981"} 
                    strokeWidth="8" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * result.probability)}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-xl font-extrabold font-mono ${result.is_fraud ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {(result.probability * 100).toFixed(0)}%
                  </span>
                  <span className="text-[8px] font-mono text-slate-400 uppercase">RISK</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`py-1.5 px-3 rounded-xl border font-mono font-bold text-xs uppercase ${
                result.is_fraud 
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}>
                {result.is_fraud ? 'FLAGGED ANOMALY' : 'CLEAN CONDUIT'}
              </div>

              <div className="text-[10px] font-mono text-slate-400 flex justify-between pt-1 border-t border-slate-800/80">
                <span>Latency: {result.prediction_time_ms ? result.prediction_time_ms.toFixed(1) : '8.2'} ms</span>
                <span>ID: #{result.id || 'LIVE'}</span>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-2">
              <FiActivity className="text-slate-600 text-3xl mx-auto animate-pulse" />
              <p className="text-xs text-slate-400">Tweak parameters or select a preset to evaluate.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default InteractiveSimulator;
