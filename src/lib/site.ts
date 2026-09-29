import {
  INSTITUTIONAL_LINK_ROUTES,
  INSTITUTIONAL_ROUTE_PATHS,
  INSTITUTIONAL_ROUTES,
} from "../site/routes.ts";
import { BIRTHLY_PRODUCT, PRODUCT_CATALOG } from "../products/catalog.ts";
import { BIRTHLY_ROUTE_PATHS } from "../products/birthly/routes.ts";

const envUrl = (value: string | undefined): string => value ?? "";

export type RoutePath =
  | "/"
  | "/birthly"
  | "/birthly/privacy"
  | "/birthly/support"
  | "/auth/callback/"
  | "/birthly/confirm-email/"
  | "/birthly/open-app/";

export function assetPath(path: `/birthday/${string}`): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

export const SITE = {
  name: "Fuji Sys",
  email: "contato@fujisys.com.br",
  routes: {
    home: INSTITUTIONAL_ROUTE_PATHS.home,
    birthday: BIRTHLY_ROUTE_PATHS.home.replace(/\/$/, ""),
    confirmEmail: BIRTHLY_ROUTE_PATHS.confirmEmail,
    openApp: BIRTHLY_ROUTE_PATHS.openApp,
    privacy: BIRTHLY_ROUTE_PATHS.privacy.replace(/\/$/, ""),
    support: BIRTHLY_ROUTE_PATHS.support.replace(/\/$/, ""),
    authCallback: "/auth/callback/",
  },
  downloads: {
    appStore: envUrl(process.env.NEXT_PUBLIC_BIRTHLY_APP_STORE_URL),
    googlePlay: envUrl(process.env.NEXT_PUBLIC_BIRTHLY_GOOGLE_PLAY_URL),
  },
} as const;

export const INSTITUTIONAL_SITE = {
  name: SITE.name,
  email: SITE.email,
  routes: INSTITUTIONAL_ROUTES,
  linkRoutes: INSTITUTIONAL_LINK_ROUTES,
} as const;

// Compatibility projection for older Birthly pages; route ownership lives in the product module.
export const PRODUCTS = PRODUCT_CATALOG.map(({ name, eyebrow, description, href }) => ({
  name,
  eyebrow,
  description,
  href,
}));

export { BIRTHLY_PRODUCT };
