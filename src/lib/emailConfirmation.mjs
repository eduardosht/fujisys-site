const errorFields = ['error', 'error_code', 'error_description'];
const allowedStatuses = new Set(['success', 'error', 'unknown']);

function params(value) {
  return new URLSearchParams(value.replace(/^[?#]/, ''));
}

export function parseConfirmationResult(search, hash) {
  const query = params(search);
  const fragment = params(hash);

  if (errorFields.some((field) => query.has(field) || fragment.has(field))) {
    return { status: 'error' };
  }

  if (
    query.get('type') === 'signup' ||
    fragment.get('type') === 'signup' ||
    Boolean(fragment.get('access_token')?.trim()) ||
    Boolean(query.get('code')?.trim()) ||
    Boolean(fragment.get('code')?.trim())
  ) {
    return { status: 'success' };
  }

  return { status: 'unknown' };
}

export function sanitizeCallbackUrl(pathname) {
  return pathname.split(/[?#]/, 1)[0];
}

export function buildConfirmationResultUrl(pathname, status) {
  const safeStatus = allowedStatuses.has(status) ? status : 'unknown';
  return `${sanitizeCallbackUrl(pathname)}?confirmation_result=${safeStatus}`;
}
