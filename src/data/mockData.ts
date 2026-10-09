import { Activity, UserProfile } from '../types';
import keannaAvatar from '../assets/images/regenerated_image_1791550724213.png';

export const CURRENT_USER: UserProfile = {
  name: 'Keanna Laine S. Dela Cruz',
  location: 'Baguio, Cordillera Administrative Region, Philippines',
  institution: 'Don Mariano Marcos Memorial State University, South La Union Campus',
  avatarInitial: 'K',
  avatarColor: '#45332C', // Signature dark warm brown from Strava avatar in IMG_2666 & IMG_2667
  avatarUrl: keannaAvatar,
  last4WeeksActivitiesCount: 1,
  followingCount: 0,
  followersCount: 0,
};

// Exact center of DMMMSU South La Union Campus Oval in Agoo, La Union (IMG_2668 / IMG_2669)
export const DMMMSU_OVAL_CENTER: [number, number] = [16.32355, 120.36528];

/**
 * Pseudo-random generator with seed for reproducible yet realistic human walking GPS jitter
 */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates an authentic, imperfect human walk GPS path showing EXACTLY 1 LAP around the DMMMSU Oval.
 * Reflects genuine walking inconsistency across a single 400m track lap:
 * - Starts from the Grandstand / entrance path on the west straight
 * - Loops north past basketball courts, curves around the top bend
 * - Walks down the east straight facing the campus grounds
 * - Rounds the south curve near the tennis courts and Doña Toribia Road
 * - Returns to the Grandstand, completing exactly 1 single imperfect lap!
 */
export function generateImperfectWalkPoints(
  laps: number = 1.0,
  activitySeed: number = 1,
  hasGrandstandDeviation: boolean = false
): [number, number][] {
  const points: [number, number][] = [];
  const centerLat = 16.32355;
  const centerLng = 120.36528;

  // Athletic track oval semi-axes
  const semiMajor = 0.00086; // ~95m North-South
  const semiMinor = 0.00044; // ~48m East-West
  const tiltRad = (-14 * Math.PI) / 180; // Tilt matching IMG_2668

  let s = activitySeed * 100 + 17;

  // Track entrance near Grandstand (west straight)
  const grandstandApproachLat = centerLat - 0.0002;
  const grandstandApproachLng = centerLng - semiMinor - 0.00022;

  // 1. Initial entrance steps from Grandstand to Lane 1/2 of the track
  const approachSteps = 8;
  for (let i = 0; i < approachSteps; i++) {
    const t = i / approachSteps;
    const noiseLat = (pseudoRandom(s++) - 0.5) * 0.000035;
    const noiseLng = (pseudoRandom(s++) - 0.5) * 0.000035;
    const pLat = grandstandApproachLat + (centerLat - grandstandApproachLat) * t * 0.4 + noiseLat;
    const pLng = grandstandApproachLng + ((centerLng - semiMinor) - grandstandApproachLng) * t + noiseLng;
    points.push([pLat, pLng]);
  }

  // 2. Exactly 1 Lap around the DMMMSU Oval (~100 points, 1 point per 3-4 seconds of human walking)
  const pointsPerLap = 95;
  // Always restrict to 1 single full loop (360 degrees)
  const totalSteps = pointsPerLap;

  // Start from West straight at Grandstand (angle = PI), then go counter-clockwise:
  // West Straight -> North Curve -> East Straight -> South Curve -> West Straight finish
  const startAngle = Math.PI;

  for (let step = 0; step <= totalSteps; step++) {
    const progress = step / totalSteps; // 0.0 to 1.0 = exactly 1 lap
    const theta = startAngle - progress * Math.PI * 2; // Counter-clockwise standard athletic track direction

    // Standard oval parametric shape (straight sides + rounded ends)
    let uX = Math.cos(theta);
    let uY = Math.sin(theta);

    // Flatten straights slightly to resemble physical running track
    if (Math.abs(uY) < 0.6) {
      uX = uX > 0 ? 0.94 : -0.94;
    }

    // Inconsistency 1: Lane position drift (swaying between inside lane and outer lane)
    const laneOffsetRadius =
      Math.sin(progress * Math.PI * 4 + activitySeed) * 0.000035 +
      Math.sin(theta * 3) * 0.000025;

    // Inconsistency 2: Handheld GPS micro-jitter (human walking speed natural 2-4m noise)
    const gpsWiggleLat = (pseudoRandom(s++) - 0.5) * 0.00004;
    const gpsWiggleLng = (pseudoRandom(s++) - 0.5) * 0.00004;

    // Inconsistency 3: Corner arc variation (swaying slightly wider or cutting corner)
    let bendDriftLat = 0;
    let bendDriftLng = 0;
    if (uY > 0.5) {
      // North bend near CS MH / Sunshine circle: slightly wider or flatter arc
      bendDriftLat = Math.sin(theta * 2 + activitySeed) * 0.00003;
      bendDriftLng = -Math.cos(theta * 2 + activitySeed) * 0.000025;
    } else if (uY < -0.5) {
      // South bend near Tennis courts & roundabout: slight uneven turn
      bendDriftLat = -Math.sin(theta * 3 + activitySeed) * 0.000035;
      bendDriftLng = Math.cos(theta * 2 + activitySeed) * 0.00003;
    }

    // Inconsistency 4: Optional Grandstand pause/deviation (e.g. stepping aside briefly)
    let detourLng = 0;
    let detourLat = 0;
    if (hasGrandstandDeviation && progress > 0.08 && progress < 0.22) {
      const p = (progress - 0.08) / 0.14;
      detourLng = -0.00009 * Math.sin(p * Math.PI);
      detourLat = (pseudoRandom(s++) - 0.5) * 0.000025;
    }

    // Raw coordinates relative to oval center
    const rawX = uX * semiMinor + laneOffsetRadius + bendDriftLng + detourLng;
    const rawY = uY * semiMajor + laneOffsetRadius + bendDriftLat + detourLat;

    // Apply -14° tilt rotation matching IMG_2668
    const rotX = rawX * Math.cos(tiltRad) - rawY * Math.sin(tiltRad);
    const rotY = rawX * Math.sin(tiltRad) + rawY * Math.cos(tiltRad);

    const lat = centerLat + rotY + gpsWiggleLat;
    const lng = centerLng + rotX + gpsWiggleLng;

    points.push([lat, lng]);
  }

  // 3. Finish step near the Grandstand finish line
  const lastPoint = points[points.length - 1];
  for (let i = 0; i < 3; i++) {
    points.push([
      lastPoint[0] + (pseudoRandom(s++) - 0.5) * 0.000015,
      lastPoint[1] + (pseudoRandom(s++) - 0.5) * 0.000015,
    ]);
  }

  return points;
}

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-6',
    no: 6,
    title: 'morning walk',
    sport: 'walk',
    date: 'October 3, 2026',
    rawDate: '2026-10-03',
    startTime: '7:12 AM',
    distanceKm: 2.32,
    steps: 3412,
    durationStr: '32m 16s',
    durationSeconds: 1936,
    elevationGainM: 4,
    locationName: 'DMMMSU Oval, South La Union Campus',
    device: 'Strava App · Agoo, La Union',
    privacy: 'only_you',
    calories: 148,
    avgPaceMinKm: '13:54 /km',
    avgHeartRate: 104,
    cadenceSpm: 108,
    lapsCount: 1,
    kudos: ['Mark B.', 'Clarisse Santos', 'Joshua Reyes', 'Aira Mae', 'Coach Ding'],
    comments: [
      {
        id: 'c1',
        author: 'Clarisse Santos',
        avatarText: 'C',
        avatarBg: '#E15241',
        text: 'Great pace Keanna! Was the track crowded this morning?',
        timestamp: 'Oct 3 at 8:30 AM',
      },
      {
        id: 'c2',
        author: 'Keanna Laine S. Dela Cruz',
        avatarText: 'K',
        avatarBg: '#45332C',
        avatarUrl: keannaAvatar,
        text: 'Thanks Clarisse! Just a few varsity runners early on, super peaceful!',
        timestamp: 'Oct 3 at 9:02 AM',
      },
    ],
    // Exactly 1 imperfect lap around DMMMSU Oval with Grandstand step-aside
    coordinates: generateImperfectWalkPoints(1.0, 11, true),
    splits: [
      { lap: 1, distanceKm: 0.40, timeStr: '5m 32s', paceStr: '13:50 /km', elevGainM: 1 },
      { lap: 2, distanceKm: 0.40, timeStr: '5m 28s', paceStr: '13:40 /km', elevGainM: 0 },
      { lap: 3, distanceKm: 0.40, timeStr: '5m 35s', paceStr: '13:57 /km', elevGainM: 1 },
      { lap: 4, distanceKm: 0.40, timeStr: '5m 38s', paceStr: '14:05 /km', elevGainM: 1 },
      { lap: 5, distanceKm: 0.40, timeStr: '5m 30s', paceStr: '13:45 /km', elevGainM: 0 },
      { lap: 6, distanceKm: 0.32, timeStr: '4m 33s', paceStr: '14:13 /km', elevGainM: 1 },
    ],
  },
  {
    id: 'act-5',
    no: 5,
    title: 'morning walk',
    sport: 'walk',
    date: 'September 26, 2026',
    rawDate: '2026-09-26',
    startTime: '6:28 AM',
    distanceKm: 2.37,
    steps: 3628,
    durationStr: '33m 14s',
    durationSeconds: 1994,
    elevationGainM: 3,
    locationName: 'DMMMSU Oval, Agoo, La Union',
    device: 'Strava App · Agoo, La Union',
    privacy: 'only_you',
    calories: 154,
    avgPaceMinKm: '14:01 /km',
    avgHeartRate: 102,
    cadenceSpm: 109,
    lapsCount: 1,
    kudos: ['Mark B.', 'Angela Marie', 'Danilo Cruz', 'Bianca Tan'],
    comments: [
      {
        id: 'c3',
        author: 'Angela Marie',
        avatarText: 'A',
        avatarBg: '#2E7D32',
        text: '6:28 AM dedication! Keep it up!',
        timestamp: 'Sep 26 at 7:45 AM',
      },
    ],
    // Exactly 1 imperfect lap with sunrise outer lane sway
    coordinates: generateImperfectWalkPoints(1.0, 27, false),
    splits: [
      { lap: 1, distanceKm: 0.40, timeStr: '5m 35s', paceStr: '13:58 /km', elevGainM: 0 },
      { lap: 2, distanceKm: 0.40, timeStr: '5m 39s', paceStr: '14:07 /km', elevGainM: 1 },
      { lap: 3, distanceKm: 0.40, timeStr: '5m 40s', paceStr: '14:10 /km', elevGainM: 0 },
      { lap: 4, distanceKm: 0.40, timeStr: '5m 36s', paceStr: '14:00 /km', elevGainM: 1 },
      { lap: 5, distanceKm: 0.40, timeStr: '5m 32s', paceStr: '13:50 /km', elevGainM: 0 },
      { lap: 6, distanceKm: 0.37, timeStr: '5m 12s', paceStr: '14:03 /km', elevGainM: 1 },
    ],
  },
  {
    id: 'act-4',
    no: 4,
    title: 'morning walk',
    sport: 'walk',
    date: 'September 14, 2026',
    rawDate: '2026-09-14',
    startTime: '8:41 AM',
    distanceKm: 2.31,
    steps: 3276,
    durationStr: '31m 26s',
    durationSeconds: 1886,
    elevationGainM: 5,
    locationName: 'DMMMSU Oval, South La Union Campus',
    device: 'Strava App · Agoo, La Union',
    privacy: 'only_you',
    calories: 142,
    avgPaceMinKm: '13:36 /km',
    avgHeartRate: 108,
    cadenceSpm: 112,
    lapsCount: 1,
    kudos: ['Paul Soriano', 'Clarisse Santos', 'Reymart O.', 'Gelo M.', 'Jessica T.', 'Alyssa D.', 'Coach Ding'],
    comments: [
      {
        id: 'c4',
        author: 'Paul Soriano',
        avatarText: 'P',
        avatarBg: '#1976D2',
        text: 'Fastest pace yet Keanna! 13:36 is solid!',
        timestamp: 'Sep 14 at 9:30 AM',
      },
      {
        id: 'c5',
        author: 'Keanna Laine S. Dela Cruz',
        avatarText: 'K',
        avatarBg: '#45332C',
        avatarUrl: keannaAvatar,
        text: 'Had to catch the next class in CS building haha!',
        timestamp: 'Sep 14 at 9:35 AM',
      },
      {
        id: 'c6',
        author: 'Clarisse Santos',
        avatarText: 'C',
        avatarBg: '#E15241',
        text: 'Hahaha that CS building sprint counts too!',
        timestamp: 'Sep 14 at 10:00 AM',
      },
    ],
    // Exactly 1 imperfect lap with brisk inside pace
    coordinates: generateImperfectWalkPoints(1.0, 43, false),
    splits: [
      { lap: 1, distanceKm: 0.40, timeStr: '5m 25s', paceStr: '13:32 /km', elevGainM: 1 },
      { lap: 2, distanceKm: 0.40, timeStr: '5m 22s', paceStr: '13:25 /km', elevGainM: 1 },
      { lap: 3, distanceKm: 0.40, timeStr: '5m 28s', paceStr: '13:40 /km', elevGainM: 1 },
      { lap: 4, distanceKm: 0.40, timeStr: '5m 30s', paceStr: '13:45 /km', elevGainM: 0 },
      { lap: 5, distanceKm: 0.40, timeStr: '5m 26s', paceStr: '13:35 /km', elevGainM: 1 },
      { lap: 6, distanceKm: 0.31, timeStr: '4m 15s', paceStr: '13:42 /km', elevGainM: 1 },
    ],
  },
  {
    id: 'act-3',
    title: 'morning walk',
    sport: 'walk',
    date: 'August 13, 2026',
    rawDate: '2026-08-13',
    startTime: '8:26 AM',
    distanceKm: 0.98,
    steps: 2531,
    durationStr: '25m 16s',
    durationSeconds: 1516,
    elevationGainM: 2,
    locationName: 'DMMMSU Oval, Agoo, La Union',
    device: 'Strava App · Agoo, La Union',
    privacy: 'only_you',
    calories: 82,
    avgPaceMinKm: '25:46 /km',
    avgHeartRate: 92,
    cadenceSpm: 94,
    lapsCount: 1,
    kudos: ['Mark B.', 'Clarisse Santos', 'Joshua Reyes'],
    comments: [],
    // Exactly 1 imperfect lap with slow casual stroll wiggles
    coordinates: generateImperfectWalkPoints(1.0, 61, false),
    splits: [
      { lap: 1, distanceKm: 0.40, timeStr: '10m 12s', paceStr: '25:30 /km', elevGainM: 1 },
      { lap: 2, distanceKm: 0.40, timeStr: '10m 20s', paceStr: '25:50 /km', elevGainM: 1 },
      { lap: 3, distanceKm: 0.18, timeStr: '4m 44s', paceStr: '26:17 /km', elevGainM: 0 },
    ],
  },
  {
    id: 'act-2',
    title: 'morning walk',
    sport: 'walk',
    date: 'July 30, 2026',
    rawDate: '2026-07-30',
    startTime: '8:29 AM',
    distanceKm: 0.98,
    steps: 1326,
    durationStr: '27m 39s',
    durationSeconds: 1659,
    elevationGainM: 2,
    locationName: 'DMMMSU Oval, Agoo, La Union',
    device: 'Strava App · Agoo, La Union',
    privacy: 'only_you',
    calories: 79,
    avgPaceMinKm: '28:13 /km',
    avgHeartRate: 88,
    cadenceSpm: 86,
    lapsCount: 1,
    kudos: ['Clarisse Santos', 'Aira Mae'],
    comments: [
      {
        id: 'c7',
        author: 'Clarisse Santos',
        avatarText: 'C',
        avatarBg: '#E15241',
        text: 'Rest days and easy walks are just as important! 🚶‍♀️✨',
        timestamp: 'Jul 30 at 9:15 AM',
      },
    ],
    // Exactly 1 imperfect recovery lap with southern curve wander
    coordinates: generateImperfectWalkPoints(1.0, 83, false),
    splits: [
      { lap: 1, distanceKm: 0.40, timeStr: '11m 15s', paceStr: '28:07 /km', elevGainM: 1 },
      { lap: 2, distanceKm: 0.40, timeStr: '11m 20s', paceStr: '28:20 /km', elevGainM: 0 },
      { lap: 3, distanceKm: 0.18, timeStr: '5m 04s', paceStr: '28:08 /km', elevGainM: 1 },
    ],
  },
  {
    id: 'act-1',
    title: 'morning walk',
    sport: 'walk',
    date: 'July 16, 2026',
    rawDate: '2026-07-16',
    startTime: '8:11 AM',
    distanceKm: 0.40,
    steps: 683,
    durationStr: '6m 28s',
    durationSeconds: 388,
    elevationGainM: 1,
    locationName: 'DMMMSU Oval, Agoo, La Union',
    device: 'Strava App · Agoo, La Union',
    privacy: 'only_you',
    calories: 32,
    avgPaceMinKm: '16:10 /km',
    avgHeartRate: 98,
    cadenceSpm: 105,
    lapsCount: 1,
    kudos: ['Mark B.', 'Clarisse Santos', 'Joshua Reyes', 'Bianca Tan', 'Danilo Cruz', 'Alyssa D.'],
    comments: [
      {
        id: 'c8',
        author: 'Mark B.',
        avatarText: 'M',
        avatarBg: '#00897B',
        text: 'Welcome to Strava Keanna! Let us know if you want to walk together next week!',
        timestamp: 'Jul 16 at 8:40 AM',
      },
      {
        id: 'c9',
        author: 'Keanna Laine S. Dela Cruz',
        avatarText: 'K',
        avatarBg: '#45332C',
        avatarUrl: keannaAvatar,
        text: 'Salamat Mark! Yes definitely, see you around campus!',
        timestamp: 'Jul 16 at 9:00 AM',
      },
    ],
    // 1 single imperfect lap with start/finish GPS jitter
    coordinates: generateImperfectWalkPoints(1.0, 99, false),
    splits: [
      { lap: 1, distanceKm: 0.40, timeStr: '6m 28s', paceStr: '16:10 /km', elevGainM: 1 },
    ],
  },
];

// Landmark definitions around DMMMSU Oval matching reference image IMG_2668.jpeg & IMG_2669.jpeg
export const DMMMSU_CAMPUS_LANDMARKS = [
  { name: 'DMMMSU Oval', type: 'track', lat: 16.32355, lng: 120.36528, label: 'Don Mariano Marcos Memorial State University, South La Union Campus' },
  { name: 'Grandstand', type: 'building', lat: 16.3238, lng: 120.3644 },
  { name: 'Basketball Courts', type: 'sports', lat: 16.3239, lng: 120.3647 },
  { name: 'Tennis Courts', type: 'sports', lat: 16.3225, lng: 120.3648 },
  { name: 'DMMMSU Elem.', type: 'building', lat: 16.3243, lng: 120.3640 },
  { name: 'EDUC New Building', type: 'building', lat: 16.3223, lng: 120.3639 },
  { name: 'EDUC Main Building', type: 'building', lat: 16.3238, lng: 120.3663 },
  { name: 'Doña Toribia Provincial Road', type: 'road', lat: 16.3220, lng: 120.3655 },
  { name: 'Campus Roundabout', type: 'road', lat: 16.3222, lng: 120.3668 },
];
