import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import { 
  Search, Filter, RefreshCw, ArrowRight, ShieldCheck, 
  AlertTriangle, CheckCircle2, ChevronRight 
} from 'lucide-react';

function History() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterDecision, setFilterDecision] = useState('ALL');

  const fetchLogHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await predictionService.fetchHistory();
      setLogs(data);
      setFilteredLogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogHistory();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = logs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log => 
        String(log.id).toLowerCase().includes(term) ||
        String(log.type).toLowerCase().includes(term) ||
        String(log.amount).includes(term)
      );
    }

    if (filterType !== 'ALL') {
      result = result.filter(log => log.type === filterType);
    }

    if (filterDecision !== 'ALL') {
      result = result.filter(log => 
        filterDecision === 'FRAUD' ? log.is_fraud : !log.is_fraud
      );
    }

    setFilteredLogs(result);
  }, [searchTerm, filterType, filterDecision, logs]);

  const getTransactionTypes = () => {
    const types = new Set(logs.map(log => log.type));
    return ['ALL', ...Array.from(types)];
  };

  const formatCurrencyINR = (amount) => {
    return '₹ ' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatBalanceINR = (amount) => {
    return '₹ ' + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto w-full animate-fadeIn">
      
      {/* 1. FILTER & SEARCH BAR (Matching Reference Screen 6) */}
      <div className="fintech-card p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by ID, channel or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fintech-input pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          {/* Channel dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#182333] focus:outline-none focus:border-[#00A878] cursor-pointer"
            >
              <option value="ALL">All Channels</option>
              {getTransactionTypes().filter(t => t !== 'ALL').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#182333] focus:outline-none focus:border-[#00A878] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SAFE">Safe Verified</option>
              <option value="FRAUD">Flagged Threat</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchLogHistory}
            disabled={isLoading}
            className="p-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#101B2D] cursor-pointer transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

        </div>
      </div>

      {/* 2. CRYPTOGRAPHIC AUDIT TABLE (Matching Reference Screen 6) */}
      <div className="fintech-card overflow-hidden">
        
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#00A878] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#64748B] text-xs font-semibold">Loading cryptographic audit ledger...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-[#E05252] text-xs space-y-2">
            <AlertTriangle className="w-6 h-6 mx-auto" />
            <p>{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center text-[#64748B] text-xs">
            No audit records matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F5F4EF]/70 text-[#64748B] font-semibold text-[11px]">
                  <th className="py-3 px-4">RECORD ID</th>
                  <th className="py-3 px-4">CHANNEL</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4">ORIGIN BALANCE</th>
                  <th className="py-3 px-4">DEST. BALANCE</th>
                  <th className="py-3 px-4">ANOMALY %</th>
                  <th className="py-3 px-4 text-center">VERDICT</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLogs.map(log => (
                  <tr 
                    key={log.id} 
                    onClick={() => navigate(`/prediction/${log.id}`)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#101B2D]">
                      #LOG-{log.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#182333]">
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#101B2D]">
                      {formatCurrencyINR(log.amount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#64748B]">
                      {formatBalanceINR(log.oldbalanceOrg)} &rarr; {formatBalanceINR(log.newbalanceOrig)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#64748B]">
                      {formatBalanceINR(log.oldbalanceDest)} &rarr; {formatBalanceINR(log.newbalanceDest)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={log.is_fraud ? 'text-[#E05252]' : 'text-[#64748B]'}>
                        {(log.probability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        log.is_fraud 
                          ? 'bg-[#FDF2F2] border border-[#F8D0D0] text-[#E05252]' 
                          : 'bg-[#E6F7F2] border border-[#B3E8D8] text-[#00A878]'
                      }`}>
                        {log.is_fraud ? 'FLAGGED' : 'SAFE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[#00A878] hover:underline font-semibold inline-flex items-center gap-1">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default History;
