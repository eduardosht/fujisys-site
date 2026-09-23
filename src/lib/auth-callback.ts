const MOBILE_PARAM_ALLOWLIST = [
  "code",
  "access_token",
  "refresh_token",
  "expires_in",
  "expires_at",
  "token_type",
  "type",
  "token_hash",
] as const;

type CallbackParams = URLSearchParams;

function parseParams(value: string): CallbackParams {
  return new URLSearchParams(value.replace(/^[?#]/, ""));
}

function callbackParams(search: string, hash: string): CallbackParams[] {
  return [parseParams(search), parseParams(hash)];
}

function hasAuthError(params: CallbackParams[]): boolean {
  return params.some((current) =>
    ["error", "error_code", "error_description"].some((key) => current.has(key)),
  );
}

function hasAuthSuccess(params: CallbackParams[]): boolean {
  return params.some(
    (current) =>
      Boolean(current.get("code")) ||
      Boolean(current.get("access_token")) ||
      current.get("type") === "signup",
  );
}

export function classifyAuthCallback(
  search: string,
  hash: string,
): "success" | "error" | "direct" {
  const params = callbackParams(search, hash);

  if (hasAuthError(params)) return "error";
  if (hasAuthSuccess(params)) return "success";
  return "direct";
}

export function buildMobileConfirmationUrl(search: string, hash: string): string | null {
  const params = callbackParams(search, hash);

  if (classifyAuthCallback(search, hash) !== "success") return null;

  const mobileParams = new URLSearchParams();
  for (const key of MOBILE_PARAM_ALLOWLIST) {
    for (const current of params) {
      const value = current.get(key);
      if (value) {
        mobileParams.set(key, value);
        break;
      }
    }
  }

  return `birthday://signup-confirmation?${mobileParams.toString()}`;
}

export function safeAuthErrorMessage(search: string, hash: string): string {
  return classifyAuthCallback(search, hash) === "error"
    ? "Não foi possível confirmar seu e-mail. O link pode ter expirado ou já ter sido usado."
    : "Esta página deve ser aberta a partir do link de confirmação enviado por e-mail.";
}
