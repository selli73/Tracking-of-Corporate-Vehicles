export const TELEMETRY_SERVICE = 'TELEMETRY_SERVICE';

export const TELEMETRY_PATTERNS = {
  CREATE_GEOFENCE: 'telemetry.geofence',
  SAVE_LOCATION: 'telemetry.save-location',
  GEOFENCE_VIOLATION: 'telemetry.geofence-violation',
  CALCULATE_DISTANCE: 'telemetry.calculate-distance'
} as const;
