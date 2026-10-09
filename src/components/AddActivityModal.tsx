import React, { useState } from 'react';
import { Activity } from '../types';
import { X, Plus, Footprints, Clock, MapPin, Check } from 'lucide-react';
import { DMMMSU_OVAL_CENTER, generateImperfectWalkPoints } from '../data/mockData';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
  nextActivityNumber: number;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
  nextActivityNumber,
}) => {
  const [title, setTitle] = useState('morning walk');
  const [distanceKm, setDistanceKm] = useState('2.40');
  const [durationStr, setDurationStr] = useState('33m 00s');
  const [steps, setSteps] = useState('3,500');
  const [date, setDate] = useState('October 9, 2026');
  const [startTime, setStartTime] = useState('4:30 PM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dist = parseFloat(distanceKm) || 2.4;
    const stepCount = parseInt(steps.replace(/,/g, ''), 10) || 3500;
    const durParts = durationStr.match(/(\d+)m\s*(\d*)s?/);
    const mins = durParts ? parseInt(durParts[1], 10) : 30;
    const secs = durParts && durParts[2] ? parseInt(durParts[2], 10) : 0;
    const durationSeconds = mins * 60 + secs;

    const laps = Math.max(1, Math.round((dist / 0.4) * 10) / 10);
    // Generate authentic imperfect walk points around Agoo DMMMSU Oval (1 single lap)
    const coords = generateImperfectWalkPoints(1.0, Date.now() % 100, true);

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      no: nextActivityNumber,
      title: title || 'morning walk',
      sport: 'walk',
      date,
      rawDate: '2026-10-09',
      startTime,
      distanceKm: dist,
      steps: stepCount,
      durationStr,
      durationSeconds,
      elevationGainM: 4,
      locationName: 'DMMMSU Oval, South La Union Campus',
      device: 'Strava App · Agoo, La Union',
      privacy: 'only_you',
      calories: Math.round(dist * 62),
      avgPaceMinKm: `${Math.floor(mins / dist)}:${Math.floor(((mins / dist) % 1) * 60)
        .toString()
        .padStart(2, '0')} /km`,
      lapsCount: Math.round(laps),
      kudos: [],
      comments: [],
      coordinates: coords,
      splits: [
        { lap: 1, distanceKm: 0.4, timeStr: '5m 30s', paceStr: '13:45 /km', elevGainM: 1 },
      ],
    };

    onAddActivity(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FC4C02] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Manual Activity · DMMMSU Oval
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Activity Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#FC4C02]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.01"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#FC4C02]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Duration (e.g. 33m 14s)</label>
              <input
                type="text"
                value={durationStr}
                onChange={(e) => setDurationStr(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#FC4C02]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Steps Count</label>
              <input
                type="text"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#FC4C02]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#FC4C02]"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FC4C02] hover:bg-[#E34000] text-white rounded font-semibold transition-colors"
            >
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
