import { buildConfirmationResultUrl } from './emailConfirmation.mjs';
import { CONFIRMATION_RESULT_STORAGE_KEY } from './emailConfirmationNavigation.mjs';

const allowedStatuses = new Set(['success', 'error', 'unknown']);

export function consumeFallbackResult(storage) {
  try {
    const saved = storage.getItem(CONFIRMATION_RESULT_STORAGE_KEY);
    storage.removeItem(CONFIRMATION_RESULT_STORAGE_KEY);
    return allowedStatuses.has(saved) ? saved : 'unknown';
  } catch {
    return 'unknown';
  }
}

export function buildFallbackAppUrl(status) {
  const target = new URL(buildConfirmationResultUrl('birthday://signup-confirmation', status));
  target.searchParams.set('source', 'email-confirmation');
  return target.toString();
}

export function confirmationReturnPath(basePath, confirmationPath) {
  return `${basePath}${confirmationPath}`;
}

function httpsUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname ? url.toString() : null;
  } catch {
    return null;
  }
}

export function configuredStoreLinks(iosUrl, androidUrl) {
  const candidates = [
    { label: 'App Store', href: httpsUrl(iosUrl) },
    { label: 'Google Play', href: httpsUrl(androidUrl) },
  ];
  return candidates.filter((link) => link.href !== null);
}
