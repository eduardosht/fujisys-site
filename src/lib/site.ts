export type RoutePath = "/" | "/birthday" | "/birthday/privacy" | "/birthday/support";

const githubProjectPrefix =
  window.location.hostname.endsWith("github.io") ? "/fujisys-site" : "";

function publicPath(path: string): string {
  return `${githubProjectPrefix}${path}`;
}

export function assetPath(path: `/birthday/${string}`): string {
  return publicPath(path);
}

export const SITE = {
  name: "Fuji Sys",
  email: "contato@fujisys.com.br",
  routes: {
    home: publicPath("/"),
    birthday: publicPath("/birthday"),
    privacy: publicPath("/birthday/privacy"),
    support: publicPath("/birthday/support"),
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
  const withoutProjectPrefix = githubProjectPrefix && pathname.startsWith(githubProjectPrefix)
    ? pathname.slice(githubProjectPrefix.length) || "/"
    : pathname;
  const normalized = withoutProjectPrefix.length > 1
    ? withoutProjectPrefix.replace(/\/+$/, "")
    : withoutProjectPrefix;
  return (["/", "/birthday", "/birthday/privacy", "/birthday/support"] as RoutePath[]).includes(normalized as RoutePath)
    ? normalized as RoutePath
    : null;
}
