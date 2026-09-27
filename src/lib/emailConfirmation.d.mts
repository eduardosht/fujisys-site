export type ConfirmationStatus = 'success' | 'error' | 'unknown';

export function parseConfirmationResult(
  search: string,
  hash: string,
): { status: ConfirmationStatus };

export function sanitizeCallbackUrl(pathname: string): string;

export function buildConfirmationResultUrl(
  pathname: string,
  status: ConfirmationStatus,
): string;
