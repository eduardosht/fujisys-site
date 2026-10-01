import type { RouteBuilder } from "../../site/routes.ts";
import { buildSiteLink, buildSiteRoute } from "../../site/routes.ts";

export const BIRTHLY_ROUTE_PATHS = {
  home: "/birthly/",
  terms: "/birthly/terms/",
  privacy: "/birthly/privacy/",
  support: "/birthly/support/",
  confirmEmail: "/birthly/confirm-email/",
  resetPassword: "/birthly/reset-password/",
  openApp: "/birthly/open-app/",
} as const;

export type BirthlyRoutes = {
  [Key in keyof typeof BIRTHLY_ROUTE_PATHS]: RouteBuilder;
};

export const BIRTHLY_ROUTES: BirthlyRoutes = {
  home: () => buildSiteRoute(BIRTHLY_ROUTE_PATHS.home),
  terms: () => buildSiteRoute(BIRTHLY_ROUTE_PATHS.terms),
  privacy: () => buildSiteRoute(BIRTHLY_ROUTE_PATHS.privacy),
  support: () => buildSiteRoute(BIRTHLY_ROUTE_PATHS.support),
  confirmEmail: () => buildSiteRoute(BIRTHLY_ROUTE_PATHS.confirmEmail),
  resetPassword: () => buildSiteRoute(BIRTHLY_ROUTE_PATHS.resetPassword),
  openApp: () => buildSiteRoute(BIRTHLY_ROUTE_PATHS.openApp),
};

export const BIRTHLY_LINK_ROUTES: BirthlyRoutes = {
  home: () => buildSiteLink(BIRTHLY_ROUTE_PATHS.home),
  terms: () => buildSiteLink(BIRTHLY_ROUTE_PATHS.terms),
  privacy: () => buildSiteLink(BIRTHLY_ROUTE_PATHS.privacy),
  support: () => buildSiteLink(BIRTHLY_ROUTE_PATHS.support),
  confirmEmail: () => buildSiteLink(BIRTHLY_ROUTE_PATHS.confirmEmail),
  resetPassword: () => buildSiteLink(BIRTHLY_ROUTE_PATHS.resetPassword),
  openApp: () => buildSiteLink(BIRTHLY_ROUTE_PATHS.openApp),
};

export const birthlyRoutes = BIRTHLY_ROUTES;
