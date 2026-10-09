import React, { useState, useMemo } from 'react';
import { Activity } from '../types';
import { X, Flame, Eye, Layers, Download, Sliders, MapPin } from 'lucide-react';
import { DMMMSU_OVAL_CENTER } from '../data/mockData';

interface HeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

export const HeatmapModal: React.FC<HeatmapModalProps> = ({
  isOpen,
  onClose,
  activities,
}) => {
  const [heatmapColor, setHeatmapColor] = useState<'orange' | 'fire' | 'cyan'>('orange');
  const [opacity, setOpacity] = useState<number>(0.85);

  if (!isOpen) return null;

  const totalKm = activities.reduce((sum, a) => sum + a.distanceKm, 0);

  // Convert each activity's imperfect GPS coordinates into SVG path data
  const activityPaths = useMemo(() => {
    const centerLat = DMMMSU_OVAL_CENTER[0];
    const centerLng = DMMMSU_OVAL_CENTER[1];

    return activities.map((act) => {
      return {
        id: act.id,
        title: act.title,
        d: act.coordinates
          .map(([lat, lng], idx) => {
            const dLat = lat - centerLat;
            const dLng = lng - centerLng;
            const x = 375 + (dLng / 0.00045) * 115;
            const y = 260 - (dLat / 0.00086) * 165;
            return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' '),
      };
    });
  }, [activities]);

  const primaryColor =
    heatmapColor === 'orange' ? '#FC4C02' : heatmapColor === 'fire' ? '#FF1744' : '#00E5FF';
  const midColor =
    heatmapColor === 'orange' ? '#FF7A00' : heatmapColor === 'fire' ? '#FF5252' : '#00B0FF';
  const coreColor =
    heatmapColor === 'orange' ? '#FFEB3B' : heatmapColor === 'fire' ? '#FFFF00' : '#E0F7FA';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div
        className="bg-[#121316] text-white rounded-xl shadow-2xl max-w-4xl w-full border border-gray-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between bg-[#1A1C20]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FC4C02]/20 text-[#FC4C02] flex items-center justify-center">
              <Flame className="w-5 h-5 fill-[#FC4C02]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">
                Keanna Laine S. Dela Cruz's Personal Heatmap
              </h2>
              <p className="text-xs text-gray-400">
                Agoo DMMMSU Oval · Cumulative Imperfect Walk Sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Heatmap Canvas Display */}
        <div className="relative w-full h-[400px] sm:h-[460px] bg-[#16171a] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 600 520" className="w-full h-full object-contain">
            {/* Dark Map Canvas */}
            <rect width="600" height="520" fill="#16171A" />

            {/* Perimeter Roads */}
            <path
              d="M 0,470 L 460,425 L 600,410"
              stroke="#24262C"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
            <text x="230" y="490" fontSize="9" fill="#5F6370" fontFamily="monospace">
              Doña Toribia Provincial Road
            </text>

            <path
              d="M 120,460 C 80,440 20,330 30,220 C 40,110 90,80 180,75 L 360,75"
              stroke="#202227"
              strokeWidth="14"
              fill="none"
            />

            <circle cx="485" cy="425" r="18" fill="#24262C" stroke="#2E3038" strokeWidth="1.5" />

            {/* West Campus Buildings from IMG_2668 */}
            <rect x="50" y="85" width="46" height="42" fill="#202227" stroke="#2C2E35" rx="1" />
            <rect x="65" y="145" width="55" height="45" fill="#202227" stroke="#2C2E35" rx="1" />
            <text x="92" y="172" fontSize="7" fill="#6B7280" textAnchor="middle">
              DMMMSU elem.
            </text>

            {/* Grandstand Building */}
            <polygon
              points="160,115 190,115 210,145 228,245 238,320 245,395 195,395 178,330 162,240"
              fill="#25272E"
              stroke="#343842"
              strokeWidth="1"
            />
            <text x="195" y="255" fontSize="9" fontWeight="bold" fill="#8B92A0" textAnchor="middle">
              Grandstand
            </text>

            {/* Basketball Courts */}
            <rect x="185" y="150" width="58" height="90" fill="#172A24" stroke="#1F3D34" rx="2" />
            <rect x="208" y="248" width="55" height="88" fill="#172A24" stroke="#1F3D34" rx="2" />
            <text x="235" y="295" fontSize="7" fill="#3D7A68" textAnchor="middle">
              Basketball Courts
            </text>

            {/* Tennis Courts */}
            <rect x="175" y="435" width="36" height="60" fill="#172A24" stroke="#1F3D34" rx="2" />
            <rect x="215" y="425" width="38" height="55" fill="#172A24" stroke="#1F3D34" rx="2" />

            {/* Athletic Oval Track Base Contour */}
            <g transform="rotate(-13 375 260)">
              <rect
                x="260"
                y="95"
                width="225"
                height="340"
                rx="110"
                fill="#121A15"
                stroke="#1B3827"
                strokeWidth="3.5"
              />
              <rect
                x="285"
                y="120"
                width="175"
                height="290"
                rx="86"
                fill="#0F1612"
                stroke="#162D20"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </g>
            <text
              x="305"
              y="110"
              fontSize="11"
              fontWeight="bold"
              fill="#22543D"
              fontStyle="italic"
              transform="rotate(-28 305 110)"
            >
              DMMMSU Oval
            </text>

            {/* PASS 1: Broad Diffuse Ambient Glow for all overlapping imperfect walk sessions */}
            {activityPaths.map((act) => (
              <path
                key={`glow-${act.id}`}
                d={act.d}
                fill="none"
                stroke={primaryColor}
                strokeWidth="16"
                opacity={opacity * 0.18}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* PASS 2: Medium Heat Corona for each session */}
            {activityPaths.map((act) => (
              <path
                key={`mid-${act.id}`}
                d={act.d}
                fill="none"
                stroke={midColor}
                strokeWidth="7"
                opacity={opacity * 0.45}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* PASS 3: Sharp High-Intensity Core showing individual imperfect lines & lane variations */}
            {activityPaths.map((act) => (
              <path
                key={`core-${act.id}`}
                d={act.d}
                fill="none"
                stroke={coreColor}
                strokeWidth="2.2"
                opacity={opacity * 0.85}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>

          {/* Floating Controls */}
          <div className="absolute bottom-3 left-3 bg-[#111215]/90 border border-gray-800 backdrop-blur-xs p-3 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Palette:</span>
              <button
                type="button"
                onClick={() => setHeatmapColor('orange')}
                className={`w-4 h-4 rounded-full bg-[#FC4C02] border-2 ${
                  heatmapColor === 'orange' ? 'border-white scale-110' : 'border-transparent'
                }`}
                title="Strava Orange"
              />
              <button
                type="button"
                onClick={() => setHeatmapColor('fire')}
                className={`w-4 h-4 rounded-full bg-red-600 border-2 ${
                  heatmapColor === 'fire' ? 'border-white scale-110' : 'border-transparent'
                }`}
                title="Hot Red"
              />
              <button
                type="button"
                onClick={() => setHeatmapColor('cyan')}
                className={`w-4 h-4 rounded-full bg-cyan-400 border-2 ${
                  heatmapColor === 'cyan' ? 'border-white scale-110' : 'border-transparent'
                }`}
                title="Electric Cyan"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Intensity:</span>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-20 accent-[#FC4C02]"
              />
            </div>
          </div>

          <div className="absolute top-3 right-3 bg-[#111215]/90 border border-gray-800 p-2.5 rounded-lg text-xs font-mono">
            <span className="text-gray-400 block text-[10px]">TOTAL DMMMSU TRACK DISTANCE</span>
            <span className="text-base font-bold text-[#FC4C02]">{totalKm.toFixed(2)} km</span>
            <span className="text-gray-500 block text-[10px] mt-0.5">Across {activities.length} Recorded Sessions</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 bg-[#16171B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <span>Heatmap combines all 6 walk activities with authentic human stride variations at DMMMSU Oval, Agoo.</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#FC4C02] hover:bg-[#E34000] text-white px-4 py-1.5 rounded font-semibold transition-colors self-end sm:self-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
