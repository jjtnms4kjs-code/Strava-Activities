/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Activity, UserProfile } from './types';
import { CURRENT_USER, INITIAL_ACTIVITIES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { ProfileHeader } from './components/ProfileHeader';
import { ActivityCard } from './components/ActivityCard';
import { ActivitiesTable } from './components/ActivitiesTable';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { RightSidebar } from './components/RightSidebar';
import { HeatmapModal } from './components/HeatmapModal';
import { AddActivityModal } from './components/AddActivityModal';
import { StartTrialModal } from './components/StartTrialModal';
import { ShareModal } from './components/ShareModal';
import { SubTabViews } from './components/SubTabViews';
import {
  LayoutList,
  Table as TableIcon,
  Flame,
  Filter,
  Plus,
  Compass,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // Navigation & Sub-tab state
  const [activeNavTab, setActiveNavTab] = useState<string>('feed');
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSportFilter, setSelectedSportFilter] = useState<'all' | 'walk'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'distance' | 'duration'>('newest');

  // Modals state
  const [isHeatmapOpen, setIsHeatmapOpen] = useState<boolean>(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState<boolean>(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Kudos for an activity
  const handleToggleKudos = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        const hasKudoed = act.kudos.includes('Keanna Laine S. Dela Cruz') || act.kudos.includes('You');
        const updatedKudos = hasKudoed
          ? act.kudos.filter((k) => k !== 'Keanna Laine S. Dela Cruz' && k !== 'You')
          : [...act.kudos, 'You'];
        return {
          ...act,
          kudos: updatedKudos,
        };
      })
    );
    showToast('👍 Kudos updated!');
  };

  // Add Comment to an activity
  const handleAddComment = (activityId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Keanna Laine S. Dela Cruz',
      avatarText: 'K',
      avatarBg: '#45332C',
      avatarUrl: user.avatarUrl,
      text: commentText,
      timestamp: 'Just now',
    };

    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        return {
          ...act,
          comments: [...act.comments, newComment],
        };
      })
    );
    showToast('💬 Comment posted!');
  };

  // Toggle Privacy
  const handleTogglePrivacy = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        const nextPrivacy: 'only_you' | 'followers' | 'everyone' =
          act.privacy === 'only_you'
            ? 'followers'
            : act.privacy === 'followers'
            ? 'everyone'
            : 'only_you';
        return {
          ...act,
          privacy: nextPrivacy,
        };
      })
    );
    showToast('🔒 Privacy setting updated');
  };

  // Add a new activity
  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
    setUser((prev) => ({
      ...prev,
      last4WeeksActivitiesCount: prev.last4WeeksActivitiesCount + 1,
    }));
    showToast('🎉 Activity logged at DMMMSU Oval!');
  };

  // Refresh stats handler
  const handleRefreshStats = () => {
    showToast('⚡ Stats refreshed from Strava GPS database!');
  };

  // Filtered & sorted activities
  const filteredActivities = useMemo(() => {
    return activities
      .filter((act) => {
        const matchesSearch =
          act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          act.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
          act.locationName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = selectedSportFilter === 'all' || act.sport === selectedSportFilter;
        return matchesSearch && matchesSport;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
        }
        if (sortOrder === 'distance') {
          return b.distanceKm - a.distanceKm;
        }
        if (sortOrder === 'duration') {
          return b.durationSeconds - a.durationSeconds;
        }
        return 0;
      });
  }, [activities, searchTerm, selectedSportFilter, sortOrder]);

  const totalKm = activities.reduce((sum, a) => sum + a.distanceKm, 0);

  return (
    <div className="min-h-screen bg-[#F0F0F2] text-[#242428] font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#242428] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-gray-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-[#FC4C02]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Strava Top Navbar */}
      <Navbar
        user={user}
        onOpenAddActivity={() => setIsAddActivityOpen(true)}
        onOpenHeatmap={() => setIsHeatmapOpen(true)}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeNavTab={activeNavTab}
        setActiveNavTab={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'table') setViewMode('table');
          if (tab === 'feed') setViewMode('cards');
        }}
      />

      {/* Profile Header matching IMG_2666 */}
      <ProfileHeader
        user={user}
        totalActivitiesCount={activities.length}
        totalDurationStr="2h 36m"
        onOpenHeatmap={() => setIsHeatmapOpen(true)}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* Main Page Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Render other sub-tabs if selected */}
        {activeSubTab !== 'overview' ? (
          <SubTabViews
            activeTab={activeSubTab}
            activities={activities}
            userAvatarUrl={user.avatarUrl}
            onSelectActivity={(act) => setSelectedActivity(act)}
          />
        ) : (
          /* Overview: Feed / Table on Left, Strava Stats on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Center Column (8 cols): 6 Activity Cards / Table */}
            <section className="lg:col-span-8">
              {/* Feed Control Bar: Toggle Between Social Feed Cards and Reference Table */}
              <div className="bg-white rounded-lg border border-gray-200/90 p-3 sm:p-4 mb-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-md">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      viewMode === 'cards'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5 text-[#FC4C02]" />
                    <span>Social Feed ({filteredActivities.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5 text-[#FC4C02]" />
                    <span>Reference Table (IMG_2665)</span>
                  </button>
                </div>

                {/* Sort & Filter controls */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Sort:</span>
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#FC4C02] cursor-pointer"
                  >
                    <option value="newest">Most Recent</option>
                    <option value="distance">Longest Distance</option>
                    <option value="duration">Longest Duration</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsHeatmapOpen(true)}
                    className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#FC4C02] hover:text-[#d93f00] bg-orange-50 px-2.5 py-1 rounded border border-orange-200"
                  >
                    <Flame className="w-3.5 h-3.5 fill-[#FC4C02]" />
                    <span>Heatmap</span>
                  </button>
                </div>
              </div>

              {/* View 1: 6 Clickable Strava Activity Cards with Integrated Maps */}
              {viewMode === 'cards' && (
                <div className="space-y-4">
                  {filteredActivities.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                      <p className="text-gray-500 text-sm">No activities matched your search.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSportFilter('all');
                        }}
                        className="mt-2 text-xs text-[#FC4C02] font-semibold hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    filteredActivities.map((act) => (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        currentUserInitial="K"
                        currentUserAvatarUrl={user.avatarUrl}
                        onSelectActivity={(activity) => setSelectedActivity(activity)}
                        onToggleKudos={handleToggleKudos}
                        onAddComment={handleAddComment}
                        onTogglePrivacy={handleTogglePrivacy}
                      />
                    ))
                  )}
                </div>
              )}

              {/* View 2: The Exact Activities Table from Reference IMG_2665 */}
              {viewMode === 'table' && (
                <div className="space-y-4">
                  <ActivitiesTable
                    activities={activities}
                    onSelectActivity={(activity) => setSelectedActivity(activity)}
                  />

                  {/* Summary Card below table */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-xs text-gray-600 flex items-center justify-between">
                    <div>
                      <strong className="text-gray-900 block">DMMMSU Oval Walk Training Log</strong>
                      <span>All 6 sessions tracked at Don Mariano Marcos Memorial State University, South La Union Campus.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode('cards')}
                      className="text-[#FC4C02] hover:underline font-semibold"
                    >
                      Switch to Map Cards →
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Right Sidebar (4 cols): Stats, Clubs, Social, Segments */}
            <section className="lg:col-span-4">
              <RightSidebar
                user={user}
                activities={activities}
                onRefreshStats={handleRefreshStats}
                onOpenShareModal={() => setIsShareModalOpen(true)}
                onOpenHeatmap={() => setIsHeatmapOpen(true)}
              />
            </section>
          </div>
        )}
      </main>

      {/* Activity Detail Modal with full telemetry, lap splits, replay scrubber */}
      <ActivityDetailModal
        activity={selectedActivity}
        userAvatarUrl={user.avatarUrl}
        onClose={() => setSelectedActivity(null)}
        onToggleKudos={handleToggleKudos}
        onAddComment={handleAddComment}
      />

      {/* Heatmap Modal with glowing track visualization */}
      <HeatmapModal
        isOpen={isHeatmapOpen}
        onClose={() => setIsHeatmapOpen(false)}
        activities={activities}
      />

      {/* Add Manual Activity Modal */}
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        onAddActivity={handleAddActivity}
        nextActivityNumber={activities.length + 1}
      />

      {/* Strava 30-Day Free Trial Modal */}
      <StartTrialModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
      />

      {/* Share Activity / Embed Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
