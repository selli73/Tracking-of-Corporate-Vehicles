export const ERROR_CODES = {
  COMPANY_OR_OWNER_ALREADY_EXISTS: 'COMPANY_OR_OWNER_ALREADY_EXISTS',

  VEHICLE_NOT_FOUND: 'VEHICLE_NOT_FOUND',
  VEHICLE_ALREADY_EXISTS: 'VEHICLE_ALREADY_EXISTS',
  VEHICLE_UNIQUENESS_ERROR: 'VEHICLE_UNIQUENESS_ERROR',

  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',

  BOOKING_OVERLAP: 'BOOKING_OVERLAP',
  INTERVAL_INVALID: 'INTERVAL_INVALID',
  START_IN_PAST: 'START_IN_PAST',
  BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
  NOT_YOUR_RESERATION: 'NOT_YOUR_RESERATION',
  BOOKING_NOT_STARTED: 'BOOKING_NOT_STARTED',
  BOOKING_NOT_COMPLETE: 'DOES_NOT_COMPLETE',

} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export interface RpcErrorPayload {
  code: ErrorCode;
  message: string;
}

export function isRpcErrorPayload(error: unknown): error is RpcErrorPayload {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as RpcErrorPayload).code === 'string' &&
    typeof (error as RpcErrorPayload).message === 'string'
  );
}