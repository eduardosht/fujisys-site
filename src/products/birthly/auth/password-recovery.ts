type CallbackParams = URLSearchParams;

export type RecoverySession = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  expiresAt?: number;
  tokenType?: string;
};

export type RecoveryCallback =
  | { state: "recovery"; session: RecoverySession }
  | { state: "pkce"; code: string }
  | { state: "error" }
  | { state: "invalid" };

function parseParams(value: string): CallbackParams {
  return new URLSearchParams(value.replace(/^[?#]/, ""));
}

function hasError(params: CallbackParams[]): boolean {
  return params.some((current) =>
    ["error", "error_code", "error_description"].some((key) => current.has(key)),
  );
}

function valuesFor(params: CallbackParams[], key: string): string[] {
  return params.flatMap((current) => current.getAll(key));
}

function firstNonEmptyValue(params: CallbackParams[], key: string): string | undefined {
  return valuesFor(params, key).find((value) => value.length > 0);
}

function optionalNumber(
  params: CallbackParams[],
  key: string,
): number | undefined | null {
  const value = firstNonEmptyValue(params, key);
  if (value === undefined) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function parseRecoveryCallback(search: string, hash: string): RecoveryCallback {
  const queryParams = parseParams(search);
  const hashParams = parseParams(hash);
  const params = [queryParams, hashParams];

  if (hasError(params)) return { state: "error" };

  const types = valuesFor(params, "type").filter((value) => value.length > 0);
  const code = firstNonEmptyValue([queryParams], "code");
  if (code && (types.length === 0 || types.every((value) => value === "recovery"))) {
    return { state: "pkce", code };
  }

  if (types.length === 0 || types.some((value) => value !== "recovery")) {
    return { state: "invalid" };
  }

  const accessToken = firstNonEmptyValue([hashParams], "access_token");
  const refreshToken = firstNonEmptyValue([hashParams], "refresh_token");
  if (!accessToken || !refreshToken) return { state: "invalid" };

  const expiresIn = optionalNumber([hashParams], "expires_in");
  const expiresAt = optionalNumber([hashParams], "expires_at");
  if (expiresIn === null || expiresAt === null) return { state: "invalid" };

  const tokenType = firstNonEmptyValue([hashParams], "token_type");
  const session: RecoverySession = { accessToken, refreshToken };
  if (expiresIn !== undefined) session.expiresIn = expiresIn;
  if (expiresAt !== undefined) session.expiresAt = expiresAt;
  if (tokenType !== undefined) session.tokenType = tokenType;

  return { state: "recovery", session };
}

export function sanitizeRecoveryUrl(pathname: string): string {
  return pathname.split(/[?#]/, 1)[0] || "/";
}

export function recoveryErrorMessage(callback: RecoveryCallback): string {
  if (callback.state === "error") {
    return "Este link já foi usado ou expirou. Abra o Birthly e toque em ‘Esqueci minha senha’ para solicitar um novo link.";
  }

  if (callback.state === "invalid") {
    return "Este link já foi usado ou expirou. Abra o Birthly e toque em ‘Esqueci minha senha’ para solicitar um novo link.";
  }

  return "";
}
