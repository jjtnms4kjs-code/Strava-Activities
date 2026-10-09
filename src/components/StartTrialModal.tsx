import React from 'react';
import { X, Check, ShieldCheck, Zap } from 'lucide-react';

interface StartTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartTrialModal: React.FC<StartTrialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#FC4C02] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-block bg-black/20 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2">
            Strava Subscription
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Start Your 30-Day Free Trial
          </h2>
          <p className="text-xs text-white/90 mt-1">
            Unlock advanced personal heatmaps, live route tracking, segment competition, and deeper fitness telemetry.
          </p>
        </div>

        <div className="p-6 space-y-3.5 text-xs text-gray-700">
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#FC4C02] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block">Personal Heatmaps at DMMMSU</strong>
              <span>Visualize everywhere you've walked or run on campus with custom 3D glows.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#FC4C02] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block">Segment Leaderboards & Local Legend</strong>
              <span>Compete on the 400m DMMMSU Oval track and earn crowns.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#FC4C02] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 block">Advanced Training & Cadence Analysis</strong>
              <span>Detailed lap splits, heart-rate zones, and weekly fatigue tracking.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#FC4C02] hover:bg-[#E34000] text-white py-2.5 rounded font-bold transition-colors text-center text-sm shadow-xs"
            >
              Activate Free Trial
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              No commitment. Cancel anytime before trial ends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
