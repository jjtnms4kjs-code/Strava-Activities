import React, { useState } from 'react';
import { Activity, UserProfile } from '../types';
import {
  Users,
  Share2,
  RefreshCw,
  Trophy,
  Compass,
  Check,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface RightSidebarProps {
  user: UserProfile;
  activities: Activity[];
  onRefreshStats: () => void;
  onOpenShareModal: () => void;
  onOpenHeatmap: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  user,
  activities,
  onRefreshStats,
  onOpenShareModal,
  onOpenHeatmap,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'2026' | 'all-time'>('2026');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalKm = activities.reduce((sum, a) => sum + a.distanceKm, 0);
  const totalSeconds = activities.reduce((sum, a) => sum + a.durationSeconds, 0);
  const totalElev = activities.reduce((sum, a) => sum + a.elevationGainM, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const timeFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${totalSeconds % 60}s`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshStats();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <aside className="space-y-6 select-none">
      {/* 2026 & All-Time Stats Widget matching IMG_2667 */}
      <div className="bg-white rounded-lg border border-gray-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="font-bold text-gray-900 bg-transparent text-sm focus:outline-none cursor-pointer hover:text-[#FC4C02]"
            >
              <option value="2026">2026</option>
              <option value="all-time">All-Time</option>
            </select>
          </div>
          <span className="text-xs text-gray-400 font-mono">DMMMSU Oval</span>
        </div>

        {/* Stats Table matching IMG_2667 */}
        <div className="divide-y divide-gray-100 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500">Activities</span>
            <span className="font-semibold text-gray-900">{activities.length}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500">Distance</span>
            <span className="font-semibold text-gray-900">{totalKm.toFixed(2)} km</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-semibold text-gray-900">{timeFormatted}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500">Elev Gain</span>
            <span className="font-semibold text-gray-900">{totalElev} m</span>
          </div>
        </div>

        {/* "Refresh Stats" button matching IMG_2667 */}
        <button
          type="button"
          onClick={handleRefresh}
          className="mt-3 w-full text-center text-xs font-semibold py-2 px-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FC4C02]' : 'text-gray-500'}`} />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* Clubs Widget matching IMG_2666 */}
      <div className="bg-white rounded-lg border border-gray-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm">Clubs</h2>
          <span className="text-xs text-[#FC4C02] font-semibold cursor-pointer hover:underline">
            Explore
          </span>
        </div>
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shrink-0">
              SLUC
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">
                DMMMSU Striders Club
              </p>
              <p className="text-[11px] text-gray-500">142 Members · Agoo, La Union</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#FC4C02] text-white flex items-center justify-center font-bold text-xs shrink-0">
              LUR
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">
                La Union Walking & Running
              </p>
              <p className="text-[11px] text-gray-500">680 Members · Region 1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Stats Widget matching IMG_2666 */}
      <div className="bg-white rounded-lg border border-gray-200/90 p-4 sm:p-5 shadow-2xs">
        <h2 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
          Social Stats
        </h2>
        <div className="grid grid-cols-2 gap-4 pt-3 text-center">
          <div>
            <span className="text-xs text-gray-500 block">Following</span>
            <span className="text-xl font-bold text-gray-900">{user.followingCount}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Followers</span>
            <span className="text-xl font-bold text-gray-900">{user.followersCount}</span>
          </div>
        </div>
      </div>

      {/* Campus Segments at DMMMSU SLUC */}
      <div className="bg-white rounded-lg border border-gray-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            Segments at DMMMSU
          </h2>
        </div>
        <div className="mt-3 space-y-2.5 text-xs">
          <div className="p-2 rounded bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">DMMMSU Oval Standard 400m</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                CR 54s
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Keanna best: 5m 22s (Walking pace)</p>
          </div>
          <div className="p-2 rounded bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">CS Building to Oval Straight</span>
              <span className="text-[10px] text-gray-500 font-mono">0.24 km</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Campus entrance route</p>
          </div>
        </div>
      </div>

      {/* Share Your Activities widget matching IMG_2667 */}
      <div className="bg-white rounded-lg border border-gray-200/90 p-4 sm:p-5 shadow-2xs">
        <h2 className="font-bold text-gray-900 text-sm">Share Your Activities</h2>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Embed a Strava Widget on your blog or campus portal.
        </p>
        <button
          type="button"
          onClick={onOpenShareModal}
          className="mt-3 w-full text-center text-xs font-semibold py-2 px-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Share Your Activities
        </button>
      </div>
    </aside>
  );
};
