import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { DMMMSU_OVAL_CENTER } from '../data/mockData';

interface ActivityMapProps {
  coordinates: [number, number][];
  activityTitle: string;
  distanceKm: number;
  height?: string;
  isDetailedView?: boolean;
  onExpand?: () => void;
}

export const ActivityMap: React.FC<ActivityMapProps> = ({
  coordinates,
  activityTitle,
  distanceKm,
  height = '320px',
  isDetailedView = false,
  onExpand,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const animatedMarkerRef = useRef<L.CircleMarker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'osm' | 'blueprint' | 'satellite'>('osm');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Exactly at DMMMSU SLUC Oval in Agoo, La Union
      const center = DMMMSU_OVAL_CENTER;
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: 17,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: isDetailedView,
      });

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenMapTiles © OpenStreetMap',
      });
      osmLayer.addTo(map);
      tileLayerRef.current = osmLayer;

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Handle tile layer changes
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapStyle === 'satellite') {
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '© Esri, Maxar, Earthstar Geographics',
        }
      );
      satLayer.addTo(map);
      tileLayerRef.current = satLayer;
    } else {
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenMapTiles © OpenStreetMap',
      });
      osmLayer.addTo(map);
      tileLayerRef.current = osmLayer;
    }

    // Clear previous polyline and markers
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }
    if (animatedMarkerRef.current) {
      map.removeLayer(animatedMarkerRef.current);
    }

    if (coordinates.length > 0) {
      // Signature Strava Orange route line: #FC4C02 showing realistic human walking trace
      const polyline = L.polyline(coordinates, {
        color: '#FC4C02',
        weight: isDetailedView ? 4.5 : 3.8,
        opacity: 0.92,
        lineJoin: 'round',
        lineCap: 'round',
        smoothFactor: 0.8,
      }).addTo(map);

      polylineRef.current = polyline;

      // Start pin (green circle)
      const startMarker = L.circleMarker(coordinates[0], {
        radius: 6,
        fillColor: '#2E7D32',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      }).addTo(map);
      startMarker.bindTooltip('Start', { permanent: false, direction: 'top' });

      // End pin (orange with white center)
      const lastCoord = coordinates[coordinates.length - 1];
      const endMarker = L.circleMarker(lastCoord, {
        radius: 6,
        fillColor: '#FC4C02',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      }).addTo(map);
      endMarker.bindTooltip('Finish', { permanent: false, direction: 'top' });

      // Animated current position marker
      const movingMarker = L.circleMarker(coordinates[0], {
        radius: 7,
        fillColor: '#FC4C02',
        color: '#ffffff',
        weight: 3,
        fillOpacity: 1,
      }).addTo(map);
      animatedMarkerRef.current = movingMarker;

      // Fit bounds to the DMMMSU Oval track
      const bounds = polyline.getBounds();
      map.fitBounds(bounds, { padding: [22, 22] });
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => clearTimeout(timer);
  }, [coordinates, mapStyle, isDetailedView]);

  // Animation scrubber loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let currentIdx = progressIndex;
    const speed = Math.max(1, Math.floor(coordinates.length / 200));

    const step = () => {
      currentIdx = (currentIdx + speed) % coordinates.length;
      setProgressIndex(currentIdx);

      if (animatedMarkerRef.current && coordinates[currentIdx]) {
        animatedMarkerRef.current.setLatLng(coordinates[currentIdx]);
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, coordinates, progressIndex]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const resetPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setProgressIndex(0);
    if (animatedMarkerRef.current && coordinates[0]) {
      animatedMarkerRef.current.setLatLng(coordinates[0]);
    }
  };

  // Convert GPS coordinates into SVG path points projected onto the campus layout matching IMG_2668
  const svgPathD = useMemo(() => {
    if (!coordinates || coordinates.length === 0) return '';
    const centerLat = DMMMSU_OVAL_CENTER[0];
    const centerLng = DMMMSU_OVAL_CENTER[1];

    // Project coordinates onto SVG viewBox (0 0 600 520)
    // Oval center in SVG is around x: 375, y: 260
    return coordinates
      .map(([lat, lng], idx) => {
        const dLat = lat - centerLat;
        const dLng = lng - centerLng;
        // Scales calibrated to the DMMMSU Oval track geometry
        const x = 375 + (dLng / 0.00045) * 115;
        const y = 260 - (dLat / 0.00086) * 165;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [coordinates]);

  // Current position on SVG during playback
  const currentSvgPos = useMemo(() => {
    if (!coordinates || coordinates.length === 0) return { x: 375, y: 260 };
    const pt = coordinates[progressIndex] || coordinates[0];
    const dLat = pt[0] - DMMMSU_OVAL_CENTER[0];
    const dLng = pt[1] - DMMMSU_OVAL_CENTER[1];
    return {
      x: 375 + (dLng / 0.00045) * 115,
      y: 260 - (dLat / 0.00086) * 165,
    };
  }, [coordinates, progressIndex]);

  return (
    <div className="relative w-full overflow-hidden rounded bg-[#eaeae6] select-none" style={{ height }}>
      {/* Campus Blueprint SVG Mode (Faithful reproduction of IMG_2668.jpeg) */}
      {mapStyle === 'blueprint' ? (
        <div className="w-full h-full relative bg-[#FBF9E7] p-1 overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 600 520"
            className="w-full h-full object-contain filter drop-shadow-2xs"
          >
            {/* Campus Background Field */}
            <rect width="600" height="520" fill="#FAF8E5" />

            {/* Perimeter Roads */}
            {/* Doña Toribia Provincial Road at south */}
            <path
              d="M 0,470 L 460,425 L 600,410"
              stroke="#FFFFFF"
              strokeWidth="24"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 0,470 L 460,425 L 600,410"
              stroke="#E0DDCF"
              strokeWidth="26"
              fill="none"
              strokeLinecap="round"
              className="opacity-40"
            />

            {/* Roadway leading north past courts & Grandstand */}
            <path
              d="M 120,460 C 80,440 20,330 30,220 C 40,110 90,80 180,75 L 360,75"
              stroke="#FFFFFF"
              strokeWidth="16"
              fill="none"
            />

            {/* Roundabout at bottom right near entrance */}
            <circle cx="485" cy="425" r="19" fill="#FFFFFF" stroke="#D7D3C5" strokeWidth="2" />
            <circle cx="485" cy="425" r="9" fill="#FAF8E5" />

            {/* West Campus Buildings from IMG_2668 */}
            {/* DMMMSU elem. buildings */}
            <rect x="50" y="85" width="46" height="42" fill="#D5CCC6" rx="1.5" />
            <rect x="105" y="80" width="38" height="32" fill="#D5CCC6" rx="1.5" />
            <rect x="65" y="145" width="55" height="45" fill="#D5CCC6" rx="1.5" />
            <rect x="65" y="195" width="55" height="65" fill="#D5CCC6" rx="1.5" />
            <rect x="100" y="240" width="45" height="35" fill="#D5CCC6" rx="1.5" />
            <text x="92" y="170" fontSize="8" fontWeight="600" fill="#5D4037" textAnchor="middle">
              DMMMSU
            </text>
            <text x="92" y="180" fontSize="7" fill="#5D4037" textAnchor="middle">
              elem.
            </text>

            {/* Grandstand Building (distinct angled grey polygon from IMG_2668) */}
            <polygon
              points="160,115 190,115 210,145 228,245 238,320 245,395 195,395 178,330 162,240"
              fill="#D2C8C2"
              stroke="#BCAFA8"
              strokeWidth="1"
            />
            <text x="195" y="255" fontSize="10" fontWeight="bold" fill="#4E342E" textAnchor="middle">
              Grandstand
            </text>

            {/* Restroom / Toilet facilities icons near Grandstand */}
            <g transform="translate(155, 385)">
              <rect width="18" height="20" fill="#D2C8C2" rx="2" stroke="#BCAFA8" strokeWidth="0.5" />
              <text x="9" y="14" fontSize="9" textAnchor="middle">🚻</text>
            </g>
            <g transform="translate(125, 255)">
              <rect width="18" height="20" fill="#D2C8C2" rx="2" stroke="#BCAFA8" strokeWidth="0.5" />
              <text x="9" y="14" fontSize="9" textAnchor="middle">🚻</text>
            </g>

            {/* Three Vertical Basketball Courts (bright mint green from IMG_2668) */}
            <rect x="180" y="85" width="28" height="20" fill="#6EE7B7" rx="1.5" />
            <rect x="190" y="125" width="18" height="15" fill="#6EE7B7" rx="1.5" />
            <rect x="185" y="150" width="58" height="90" fill="#6EE7B7" rx="2" />
            <text x="214" y="195" fontSize="8" fontWeight="600" fill="#065F46" textAnchor="middle">
              Basketball
            </text>
            <text x="214" y="206" fontSize="7" fill="#065F46" textAnchor="middle">
              Court
            </text>

            <rect x="208" y="248" width="55" height="88" fill="#6EE7B7" rx="2" />
            <text x="235" y="292" fontSize="8" fontWeight="600" fill="#065F46" textAnchor="middle">
              Basketball
            </text>
            <text x="235" y="303" fontSize="7" fill="#065F46" textAnchor="middle">
              Court
            </text>

            <rect x="228" y="342" width="40" height="68" fill="#6EE7B7" rx="2" />

            {/* Three Horizontal Tennis Courts at the south (IMG_2668) */}
            <rect x="145" y="440" width="26" height="55" fill="#6EE7B7" rx="1.5" />
            <rect x="175" y="435" width="36" height="60" fill="#6EE7B7" rx="2" />
            <text x="193" y="468" fontSize="7" fontWeight="600" fill="#065F46" textAnchor="middle">
              Tennis
            </text>
            <text x="193" y="478" fontSize="6" fill="#065F46" textAnchor="middle">
              Court
            </text>

            <rect x="215" y="425" width="38" height="55" fill="#6EE7B7" rx="2" />
            <text x="234" y="455" fontSize="7" fontWeight="600" fill="#065F46" textAnchor="middle">
              Tennis
            </text>
            <text x="234" y="465" fontSize="6" fill="#065F46" textAnchor="middle">
              Court
            </text>

            {/* EDUC new building at bottom-left */}
            <rect x="60" y="385" width="52" height="55" fill="#D5CCC6" rx="2" />
            <text x="86" y="410" fontSize="8" fontWeight="bold" fill="#5D4037" textAnchor="middle">
              EDUC
            </text>
            <text x="86" y="420" fontSize="7" fill="#5D4037" textAnchor="middle">
              new building
            </text>

            {/* Large Brown Building on East side */}
            <rect x="490" y="110" width="95" height="85" fill="#D5CCC6" rx="2" />
            <g transform="translate(555, 340)">
              <text fontSize="14">🍴</text>
            </g>

            {/* DMMMSU Athletic Oval Track Boundary with tilt from IMG_2668 */}
            <g transform="rotate(-13 375 260)">
              {/* Outer track line (mint green boundary from IMG_2668) */}
              <rect
                x="260"
                y="95"
                width="225"
                height="340"
                rx="110"
                fill="#F7FBF4"
                stroke="#5CD096"
                strokeWidth="4"
              />
              {/* Inner track grass line */}
              <rect
                x="285"
                y="120"
                width="175"
                height="290"
                rx="86"
                fill="#FAFDF8"
                stroke="#A7F3D0"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </g>

            {/* Official Label along the upper curve matching IMG_2668 */}
            <text
              x="305"
              y="110"
              fontSize="11"
              fontWeight="bold"
              fill="#059669"
              fontStyle="italic"
              transform="rotate(-28 305 110)"
            >
              DMMMSU Oval
            </text>

            {/* Signature Strava Imperfect GPS Walk Path dynamically rendered from real coordinates */}
            {svgPathD && (
              <path
                d={svgPathD}
                fill="none"
                stroke="#FC4C02"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-xs"
              />
            )}

            {/* Start Pin (Green) */}
            {coordinates.length > 0 && (
              <circle
                cx={(375 + ((coordinates[0][1] - DMMMSU_OVAL_CENTER[1]) / 0.00045) * 115).toFixed(1)}
                cy={(260 - ((coordinates[0][0] - DMMMSU_OVAL_CENTER[0]) / 0.00086) * 165).toFixed(1)}
                r="4.5"
                fill="#2E7D32"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            )}

            {/* Current scrubber playback pin */}
            <circle
              cx={currentSvgPos.x.toFixed(1)}
              cy={currentSvgPos.y.toFixed(1)}
              r="5.5"
              fill="#FC4C02"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="drop-shadow-xs"
            />
          </svg>
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      )}

      {/* Floating Map Layer Switcher */}
      <div className="absolute top-2 right-2 z-[400] flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs border border-gray-200 text-xs">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMapStyle('osm');
            }}
            title="OpenStreetMap Tiles at Agoo DMMMSU Oval"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              mapStyle === 'osm'
                ? 'bg-[#FC4C02] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            OSM Map
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMapStyle('blueprint');
            }}
            title="DMMMSU Oval Track Blueprint (IMG_2668)"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              mapStyle === 'blueprint'
                ? 'bg-[#FC4C02] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Campus Layout
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMapStyle('satellite');
            }}
            title="Satellite Aerial View"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              mapStyle === 'satellite'
                ? 'bg-[#FC4C02] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Satellite
          </button>
        </div>

        {onExpand && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Expand Map"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* GPS Trace Playback Controller in detailed view */}
      {isDetailedView && (
        <div className="absolute bottom-2 left-2 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-md shadow-xs border border-gray-200 text-xs">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1 font-medium text-[#242428] hover:text-[#FC4C02] transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-[#FC4C02] text-[#FC4C02]" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-[#FC4C02] text-[#FC4C02]" /> Replay Walk
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetPlay}
            className="text-gray-500 hover:text-gray-800 p-0.5"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FC4C02] transition-all duration-75"
              style={{
                width: `${((progressIndex + 1) / coordinates.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-[11px] text-gray-500 font-mono">
            {((((progressIndex + 1) / coordinates.length) * distanceKm) || 0).toFixed(2)} km
          </span>
        </div>
      )}

      {/* Inconsistency Indicator Badge */}
      <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-medium text-gray-600 border border-gray-200 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FC4C02] animate-pulse"></span>
        <span>Agoo DMMMSU Oval · 1 Lap Walk Path</span>
      </div>

      {/* Location Attribution matching reference IMG_2667 & IMG_2668 */}
      <div className="absolute bottom-1 right-2 z-[400] text-[10px] text-gray-500/80 pointer-events-none select-none">
        © OpenMapTiles © OpenStreetMap · DMMMSU Oval, Agoo
      </div>
    </div>
  );
};
