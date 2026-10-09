import React, { useState } from 'react';
import { Activity } from '../types';
import { ArrowUpDown, Footprints, Clock, MapPin, ChevronRight, Eye } from 'lucide-react';

interface ActivitiesTableProps {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
}

export const ActivitiesTable: React.FC<ActivitiesTableProps> = ({
  activities,
  onSelectActivity,
}) => {
  const [sortField, setSortField] = useState<'date' | 'distance' | 'steps' | 'duration'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: 'date' | 'distance' | 'steps' | 'duration') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedActivities = [...activities].sort((a, b) => {
    let diff = 0;
    if (sortField === 'date') {
      diff = new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
    } else if (sortField === 'distance') {
      diff = b.distanceKm - a.distanceKm;
    } else if (sortField === 'steps') {
      diff = b.steps - a.steps;
    } else if (sortField === 'duration') {
      diff = b.durationSeconds - a.durationSeconds;
    }
    return sortAsc ? -diff : diff;
  });

  const totalKm = activities.reduce((sum, a) => sum + a.distanceKm, 0);
  const totalSteps = activities.reduce((sum, a) => sum + a.steps, 0);
  const totalSeconds = activities.reduce((sum, a) => sum + a.durationSeconds, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  return (
    <div className="bg-[#111113] text-gray-100 rounded-lg p-4 sm:p-6 border border-gray-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800/80 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FC4C02]"></span>
            <h3 className="font-mono text-sm tracking-wide uppercase text-gray-300 font-semibold">
              Activities Log · Reference Data
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Table view reproducing the exact recorded sessions at DMMMSU Oval track
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-black/40 px-3 py-1.5 rounded border border-gray-800">
          <span>Total: <strong className="text-white">{totalKm.toFixed(2)} km</strong></span>
          <span>·</span>
          <span><strong className="text-white">{totalSteps.toLocaleString()}</strong> steps</span>
        </div>
      </div>

      {/* Replicating the table from reference IMG_2665.jpeg */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left font-mono text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 font-medium">
              <th className="py-3 px-3 w-14">No.</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-white"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1.5">
                  Date
                  <ArrowUpDown className="w-3 h-3 text-gray-600" />
                </div>
              </th>
              <th className="py-3 px-3 hidden sm:table-cell">Start time</th>
              <th
                className="py-3 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('distance')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Distance
                  <ArrowUpDown className="w-3 h-3 text-gray-600" />
                </div>
              </th>
              <th
                className="py-3 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('steps')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Steps
                  <ArrowUpDown className="w-3 h-3 text-gray-600" />
                </div>
              </th>
              <th
                className="py-3 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Duration
                  <ArrowUpDown className="w-3 h-3 text-gray-600" />
                </div>
              </th>
              <th className="py-3 px-2 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {sortedActivities.map((act) => (
              <tr
                key={act.id}
                onClick={() => onSelectActivity(act)}
                className="hover:bg-white/5 transition-colors cursor-pointer group"
              >
                {/* No. */}
                <td className="py-3 px-3 font-semibold text-gray-400 group-hover:text-[#FC4C02]">
                  {act.no !== undefined ? act.no : '—'}
                </td>

                {/* Date */}
                <td className="py-3 px-3 text-white font-sans font-medium sm:font-mono">
                  <div className="flex items-center gap-2">
                    <span>{act.date}</span>
                    <span className="sm:hidden text-[10px] text-gray-500 font-mono">
                      · {act.startTime}
                    </span>
                  </div>
                </td>

                {/* Start time */}
                <td className="py-3 px-3 text-gray-300 hidden sm:table-cell">
                  {act.startTime}
                </td>

                {/* Distance */}
                <td className="py-3 px-3 text-right font-semibold text-white">
                  {act.distanceKm.toFixed(2)} km
                </td>

                {/* Steps */}
                <td className="py-3 px-3 text-right text-gray-300">
                  {act.steps.toLocaleString()}
                </td>

                {/* Duration */}
                <td className="py-3 px-3 text-right text-gray-200">
                  {act.durationStr}
                </td>

                {/* Action button */}
                <td className="py-3 px-2 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectActivity(act);
                    }}
                    className="p-1.5 rounded text-gray-400 group-hover:text-white group-hover:bg-[#FC4C02]/20 transition-colors"
                    title="Open Activity Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
        <span className="text-[11px]">Click any row above to view full telemetry, splits & map playback</span>
        <span className="text-[11px] font-mono">
          Total Duration: <strong className="text-white">{totalHours}h {totalMins}m</strong>
        </span>
      </div>
    </div>
  );
};
