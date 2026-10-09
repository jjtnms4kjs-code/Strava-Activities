import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { ActivityMap } from './ActivityMap';
import {
  X,
  Share2,
  ThumbsUp,
  MessageSquare,
  Clock,
  Footprints,
  Flame,
  Activity as HeartIcon,
  Download,
  MapPin,
  Calendar,
  Lock,
  Globe,
  Compass,
  TrendingUp,
} from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity | null;
  userAvatarUrl?: string;
  onClose: () => void;
  onToggleKudos: (activityId: string) => void;
  onAddComment: (activityId: string, commentText: string) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  userAvatarUrl,
  onClose,
  onToggleKudos,
  onAddComment,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'splits' | 'segments'>('analysis');
  const [commentInput, setCommentInput] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activity) return null;

  const hasUserKudoed =
    activity.kudos.includes('Keanna Laine S. Dela Cruz') ||
    activity.kudos.includes('Keanna') ||
    activity.kudos.includes('Keaanna Laine') ||
    activity.kudos.includes('You');

  const handleExportGPX = () => {
    const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Strava DMMMSU App">\n  <trk>\n    <name>${activity.title}</name>\n    <trkseg>\n`;
    const gpxPoints = activity.coordinates
      .map(([lat, lng]) => `      <trkpt lat="${lat}" lon="${lng}"><ele>12.0</ele></trkpt>`)
      .join('\n');
    const gpxFooter = `\n    </trkseg>\n  </trk>\n</gpx>`;
    const blob = new Blob([gpxHeader + gpxPoints + gpxFooter], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strava-dmmmsu-${activity.id}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(activity.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#45332C] text-white font-bold flex items-center justify-center text-sm overflow-hidden shrink-0 border border-gray-200 shadow-xs">
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
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">
                  {activity.title}
                </h2>
                {activity.no && (
                  <span className="text-[11px] font-mono bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded">
                    Session #{activity.no}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Keanna Laine S. Dela Cruz · {activity.date} at {activity.startTime} · {activity.locationName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportGPX}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 px-2.5 py-1.5 rounded hover:bg-gray-50 transition-colors"
              title="Download GPX GPS route file"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Export GPX'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Top Big Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 p-4 bg-[#F8F9FA] rounded-lg border border-gray-200/80">
            <div>
              <span className="text-[11px] font-medium text-gray-500 uppercase block">Distance</span>
              <span className="text-2xl font-bold text-gray-900">
                {activity.distanceKm.toFixed(2)} <span className="text-xs font-normal text-gray-500">km</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 uppercase block">Pace</span>
              <span className="text-2xl font-bold text-gray-900">
                {activity.avgPaceMinKm.split(' ')[0]} <span className="text-xs font-normal text-gray-500">/km</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 uppercase block">Duration</span>
              <span className="text-2xl font-bold text-gray-900">
                {activity.durationStr}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 uppercase block">Steps</span>
              <span className="text-2xl font-bold text-gray-900">
                {activity.steps.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 uppercase block">Calories</span>
              <span className="text-2xl font-bold text-gray-900">
                {activity.calories} <span className="text-xs font-normal text-gray-500">kcal</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-500 uppercase block">Elev Gain</span>
              <span className="text-2xl font-bold text-gray-900">
                {activity.elevationGainM} <span className="text-xs font-normal text-gray-500">m</span>
              </span>
            </div>
          </div>

          {/* Interactive Map with Player Controls & Campus Blueprint mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FC4C02]" />
                DMMMSU Oval Track Map & GPS Replay
              </h3>
              <span className="text-xs text-gray-500">
                1 Track Lap (400m DMMMSU Oval Loop)
              </span>
            </div>

            <ActivityMap
              coordinates={activity.coordinates}
              activityTitle={activity.title}
              distanceKm={activity.distanceKm}
              height="360px"
              isDetailedView={true}
            />
          </div>

          {/* Segment & Tabs Navigation */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('analysis')}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-[#FC4C02] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Telemetry & Pacing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('splits')}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'splits'
                    ? 'bg-[#FC4C02] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Lap Splits ({activity.splits.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('segments')}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'segments'
                    ? 'bg-[#FC4C02] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Campus Landmarks (DMMMSU SLUC)
              </button>
            </div>

            {/* Tab 1: Analysis */}
            {activeTab === 'analysis' && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#FC4C02]" /> Pace & Elevation Profile
                    </span>
                    <span className="text-[11px] text-gray-500">Elevation: flat campus track (~12m ASL)</span>
                  </div>

                  {/* Visual simulated pace graph */}
                  <div className="h-28 w-full flex items-end gap-1.5 pt-4 pb-2 border-b border-gray-300">
                    {activity.splits.map((s, idx) => {
                      const paceVal = parseFloat(s.paceStr.replace(':', '.'));
                      const heightPercent = Math.min(95, Math.max(30, 110 - (paceVal - 13) * 6));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                          <div
                            className="w-full bg-[#FC4C02]/80 hover:bg-[#FC4C02] rounded-t transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[10px] text-gray-500 font-mono">L{s.lap}</span>
                          {/* Tooltip on hover */}
                          <div className="absolute -top-7 hidden group-hover:block bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 font-mono">
                            {s.paceStr} · {s.timeStr}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 mt-2 font-mono">
                    <span>Start: Lap 1</span>
                    <span>Average: {activity.avgPaceMinKm}</span>
                    <span>Finish: Lap {activity.splits.length}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <HeartIcon className="w-3 h-3 text-red-500" /> Avg Heart Rate
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                      {activity.avgHeartRate || 104} <span className="text-xs font-normal text-gray-500">bpm</span>
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Footprints className="w-3 h-3 text-[#FC4C02]" /> Cadence
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                      {activity.cadenceSpm || 108} <span className="text-xs font-normal text-gray-500">spm</span>
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-blue-500" /> Weather Condition
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                      24°C <span className="text-xs font-normal text-gray-500">Clear Morning</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Lap Splits */}
            {activeTab === 'splits' && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                      <th className="py-2 px-3">Lap</th>
                      <th className="py-2 px-3">Distance</th>
                      <th className="py-2 px-3">Time</th>
                      <th className="py-2 px-3">Pace</th>
                      <th className="py-2 px-3 text-right">Elev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activity.splits.map((split) => (
                      <tr key={split.lap} className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-bold text-gray-900">Lap {split.lap}</td>
                        <td className="py-2 px-3">{split.distanceKm.toFixed(2)} km</td>
                        <td className="py-2 px-3">{split.timeStr}</td>
                        <td className="py-2 px-3 font-semibold text-[#FC4C02]">{split.paceStr}</td>
                        <td className="py-2 px-3 text-right text-gray-500">{split.elevGainM} m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Campus Landmarks */}
            {activeTab === 'segments' && (
              <div className="mt-4 space-y-2.5">
                <div className="p-3 bg-[#FAF9E6] rounded border border-[#E0DDB5] text-xs">
                  <h4 className="font-bold text-gray-900 mb-1">
                    Don Mariano Marcos Memorial State University - South La Union Campus
                  </h4>
                  <p className="text-gray-700">
                    All track laps were recorded on the athletics oval situated on Doña Toribia Provincial Road, Agoo, La Union.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                    <span className="font-semibold text-gray-800">🏃 Athletic Oval Track</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">Circumference ~400 meters, turf/clay surface</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                    <span className="font-semibold text-gray-800">💻 Computer Science MH</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">North-west perimeter near science buildings</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                    <span className="font-semibold text-gray-800">🏀 Basketball & Tennis Courts</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">Adjacent to western boundary of the oval</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                    <span className="font-semibold text-gray-800">🎓 EDUC & Admin Buildings</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">Eastern flank leading towards the roundabout</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Feedback Bar */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleKudos(activity.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  hasUserKudoed ? 'bg-[#FC4C02] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{activity.kudos.length} Kudos</span>
              </button>

              <span className="text-xs text-gray-500">
                {activity.kudos.slice(0, 3).join(', ')}
                {activity.kudos.length > 3 && ` +${activity.kudos.length - 3} more`}
              </span>
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="text-xs border border-gray-300 rounded px-3 py-1.5 w-60 focus:outline-none focus:border-[#FC4C02]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="bg-[#FC4C02] disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#d93f00]"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
