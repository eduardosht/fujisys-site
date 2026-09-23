const envUrl = (value: string | undefined): string => value ?? "";

export type RoutePath =
  | "/"
  | "/birthly"
  | "/birthly/privacy"
  | "/birthly/support"
  | "/auth/callback/";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: `/birthday/${string}`): string {
  return `${basePath}${path}`;
}

export const SITE = {
  name: "Fuji Sys",
  email: "contato@fujisys.com.br",
  routes: {
    home: "/",
    birthday: "/birthly",
    privacy: "/birthly/privacy",
    support: "/birthly/support",
    authCallback: "/auth/callback/",
  },
  downloads: {
    appStore: envUrl(process.env.NEXT_PUBLIC_BIRTHLY_APP_STORE_URL),
    googlePlay: envUrl(process.env.NEXT_PUBLIC_BIRTHLY_GOOGLE_PLAY_URL),
  },
} as const;

export const PRODUCTS = [
  {
    name: "Birthly",
    eyebrow: "Lembrar também é cuidar.",
    description: "Um jeito simples e cuidadoso de manter datas importantes por perto.",
    href: SITE.routes.birthday,
  },
] as const;
