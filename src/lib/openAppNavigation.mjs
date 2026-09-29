import { buildConfirmationResultUrl } from './emailConfirmation.mjs';
import { CONFIRMATION_RESULT_STORAGE_KEY } from './emailConfirmationNavigation.mjs';

const allowedStatuses = new Set(['success', 'error', 'unknown']);

export function buildAppUrl() {
  return 'birthday://open-app';
}

export function consumeFallbackResult(storage, search = '') {
  const query = new URLSearchParams(search);
  const queryResult = query.get('source') === 'email-confirmation'
    ? query.get('confirmation_result')
    : null;
  try {
    const saved = storage.getItem(CONFIRMATION_RESULT_STORAGE_KEY);
    storage.removeItem(CONFIRMATION_RESULT_STORAGE_KEY);
    const result = queryResult ?? saved;
    return allowedStatuses.has(result) ? result : 'unknown';
  } catch {
    return allowedStatuses.has(queryResult) ? queryResult : 'unknown';
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

export function openAppInstruction(storeLinks) {
  const instruction = 'Se você já tem o Birthly instalado, toque no botão para abri-lo.';
  return storeLinks.length > 0
    ? `${instruction} Se ainda não instalou, use um dos links de loja disponíveis abaixo.`
    : instruction;
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
