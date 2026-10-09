import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MapPin, X, Flame, ChevronDown, Check } from 'lucide-react';

interface ProfileHeaderProps {
  user: UserProfile;
  totalActivitiesCount: number;
  totalDurationStr: string;
  onOpenHeatmap: () => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  totalActivitiesCount,
  totalDurationStr,
  onOpenHeatmap,
  activeSubTab,
  setActiveSubTab,
}) => {
  const [showHeatmapBanner, setShowHeatmapBanner] = useState(true);
  const [selectedSport, setSelectedSport] = useState<'walk' | 'bike' | 'swim' | 'workout'>('walk');

  // Matrix of 4 weeks (Mon-Sun), with workout dots
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const matrix = [
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, true, false], // Saturday walk
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        {/* Main Profile Info & Stats Row matching IMG_2666 */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6">
          {/* Left: Big Avatar and Name & Location */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Profile Picture matching uploaded photo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#45332C] text-white font-bold flex items-center justify-center text-5xl sm:text-6xl select-none shadow-md shrink-0 border-4 border-white overflow-hidden relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/avatar.png')) {
                      target.src = '/avatar.png';
                    }
                  }}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                user.avatarInitial
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {user.name}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1.5">
                <span className="text-gray-400">◎</span>
                <span>{user.location}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Student · {user.institution}
              </p>
            </div>
          </div>

          {/* Right: Last 4 Weeks Stat Widget & Calendar Matrix matching IMG_2666 */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
            {/* Stat: Last 4 Weeks */}
            <div>
              <span className="text-xs text-gray-500 font-medium block">Last 4 Weeks</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {user.last4WeeksActivitiesCount}
              </div>
              <span className="text-[11px] text-gray-500">Total Activities</span>
            </div>

            {/* Calendar Dot Matrix (M T W T F S S) */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-1.5">
                {weekDays.map((day, idx) => (
                  <span
                    key={idx}
                    className="w-3 text-center text-[10px] font-medium text-gray-500"
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5">
                {matrix.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-2">
                    {row.map((active, cIdx) => (
                      <span
                        key={cIdx}
                        className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${
                          active
                            ? 'bg-black text-white font-bold'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Sport Selector Icons & Duration Bar matching IMG_2666 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSport('walk')}
                  className={`p-1 rounded transition-colors relative ${
                    selectedSport === 'walk' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Walk / Run"
                >
                  <span className="text-lg">👟</span>
                  {selectedSport === 'walk' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSport('bike')}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
                  title="Ride"
                >
                  <span className="text-lg">🚲</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSport('swim')}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
                  title="Swim"
                >
                  <span className="text-lg">🏊</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSport('workout')}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
                  title="Workout"
                >
                  <span className="text-lg">⚡</span>
                </button>
              </div>

              {/* Strava duration progress bar */}
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 w-1/4 rounded-full" />
                </div>
                <span className="text-xs text-gray-600 font-mono">0h 1m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Heatmaps Banner matching reference photo IMG_2666 */}
        {showHeatmapBanner && (
          <div className="mb-4 bg-[#F7F8FC] border border-[#E5E9F5] rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 relative overflow-hidden">
            <div className="max-w-xl">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                Personal Heatmaps
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                Create and share an interactive visualization of all the places you've ever run or ridden.
              </p>
              <button
                type="button"
                onClick={onOpenHeatmap}
                className="mt-2.5 text-xs sm:text-sm font-semibold text-[#185ADB] hover:text-[#0C3BAA] hover:underline flex items-center gap-1"
              >
                Create Your Heatmap →
              </button>
            </div>

            {/* Heatmap Graphic Illustration */}
            <div
              onClick={onOpenHeatmap}
              className="hidden sm:flex w-24 h-24 rounded-lg bg-white border border-gray-200 shadow-xs p-2 items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
              title="View Heatmap"
            >
              <svg viewBox="0 0 80 80" className="w-full h-full">
                {/* Grid lines */}
                <path d="M 0,20 L 80,20 M 0,40 L 80,40 M 0,60 L 80,60" stroke="#E2E8F0" strokeWidth="3" />
                <path d="M 20,0 L 20,80 M 40,0 L 40,80 M 60,0 L 60,80" stroke="#E2E8F0" strokeWidth="3" />
                {/* Glowing red & cyan route lines matching IMG_2666 icon */}
                <path
                  d="M 10,70 L 30,30 L 50,45 L 70,10"
                  stroke="#FC4C02"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 15,20 L 35,50 L 65,55"
                  stroke="#0284C7"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setShowHeatmapBanner(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sub-Tabs Row matching IMG_2666 */}
        <div className="flex items-center gap-1 sm:gap-6 border-b border-gray-200 overflow-x-auto no-scrollbar text-xs sm:text-sm">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'trophy', label: 'Trophy Case' },
            { id: 'following', label: 'Following' },
            { id: 'qoms', label: 'QOMs / CRs / Top 10s' },
            { id: 'local_legends', label: 'Local Legends' },
            { id: 'posts', label: 'Posts' },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-3 px-2 sm:px-3 font-semibold whitespace-nowrap transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-gray-900 border-b-2 border-[#FC4C02]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
