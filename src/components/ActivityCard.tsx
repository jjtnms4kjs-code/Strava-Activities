import React, { useState } from 'react';
import { Activity, Comment } from '../types';
import { ActivityMap } from './ActivityMap';
import {
  ThumbsUp,
  MessageSquare,
  Lock,
  Globe,
  Users,
  Share2,
  Footprints,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  currentUserInitial?: string;
  currentUserAvatarUrl?: string;
  onSelectActivity: (activity: Activity) => void;
  onToggleKudos: (activityId: string) => void;
  onAddComment: (activityId: string, commentText: string) => void;
  onTogglePrivacy: (activityId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  currentUserInitial = 'K',
  currentUserAvatarUrl,
  onSelectActivity,
  onToggleKudos,
  onAddComment,
  onTogglePrivacy,
}) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [showKudosList, setShowKudosList] = useState<boolean>(false);
  const [justKudoed, setJustKudoed] = useState<boolean>(false);

  const hasUserKudoed =
    activity.kudos.includes('Keanna Laine S. Dela Cruz') ||
    activity.kudos.includes('Keanna') ||
    activity.kudos.includes('Keaanna Laine') ||
    activity.kudos.includes('You');

  const handleKudosClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleKudos(activity.id);
    setJustKudoed(true);
    setTimeout(() => setJustKudoed(false), 600);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(activity.id, newCommentText.trim());
    setNewCommentText('');
    setShowComments(true);
  };

  return (
    <article className="bg-white rounded-lg border border-gray-200/90 shadow-xs mb-4 overflow-hidden transition-shadow hover:shadow-md">
      {/* Card Header: User Avatar & Activity Timestamp */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar matching Strava circular avatar */}
            <div className="w-10 h-10 rounded-full bg-[#45332C] text-white font-bold flex items-center justify-center text-lg select-none shadow-xs overflow-hidden shrink-0 border border-gray-200">
              {currentUserAvatarUrl ? (
                <img
                  src={currentUserAvatarUrl}
                  alt="Keanna Laine S. Dela Cruz"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                currentUserInitial
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-[#FC4C02] cursor-pointer">
                Keanna Laine S. Dela Cruz
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {activity.date} at {activity.startTime} · {activity.device}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Activity number badge if in reference table */}
            {activity.no && (
              <span className="text-[11px] font-mono px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                #{activity.no}
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelectActivity(activity)}
              className="text-xs text-gray-400 hover:text-[#FC4C02] p-1 flex items-center"
              title="View full activity details"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activity Sport Icon & Title matching IMG_2667 */}
        <div className="mt-3 flex items-baseline gap-2">
          {/* Running shoe / walking shoe icon */}
          <span className="text-gray-700 text-base" title="Walk">
            👟
          </span>
          <button
            type="button"
            onClick={() => onSelectActivity(activity)}
            className="text-lg font-bold text-gray-900 hover:text-[#FC4C02] text-left transition-colors cursor-pointer"
          >
            {activity.title}
          </button>
        </div>

        {/* Stats Columns matching reference photo IMG_2667: Distance, Time, Elev Gain */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4 pt-2 border-t border-gray-100">
          <div>
            <span className="block text-[11px] text-gray-500 uppercase font-medium">Distance</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {activity.distanceKm.toFixed(2)} <span className="text-xs font-normal text-gray-600">km</span>
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-gray-500 uppercase font-medium">Time</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {activity.durationStr}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-gray-500 uppercase font-medium">Elev Gain</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {activity.elevationGainM} <span className="text-xs font-normal text-gray-600">m</span>
            </span>
          </div>

          <div className="hidden sm:block">
            <span className="block text-[11px] text-gray-500 uppercase font-medium flex items-center gap-1">
              <Footprints className="w-3 h-3 text-[#FC4C02]" /> Steps
            </span>
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {activity.steps.toLocaleString()}
            </span>
          </div>

          <div className="hidden sm:block">
            <span className="block text-[11px] text-gray-500 uppercase font-medium">Avg Pace</span>
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {activity.avgPaceMinKm}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="px-4 sm:px-5">
        <ActivityMap
          coordinates={activity.coordinates}
          activityTitle={activity.title}
          distanceKm={activity.distanceKm}
          height="280px"
          onExpand={() => onSelectActivity(activity)}
        />
      </div>

      {/* Privacy Notice Strip matching IMG_2667 */}
      <div className="px-4 sm:px-5 pt-3">
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50/70 p-2 rounded border border-gray-100">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            {activity.privacy === 'only_you' && <Lock className="w-3.5 h-3.5 text-gray-600 shrink-0" />}
            {activity.privacy === 'followers' && <Users className="w-3.5 h-3.5 text-[#FC4C02] shrink-0" />}
            {activity.privacy === 'everyone' && <Globe className="w-3.5 h-3.5 text-green-600 shrink-0" />}
            <span>
              {activity.privacy === 'only_you'
                ? "Only you can view this activity. It won't appear on segment leaderboards and may not count toward some challenges."
                : activity.privacy === 'followers'
                ? 'Visible to your followers on Strava.'
                : 'Public activity visible to everyone on Strava.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onTogglePrivacy(activity.id)}
            className="text-[11px] text-[#FC4C02] hover:underline font-medium shrink-0 ml-2"
          >
            Change
          </button>
        </div>
      </div>

      {/* Interaction Bar: Strava Kudos & Comments */}
      <div className="p-4 sm:p-5 pt-3">
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            {/* Kudos Button */}
            <button
              type="button"
              onClick={handleKudosClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                hasUserKudoed
                  ? 'bg-[#FC4C02] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${justKudoed ? 'scale-110' : 'scale-100'}`}
              title="Give Kudos!"
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 ${
                  hasUserKudoed ? 'fill-white text-white' : 'text-gray-700'
                }`}
              />
              <span>{activity.kudos.length}</span>
            </button>

            {/* Comments Toggle */}
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-gray-600" />
              <span>{activity.comments.length}</span>
            </button>

            {/* Who gave kudos popup trigger */}
            {activity.kudos.length > 0 && (
              <button
                type="button"
                onClick={() => setShowKudosList(!showKudosList)}
                className="text-[11px] text-gray-500 hover:text-gray-800 hover:underline hidden sm:inline"
              >
                {activity.kudos.slice(0, 2).join(', ')}
                {activity.kudos.length > 2 && ` and ${activity.kudos.length - 2} others`}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectActivity(activity)}
              className="text-xs font-semibold text-[#FC4C02] hover:text-[#d93f00] flex items-center gap-0.5"
            >
              View Analysis
            </button>
          </div>
        </div>

        {/* Kudos Athletes Panel */}
        {showKudosList && (
          <div className="mt-2.5 p-2.5 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200">
            <p className="font-semibold text-gray-900 mb-1">Athletes who gave kudos:</p>
            <div className="flex flex-wrap gap-1.5">
              {activity.kudos.map((name, i) => (
                <span
                  key={i}
                  className="bg-white px-2 py-0.5 rounded border border-gray-200 text-xs font-medium text-gray-700"
                >
                  👍 {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Comments Drawer */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {activity.comments.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No comments yet. Be the first to congratulate Keanna!</p>
              ) : (
                activity.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                    <div
                      className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ backgroundColor: comment.avatarBg || '#607D8B' }}
                    >
                      {comment.avatarUrl ? (
                        <img
                          src={comment.avatarUrl}
                          alt={comment.author}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        comment.avatarText
                      )}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-md p-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700 mt-0.5 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a comment for Keanna..."
                className="flex-1 text-xs border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#FC4C02] focus:ring-1 focus:ring-[#FC4C02]"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="bg-[#FC4C02] disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#d93f00] transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};
