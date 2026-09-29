export type RouteBuilder = () => string;

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function normalizeBasePath(path: string): string {
  const value = path.trim().replace(/^\/+|\/+$/g, "");
  return value ? `/${value}` : "";
}

function normalizeRoutePath(path: string): string {
  const value = path.trim();
  if (!value || value === "/") return "/";

  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
}

export function buildSiteRoute(path: string): string {
  const basePath = normalizeBasePath(configuredBasePath);
  const routePath = normalizeRoutePath(path);
  return routePath === "/" ? `${basePath}/` : `${basePath}${routePath}`;
}

export function buildSiteLink(path: string): string {
  return normalizeRoutePath(path);
}

export const INSTITUTIONAL_ROUTE_PATHS = {
  home: "/",
  privacy: "/privacy/",
  support: "/support/",
} as const;

export const INSTITUTIONAL_ROUTES = {
  home: () => buildSiteRoute(INSTITUTIONAL_ROUTE_PATHS.home),
  privacy: () => buildSiteRoute(INSTITUTIONAL_ROUTE_PATHS.privacy),
  support: () => buildSiteRoute(INSTITUTIONAL_ROUTE_PATHS.support),
} as const;

export const INSTITUTIONAL_LINK_ROUTES = {
  home: () => buildSiteLink(INSTITUTIONAL_ROUTE_PATHS.home),
  privacy: () => buildSiteLink(INSTITUTIONAL_ROUTE_PATHS.privacy),
  support: () => buildSiteLink(INSTITUTIONAL_ROUTE_PATHS.support),
} as const;

export const SITE_ROUTES = INSTITUTIONAL_ROUTES;
