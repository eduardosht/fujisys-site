export type RoutePath = "/" | "/birthly" | "/birthly/privacy" | "/birthly/support";

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
