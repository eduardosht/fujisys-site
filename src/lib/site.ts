export type RoutePath = "/" | "/birthday" | "/birthday/privacy" | "/birthday/support";

export const SITE = {
  name: "Fuji Sys",
  email: "contato@fujisys.com.br",
  routes: {
    home: "/" as RoutePath,
    birthday: "/birthday" as RoutePath,
    privacy: "/birthday/privacy" as RoutePath,
    support: "/birthday/support" as RoutePath,
  },
} as const;

export const PRODUCTS = [
  {
    name: "Birthday",
    eyebrow: "Lembrar também é cuidar.",
    description: "Um jeito simples e cuidadoso de manter datas importantes por perto.",
    href: SITE.routes.birthday,
  },
] as const;

export function getRoute(pathname: string): RoutePath | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return Object.values(SITE.routes).includes(normalized as RoutePath)
    ? (normalized as RoutePath)
    : null;
}
