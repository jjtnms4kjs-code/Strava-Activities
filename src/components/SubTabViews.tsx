import React from 'react';
import { Trophy, Award, Users, Flame, MessageCircle, MapPin, Check } from 'lucide-react';
import { Activity } from '../types';

interface SubTabViewsProps {
  activeTab: string;
  activities: Activity[];
  userAvatarUrl?: string;
  onSelectActivity: (activity: Activity) => void;
}

export const SubTabViews: React.FC<SubTabViewsProps> = ({
  activeTab,
  activities,
  userAvatarUrl,
  onSelectActivity,
}) => {
  if (activeTab === 'trophy') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-1">Keanna's Trophy Case</h3>
        <p className="text-xs text-gray-500 mb-5">Digital achievements and challenge completion badges</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#FC4C02] text-white flex items-center justify-center text-2xl shadow-sm mb-2">
              🏆
            </div>
            <h4 className="font-bold text-xs text-gray-900">October Walk 2026</h4>
            <span className="text-[10px] text-gray-500 mt-0.5">Completed 2+ km</span>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm mb-2">
              👟
            </div>
            <h4 className="font-bold text-xs text-gray-900">10k Steps Milestone</h4>
            <span className="text-[10px] text-gray-500 mt-0.5">14,856 total campus steps</span>
          </div>

          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl shadow-sm mb-2">
              🎓
            </div>
            <h4 className="font-bold text-xs text-gray-900">DMMMSU SLUC Pioneer</h4>
            <span className="text-[10px] text-gray-500 mt-0.5">Campus Track Explorer</span>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm mb-2">
              🌅
            </div>
            <h4 className="font-bold text-xs text-gray-900">Sunrise Walker</h4>
            <span className="text-[10px] text-gray-500 mt-0.5">6:28 AM session logged</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'following') {
    const suggestedAthletes = [
      { name: 'Clarisse Santos', role: 'DMMMSU Track & Field', initial: 'C', bg: '#E15241', distance: '18.4 km this month' },
      { name: 'Joshua Reyes', role: 'SLUC Computer Science', initial: 'J', bg: '#1976D2', distance: '12.1 km this month' },
      { name: 'Coach Ding', role: 'Athletics Coach · DMMMSU', initial: 'D', bg: '#388E3C', distance: '45.0 km this month' },
      { name: 'Mark Bautista', role: 'La Union Striders', initial: 'M', bg: '#00897B', distance: '31.2 km this month' },
    ];

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-1">Campus Athletes & Connections</h3>
        <p className="text-xs text-gray-500 mb-4">Follow peers training at DMMMSU South La Union Campus</p>
        <div className="divide-y divide-gray-100">
          {suggestedAthletes.map((athlete, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm"
                  style={{ backgroundColor: athlete.bg }}
                >
                  {athlete.initial}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{athlete.name}</h4>
                  <p className="text-xs text-gray-500">{athlete.role} · <span className="font-mono">{athlete.distance}</span></p>
                </div>
              </div>
              <button
                type="button"
                className="bg-gray-100 hover:bg-[#FC4C02] hover:text-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'qoms') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-1">Course Records & Top 10s</h3>
        <p className="text-xs text-gray-500 mb-4">Segment efforts around DMMMSU Oval track</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                <th className="py-2.5 px-3">Segment Name</th>
                <th className="py-2.5 px-3">Distance</th>
                <th className="py-2.5 px-3">Keanna's PR</th>
                <th className="py-2.5 px-3">Current CR / QOM</th>
                <th className="py-2.5 px-3">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-2.5 px-3 font-bold font-sans text-gray-900">DMMMSU Oval 400m Track Loop</td>
                <td className="py-2.5 px-3">0.40 km</td>
                <td className="py-2.5 px-3 font-semibold text-[#FC4C02]">5m 22s</td>
                <td className="py-2.5 px-3 text-gray-600">54s (Athletics Varsity)</td>
                <td className="py-2.5 px-3">Top 15% (Walk)</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2.5 px-3 font-bold font-sans text-gray-900">Doña Toribia Road Approach</td>
                <td className="py-2.5 px-3">0.32 km</td>
                <td className="py-2.5 px-3 font-semibold text-[#FC4C02]">4m 15s</td>
                <td className="py-2.5 px-3 text-gray-600">48s</td>
                <td className="py-2.5 px-3">Top 20%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2.5 px-3 font-bold font-sans text-gray-900">Computer Science to Oval Sprint</td>
                <td className="py-2.5 px-3">0.18 km</td>
                <td className="py-2.5 px-3 font-semibold text-[#FC4C02]">2m 10s</td>
                <td className="py-2.5 px-3 text-gray-600">28s</td>
                <td className="py-2.5 px-3">Top 12%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'local_legends') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">👑</span>
          <h3 className="text-base font-bold text-gray-900">Local Legend Status</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Local Legend is awarded to the athlete who logs the most efforts on a segment over a rolling 90-day window.
        </p>
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-900 block">DMMMSU Oval Track (400m)</span>
            <p className="text-xs text-amber-800 mt-0.5">Keanna Laine S. Dela Cruz is currently ranked #2 with <strong>23 laps</strong> in 90 days!</p>
          </div>
          <span className="px-3 py-1 bg-amber-500 text-white font-bold text-xs rounded-full shadow-xs">
            Contender 🌿
          </span>
        </div>
      </div>
    );
  }

  if (activeTab === 'posts') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-1">Posts & Updates</h3>
        <p className="text-xs text-gray-500 mb-4">Community updates and training notes</p>
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#45332C] text-white font-bold flex items-center justify-center text-[10px] overflow-hidden shrink-0 border border-gray-200">
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt="Keanna Laine S. Dela Cruz"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                'K'
              )}
            </div>
            <span className="font-semibold text-gray-900">Keanna Laine S. Dela Cruz</span>
            <span className="text-gray-400">· Oct 3, 2026</span>
          </div>
          <p className="text-gray-800 leading-relaxed">
            "Training consistently at the DMMMSU Oval. Starting to hit consistent 13-minute pace per km! Feeling refreshed for the semester ahead. 🏃‍♀️👟"
          </p>
        </div>
      </div>
    );
  }

  return null;
};
