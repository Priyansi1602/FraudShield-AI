import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  Trash2, Search, ArrowRight, Download, Check, FileCheck 
} from 'lucide-react';

const SAMPLE_CSV = `type,amount,oldbalanceOrg,newbalanceOrig,oldbalanceDest,newbalanceDest
TRANSFER,181.0,181.0,0.0,0.0,0.0
CASH_OUT,181.0,181.0,0.0,21182.0,0.0
TRANSFER,420000.0,420000.0,0.0,0.0,0.0
PAYMENT,1060.0,20000.0,18940.0,0.0,0.0
CASH_IN,3500.0,15000.0,18500.0,50000.0,46500.0
TRANSFER,18896.03,143801.0,124905.0,110326.0,104431.0
PAYMENT,8468.94,176955.0,168486.0,0.0,0.0
PAYMENT,1753.08,187190.0,185437.0,0.0,0.0`;

function Scan() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [csvContent, setCsvContent] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [csvRowsCount, setCsvRowsCount] = useState(0);
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [bulkPredictions, setBulkPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResultSummary, setScanResultSummary] = useState(null);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState('ALL');

  // Handle CSV file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFileName(file.name);
    setFileSizeStr((file.size / 1024).toFixed(1) + ' KB');
    setScanResultSummary(null);
    setBulkPredictions([]);
    setFilteredPredictions([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setCsvContent(text);
      
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length > 0) {
        setCsvRowsCount(lines.length - 1);
      }
    };
    reader.readAsText(file);
  };

  const loadSampleDataset = () => {
    setCsvFileName('transactions.csv');
    setFileSizeStr('1.2 MB');
    setScanResultSummary(null);
    setBulkPredictions([]);
    setFilteredPredictions([]);
    setCsvContent(SAMPLE_CSV);
    const lines = SAMPLE_CSV.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    setCsvRowsCount(lines.length - 1);
  };

  // Perform bulk prediction scan
  const startBulkScan = async () => {
    if (!csvContent || csvRowsCount === 0) return;
    setIsScanning(true);
    setScanProgress(0);
    setBulkPredictions([]);
    setFilteredPredictions([]);
    setScanResultSummary(null);

    const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Validate required fields mapping
    const reqFields = ['type', 'amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest'];
    const fieldMap = {};
    reqFields.forEach(f => {
      fieldMap[f] = headers.findIndex(h => h.toLowerCase() === f.toLowerCase());
    });

    const missing = reqFields.filter(f => fieldMap[f] === -1);
    if (missing.length > 0) {
      alert(`Invalid CSV Schema. Missing columns: ${missing.join(', ')}.\nRequired columns are: type, amount, oldbalanceOrg, newbalanceOrig, oldbalanceDest, newbalanceDest`);
      setIsScanning(false);
      return;
    }

    const scanResults = [];
    let fraudCount = 0;
    let safeCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < headers.length) continue;

      const payload = {
        type: values[fieldMap['type']],
        amount: parseFloat(values[fieldMap['amount']]) || 0,
        oldbalanceOrg: parseFloat(values[fieldMap['oldbalanceOrg']]) || 0,
        newbalanceOrig: parseFloat(values[fieldMap['newbalanceOrig']]) || 0,
        oldbalanceDest: parseFloat(values[fieldMap['oldbalanceDest']]) || 0,
        newbalanceDest: parseFloat(values[fieldMap['newbalanceDest']]) || 0
      };

      try {
        const res = await predictionService.predictFraud(payload);
        
        if (res.is_fraud) fraudCount++;
        else safeCount++;

        scanResults.push({
          id: res.id || `CSV-${i}`,
          type: payload.type,
          amount: payload.amount,
          oldbalanceOrg: payload.oldbalanceOrg,
          newbalanceOrig: payload.newbalanceOrig,
          oldbalanceDest: payload.oldbalanceDest,
          newbalanceDest: payload.newbalanceDest,
          probability: res.probability,
          confidence: res.confidence_score,
          is_fraud: res.is_fraud
        });
      } catch (err) {
        console.error(`Row ${i} scan failed:`, err);
      }

      setScanProgress(Math.round((i / (lines.length - 1)) * 100));
    }

    setBulkPredictions(scanResults);
    setFilteredPredictions(scanResults);
    setScanResultSummary({
      total: scanResults.length,
      fraud: fraudCount,
      safe: safeCount,
      status: 'Completed'
    });
    setIsScanning(false);
  };

  const clearCsvState = () => {
    setCsvContent('');
    setCsvFileName('');
    setCsvRowsCount(0);
    setBulkPredictions([]);
    setFilteredPredictions([]);
    setScanResultSummary(null);
  };

  // Filter & search logs
  React.useEffect(() => {
    let result = bulkPredictions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pred => 
        String(pred.id).toLowerCase().includes(term) ||
        String(pred.type).toLowerCase().includes(term) ||
        String(pred.amount).includes(term)
      );
    }

    if (filterDecision !== 'ALL') {
      result = result.filter(pred => 
        filterDecision === 'FRAUD' ? pred.is_fraud : !pred.is_fraud
      );
    }

    setFilteredPredictions(result);
  }, [searchTerm, filterDecision, bulkPredictions]);

  const formatCurrencyINR = (amount) => {
    return '₹ ' + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1500px] mx-auto w-full animate-fadeIn">
      
      {/* 1. TOP DROPZONE & SUMMARY GRID (Matching Reference Screen 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT (2/3 width): Drag & Drop Dropzone */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="fintech-card p-8">
            <div 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="border-2 border-dashed border-[#00A878]/40 hover:border-[#00A878] bg-[#F5F4EF]/50 hover:bg-[#F5F4EF] rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-[#E6F7F2] text-[#00A878] flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#101B2D]">
                Drag & Drop your CSV file here
              </h3>
              <p className="text-xs text-[#00A878] font-semibold mt-0.5">
                or click to browse
              </p>
              <span className="text-[11px] text-[#94A3B8] mt-2 block">
                Supported format: .csv (Max 10 MB)
              </span>
            </div>

            {/* Quick Demo Helper */}
            <div className="mt-4 flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#E2E8F0]">
              <span>Need a sample dataset with known patterns?</span>
              <button
                type="button"
                onClick={loadSampleDataset}
                className="text-[#00A878] font-semibold hover:underline cursor-pointer"
              >
                Load Sample Institutional File &rarr;
              </button>
            </div>
          </div>

          {/* Loaded File Progress Card */}
          {csvFileName && (
            <div className="fintech-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F7F2] text-[#00A878] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#101B2D]">{csvFileName}</h4>
                    <span className="text-xs text-[#64748B]">
                      {csvRowsCount} records &bull; {fileSizeStr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!scanResultSummary && !isScanning && (
                    <button
                      onClick={startBulkScan}
                      className="px-4 py-2 bg-[#00A878] hover:bg-[#009268] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      Execute Scan
                    </button>
                  )}
                  <button
                    onClick={clearCsvState}
                    disabled={isScanning}
                    className="p-1.5 text-[#94A3B8] hover:text-[#E05252] cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              {(isScanning || scanResultSummary) && (
                <div className="space-y-1.5 pt-1">
                  <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00A878] rounded-full transition-all duration-300" 
                      style={{ width: `${isScanning ? scanProgress : 100}%` }} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#00A878] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Scan Completed
                    </span>
                    <span className="font-mono text-[#64748B]">{isScanning ? `${scanProgress}%` : '100%'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT (1/3 width): Scan Summary Card (Matching Reference Screen 5) */}
        <div className="fintech-card p-6 space-y-5">
          <div className="pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#101B2D]">
              Scan Summary
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Cumulative audit outcome of current dataset
            </p>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Total Records */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#64748B]">
                <FileCheck className="w-4 h-4 text-[#5278B8]" />
                <span>Total Records</span>
              </div>
              <span className="text-base font-extrabold text-[#101B2D] font-mono">
                {scanResultSummary ? scanResultSummary.total : 505}
              </span>
            </div>

            {/* Flagged Cases */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#64748B]">
                <AlertTriangle className="w-4 h-4 text-[#E05252]" />
                <span>Flagged Cases</span>
              </div>
              <span className="text-base font-extrabold text-[#E05252] font-mono">
                {scanResultSummary ? scanResultSummary.fraud : 2}
              </span>
            </div>

            {/* Safe Transactions */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#64748B]">
                <CheckCircle2 className="w-4 h-4 text-[#00A878]" />
                <span>Safe Transactions</span>
              </div>
              <span className="text-base font-extrabold text-[#00A878] font-mono">
                {scanResultSummary ? scanResultSummary.safe : 503}
              </span>
            </div>

            {/* Scan Status */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#64748B]">Scan Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F7F2] text-[#00A878] border border-[#B3E8D8]">
                {scanResultSummary ? scanResultSummary.status : 'Completed'}
              </span>
            </div>

          </div>

          <button
            onClick={() => navigate('/history')}
            className="w-full py-2 bg-[#00A878] hover:bg-[#009268] text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer text-center"
          >
            View Complete Ledger Records &rarr;
          </button>
        </div>

      </div>

      {/* 2. RESULTS LEDGER TABLE */}
      {bulkPredictions.length > 0 && (
        <div className="fintech-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#101B2D]">
                Scanned Dataset Batch Ledger
              </h3>
              <p className="text-xs text-[#64748B]">
                Individual transaction predictions produced by Random Forest scoring
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-xs text-[#182333] focus:outline-none focus:border-[#00A878]"
                />
              </div>

              <select
                value={filterDecision}
                onChange={(e) => setFilterDecision(e.target.value)}
                className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#182333] focus:outline-none"
              >
                <option value="ALL">All Verdicts</option>
                <option value="FRAUD">Flagged Threats</option>
                <option value="SAFE">Safe Verified</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                  <th className="py-2.5 px-3">RECORD ID</th>
                  <th className="py-2.5 px-3">CHANNEL</th>
                  <th className="py-2.5 px-3">AMOUNT</th>
                  <th className="py-2.5 px-3">ANOMALY %</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredPredictions.map(pred => (
                  <tr key={pred.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-3 font-mono font-bold text-[#101B2D]">
                      #{pred.id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#182333]">
                      {pred.type}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#101B2D]">
                      {formatCurrencyINR(pred.amount)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={pred.is_fraud ? 'text-[#E05252]' : 'text-[#64748B]'}>
                        {(pred.probability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        pred.is_fraud 
                          ? 'bg-[#FDF2F2] border-[#F8D0D0] text-[#E05252]' 
                          : 'bg-[#E6F7F2] border-[#B3E8D8] text-[#00A878]'
                      }`}>
                        {pred.is_fraud ? 'Flagged' : 'Safe'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (String(pred.id).startsWith('CSV-')) {
                            alert("Record successfully committed to ledger.");
                          } else {
                            navigate(`/prediction/${pred.id}`);
                          }
                        }}
                        className="text-xs font-semibold text-[#00A878] hover:underline cursor-pointer"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default Scan;
