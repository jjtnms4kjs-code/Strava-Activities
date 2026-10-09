export interface Activity {
  id: string;
  no?: number; // e.g. 6, 5, 4 or undefined for the older ones
  title: string;
  sport: 'walk' | 'run' | 'ride' | 'hike';
  date: string; // e.g. "October 3, 2026"
  rawDate: string; // ISO date for sorting
  startTime: string; // e.g. "7:12 AM"
  distanceKm: number; // e.g. 2.32
  steps: number; // e.g. 3412
  durationStr: string; // e.g. "32m 16s"
  durationSeconds: number;
  elevationGainM: number;
  locationName: string;
  device: string; // e.g. "Strava App · Agoo, La Union"
  privacy: 'only_you' | 'followers' | 'everyone';
  description?: string;
  calories: number;
  avgPaceMinKm: string; // e.g. "13:54 /km"
  avgHeartRate?: number;
  cadenceSpm?: number;
  lapsCount: number;
  kudos: string[]; // athlete names who gave kudos
  comments: Comment[];
  coordinates: [number, number][]; // [lat, lng] array around DMMMSU Oval
  splits: LapSplit[];
}

export interface Comment {
  id: string;
  author: string;
  avatarText: string;
  avatarBg?: string;
  avatarUrl?: string;
  text: string;
  timestamp: string;
}

export interface LapSplit {
  lap: number;
  distanceKm: number;
  timeStr: string;
  paceStr: string;
  elevGainM: number;
}

export interface UserProfile {
  name: string;
  location: string;
  institution: string;
  avatarInitial: string;
  avatarColor: string;
  avatarUrl?: string;
  last4WeeksActivitiesCount: number;
  followingCount: number;
  followersCount: number;
}
