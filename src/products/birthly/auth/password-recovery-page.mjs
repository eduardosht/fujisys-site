import {
  recoveryErrorMessage,
  sanitizeRecoveryUrl,
} from './password-recovery.ts';

export const RECOVERY_PAGE_STATES = Object.freeze([
  'checking',
  'ready',
  'success',
  'invalid',
  'error',
  'unavailable',
]);

const INVALID_MESSAGE = 'Este link de recuperação é inválido ou expirou. Solicite um novo link.';
const SESSION_ERROR_MESSAGE = 'Não foi possível validar este link de recuperação. Solicite um novo link.';
const UPDATE_ERROR_MESSAGE = 'Não foi possível atualizar sua senha. Tente novamente ou solicite um novo link.';
const WEAK_PASSWORD_MESSAGE = 'Use uma senha com pelo menos uma letra e um número.';
const SHORT_PASSWORD_MESSAGE = 'Escolha uma senha com pelo menos 8 caracteres.';
const MISMATCH_MESSAGE = 'As senhas não coincidem.';

export function callbackPageState(callback) {
  if (callback.state === 'recovery') {
    return { status: 'ready' };
  }

  return {
    status: callback.state,
    message: recoveryErrorMessage(callback) || INVALID_MESSAGE,
  };
}

function recoverySessionInput(session) {
  const input = {
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  };

  if (session.expiresIn !== undefined) input.expires_in = session.expiresIn;
  if (session.expiresAt !== undefined) input.expires_at = session.expiresAt;
  if (session.tokenType !== undefined) input.token_type = session.tokenType;
  return input;
}

export async function establishRecoverySession(callback, supabase) {
  if (callback.state !== 'recovery') return callbackPageState(callback);

  try {
    const { error } = await supabase.auth.setSession(
      recoverySessionInput(callback.session),
    );
    if (error) return { status: 'error', message: SESSION_ERROR_MESSAGE };
    return { status: 'ready' };
  } catch {
    return { status: 'error', message: SESSION_ERROR_MESSAGE };
  }
}

export function replaceRecoveryHistory(history, pathname, title = '') {
  history.replaceState(history.state, title, sanitizeRecoveryUrl(pathname));
}

export function validateNewPassword(password, confirmation) {
  if (password.length < 8) return SHORT_PASSWORD_MESSAGE;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return WEAK_PASSWORD_MESSAGE;
  }
  if (password !== confirmation) return MISMATCH_MESSAGE;
  return null;
}

export async function submitPasswordReset(supabase, password, confirmation) {
  const validationError = validateNewPassword(password, confirmation);
  if (validationError) return { status: 'ready', validationError };

  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { status: 'error', message: UPDATE_ERROR_MESSAGE };
  } catch {
    return { status: 'error', message: UPDATE_ERROR_MESSAGE };
  }

  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // The password was already changed. Keep the confirmation generic and do not expose client errors.
  }

  return { status: 'success' };
}

export const recoveryMessages = Object.freeze({
  checking: 'Verificando o link de recuperação...',
  ready: 'Escolha uma nova senha para voltar ao Birthly.',
  success: 'Sua senha foi atualizada. Agora você pode voltar ao Birthly.',
  unavailable: 'A recuperação de senha está temporariamente indisponível. Tente novamente mais tarde.',
});
