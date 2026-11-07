import React, { useState, useEffect } from 'react';
import { FiShield, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import soundFx from '../utils/soundEffects';

/**
 * Interactive SVG Threat Radar with animated sweep, real-time plotted blips,
 * and live threat coordinate hover inspection.
 */
function ThreatRadarWidget({ threats = [], totalAudited = 0 }) {
  const [activeBlip, setActiveBlip] = useState(null);
  const [radarNodes, setRadarNodes] = useState([]);

  useEffect(() => {
    // Generate plotted coordinates for detected threats
    const nodes = threats.slice(0, 8).map((t, idx) => {
      // Calculate angle and radius based on risk and index
      const angle = (idx * (360 / Math.max(threats.length, 6)) + 25) * (Math.PI / 180);
      const radius = 35 + (t.probability * 45); // distance from center (0 to 90px)
      const cx = 100 + radius * Math.cos(angle);
      const cy = 100 + radius * Math.sin(angle);

      return {
        ...t,
        cx,
        cy,
        isCritical: t.probability >= 0.75
      };
    });

    setRadarNodes(nodes);
  }, [threats]);

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Spatial Threat Radar
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
          360° SWEEP
        </span>
      </div>

      {/* Center Radar Scanner Viewport */}
      <div className="relative w-full aspect-square max-w-[240px] mx-auto flex items-center justify-center my-2">
        
        {/* Radar Rings (SVG) */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          {/* Concentric distance rings */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#1e293b" strokeWidth="1" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="10" fill="none" stroke="#0ea5e9" strokeWidth="1" />

          {/* Crosshairs */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="#1e293b" strokeWidth="1" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#1e293b" strokeWidth="1" />

          {/* Threat Nodes / Blips */}
          {radarNodes.map((node) => (
            <g 
              key={node.id} 
              className="cursor-pointer group"
              onMouseEnter={() => {
                setActiveBlip(node);
                soundFx.playClick();
              }}
              onMouseLeave={() => setActiveBlip(null)}
            >
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.isCritical ? 5 : 4}
                className={node.isCritical ? "fill-rose-500 animate-pulse" : "fill-amber-400"}
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="9"
                className={node.isCritical ? "stroke-rose-500/40 fill-none animate-ping" : "stroke-amber-400/40 fill-none"}
                strokeWidth="1"
              />
            </g>
          ))}
        </svg>

        {/* Rotating Radar Sweep Cone */}
        <div 
          className="absolute inset-0 pointer-events-none animate-radar"
          style={{
            background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.4) 0deg, rgba(6, 182, 212, 0) 65deg, transparent 65deg)',
            borderRadius: '50%'
          }}
        />

        {/* Center Target Core */}
        <div className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-neon-blue z-10" />

        {/* Tooltip on Blip Hover */}
        {activeBlip && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-2xl text-[10px] font-mono text-white whitespace-nowrap animate-slide-in">
            <span className="text-cyan-400 font-bold">#LOG-{activeBlip.id}</span> &bull; {activeBlip.type} &bull; ${(activeBlip.amount).toLocaleString()} &bull; <span className="text-rose-400 font-bold">{(activeBlip.probability * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Radar Legend / Metrics */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Active Threats: <strong className="text-white">{threats.length}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Surveillance: <strong className="text-cyan-400">Online</strong></span>
        </div>
      </div>

    </div>
  );
}

export default ThreatRadarWidget;
