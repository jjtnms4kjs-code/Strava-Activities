import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  X,
  MapPin,
  Flame,
  Award,
  CheckCircle,
} from 'lucide-react';

interface NavbarProps {
  user?: UserProfile;
  onOpenAddActivity: () => void;
  onOpenHeatmap: () => void;
  onOpenTrialModal: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAddActivity,
  onOpenHeatmap,
  onOpenTrialModal,
  searchTerm,
  onSearchChange,
  activeNavTab,
  setActiveNavTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 select-none shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Left Side: Strava Logo & Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Strava Official Logo */}
          <button
            type="button"
            onClick={() => setActiveNavTab('feed')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            {/* Strava geometric double arrowhead icon */}
            <svg
              className="w-6 h-6 text-[#FC4C02]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-6.963 13.773h4.172" />
            </svg>
            <span
              className="text-xl sm:text-2xl font-black tracking-tight text-[#FC4C02] uppercase font-sans"
              aria-label="STRAVA"
            >
              STR
              <svg
                viewBox="0 0 87 86"
                className="inline-block h-[0.72em] w-auto fill-current align-baseline"
                aria-hidden="true"
              >
                <path d="M43.3 0L0 85.6h25.8l17.5-34.6 17.6 34.6h25.8L43.3 0z" />
              </svg>
              V
              <svg
                viewBox="0 0 87 86"
                className="inline-block h-[0.72em] w-auto fill-current align-baseline"
                aria-hidden="true"
              >
                <path d="M43.3 0L0 85.6h25.8l17.5-34.6 17.6 34.6h25.8L43.3 0z" />
              </svg>
            </span>
          </button>

          {/* Search Bar matching IMG_2666 */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search activities, athletes..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#FC4C02] focus:bg-white transition-all text-gray-800"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Nav Items matching IMG_2666 */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-700">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDashboardDropdown(!showDashboardDropdown)}
                className={`flex items-center gap-1 hover:text-[#FC4C02] transition-colors py-1 ${
                  activeNavTab === 'feed' ? 'text-[#FC4C02] font-semibold' : ''
                }`}
              >
                <span>Dashboard</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showDashboardDropdown && (
                <div
                  className="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 text-xs"
                  onClick={() => setShowDashboardDropdown(false)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('feed')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 hover:text-[#FC4C02]"
                  >
                    Activity Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('table')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 hover:text-[#FC4C02]"
                  >
                    My Activities (Table)
                  </button>
                  <button
                    type="button"
                    onClick={onOpenHeatmap}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 hover:text-[#FC4C02]"
                  >
                    My DMMMSU Heatmap
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveNavTab('table')}
              className={`hover:text-[#FC4C02] transition-colors flex items-center gap-1 ${
                activeNavTab === 'table' ? 'text-[#FC4C02] font-semibold' : ''
              }`}
            >
              <span>Training</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              type="button"
              onClick={onOpenHeatmap}
              className="hover:text-[#FC4C02] transition-colors flex items-center gap-1"
            >
              <span>Maps</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('challenges')}
              className={`hover:text-[#FC4C02] transition-colors ${
                activeNavTab === 'challenges' ? 'text-[#FC4C02] font-semibold' : ''
              }`}
            >
              Challenges
            </button>
          </nav>
        </div>

        {/* Right Side: Start Trial, Notifications, Avatar K, Plus Add */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Orange "Start Trial" Button matching reference IMG_2666 */}
          <button
            type="button"
            onClick={onOpenTrialModal}
            className="bg-[#FC4C02] hover:bg-[#E34000] text-white text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-1.5 rounded transition-colors shadow-xs"
          >
            Start Trial
          </button>

          {/* Notification Bell with Badge "1" matching IMG_2666 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
              className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#FC4C02] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  1
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-900">Notifications</span>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="py-2.5 space-y-2">
                  <div className="flex items-start gap-2.5 p-1.5 bg-orange-50/60 rounded">
                    <div className="w-7 h-7 rounded-full bg-[#E15241] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      C
                    </div>
                    <div>
                      <p className="text-gray-800 text-[11px] leading-snug">
                        <strong className="text-gray-900">Clarisse Santos</strong> commented on your activity{' '}
                        <strong className="text-[#FC4C02]">morning walk</strong>
                      </p>
                      <span className="text-[10px] text-gray-400">2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-1.5 hover:bg-gray-50 rounded">
                    <div className="w-7 h-7 rounded-full bg-[#FC4C02] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      👍
                    </div>
                    <div>
                      <p className="text-gray-800 text-[11px] leading-snug">
                        <strong className="text-gray-900">Mark B.</strong> gave you kudos on morning walk
                      </p>
                      <span className="text-[10px] text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar with dropdown chevron matching IMG_2666 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#45332C] text-white font-bold flex items-center justify-center text-xs sm:text-sm select-none overflow-hidden shrink-0 border border-gray-200 shadow-xs">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  user?.avatarInitial || 'K'
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-gray-500 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50 text-xs"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#45332C] text-white font-bold flex items-center justify-center text-xs select-none overflow-hidden shrink-0 border border-gray-200">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      'K'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{user?.name || 'Keanna Laine S. Dela Cruz'}</p>
                    <p className="text-[11px] text-gray-500 truncate">DMMMSU South La Union</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNavTab('feed')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                >
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={onOpenHeatmap}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Personal Heatmap
                </button>
                <button
                  type="button"
                  onClick={onOpenAddActivity}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[#FC4C02] font-medium"
                >
                  + Add Manual Activity
                </button>
              </div>
            )}
          </div>

          {/* Plus Button in Orange Circle (+) matching IMG_2666 */}
          <button
            type="button"
            onClick={onOpenAddActivity}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#FC4C02] text-[#FC4C02] hover:bg-[#FC4C02] hover:text-white flex items-center justify-center transition-colors"
            title="Upload or Record Activity"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
