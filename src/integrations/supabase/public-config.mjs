function decodeJwtPayload(value) {
  const payload = value.split(".")[1];
  if (!payload || typeof globalThis.atob !== "function") return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(globalThis.atob(padded));
  } catch {
    return null;
  }
}

export function isPublicSupabaseKey(value) {
  const key = value.trim();
  if (!key || /^(sb_secret_|service_role)/i.test(key)) return false;

  const payload = decodeJwtPayload(key);
  return payload?.role !== "service_role";
}
