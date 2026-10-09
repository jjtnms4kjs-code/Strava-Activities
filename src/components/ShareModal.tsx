import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;
  const embedCode = `<iframe height='454' width='300' frameborder='0' allowtransparency='true' scrolling='no' src='${shareUrl}'></iframe>`;

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-sm font-bold text-gray-900">
            Share Your Strava Activities
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Direct Activity Link</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-gray-600 font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={() => handleCopy(shareUrl)}
                className="bg-[#FC4C02] text-white px-3 py-1.5 rounded font-semibold hover:bg-[#d93f00] shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Blog / Webpage Embed Widget (HTML)
            </label>
            <textarea
              readOnly
              rows={3}
              value={embedCode}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-gray-600 font-mono text-[11px]"
            />
            <button
              type="button"
              onClick={() => handleCopy(embedCode)}
              className="mt-1.5 text-[#FC4C02] hover:underline font-semibold flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy Embed Snippet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
