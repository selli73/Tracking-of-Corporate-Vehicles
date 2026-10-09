export const TELEMETRY_SERVICE = 'TELEMETRY_SERVICE';

export const TELEMETRY_PATTERNS = {
  CREATE_GEOFENCE: 'telemetry.geofence',
  SAVE_LOCATION: 'telemetry.save-location',
  GEOFENCE_VIOLATION: 'telemetry.geofence-violation'
} as const;
