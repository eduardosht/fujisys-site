import {
  buildConfirmationResultUrl,
  parseConfirmationResult,
  sanitizeCallbackUrl,
} from './emailConfirmation.mjs';

export const CONFIRMATION_RESULT_STORAGE_KEY = 'birthly:confirmation-result';

export function processConfirmationCallback(browser, expectedPath) {
  const { location, history } = browser;
  if (location.pathname !== expectedPath) return null;

  const { status } = parseConfirmationResult(location.search, location.hash);
  const path = sanitizeCallbackUrl(location.pathname);
  history.replaceState(history.state, '', path);
  return { status, path };
}

export function openBirthly(browser, status, expectedPath) {
  if (browser.location.pathname !== expectedPath) return null;

  const path = sanitizeCallbackUrl(browser.location.pathname);
  browser.history.replaceState(browser.history.state, '', path);

  const target = new URL(buildConfirmationResultUrl('birthday://signup-confirmation', status));
  target.searchParams.set('source', 'email-confirmation');
  const safeStatus = target.searchParams.get('confirmation_result');

  try {
    browser.sessionStorage.setItem(CONFIRMATION_RESULT_STORAGE_KEY, safeStatus);
  } catch {
    // Browsers may disable session storage; the safe result remains in the deep link.
  }

  const url = target.toString();
  browser.location.assign(url);
  return url;
}
