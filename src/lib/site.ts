export type RoutePath = "/" | "/birthly" | "/birthly/privacy" | "/birthly/support";

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
    birthday: publicPath("/birthly"),
    privacy: publicPath("/birthly/privacy"),
    support: publicPath("/birthly/support"),
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

export function getRoute(pathname: string): RoutePath | null {
  const withoutProjectPrefix = githubProjectPrefix && pathname.startsWith(githubProjectPrefix)
    ? pathname.slice(githubProjectPrefix.length) || "/"
    : pathname;
  const normalized = withoutProjectPrefix.length > 1
    ? withoutProjectPrefix.replace(/\/+$/, "")
    : withoutProjectPrefix;
  return (["/", "/birthly", "/birthly/privacy", "/birthly/support"] as RoutePath[]).includes(normalized as RoutePath)
    ? normalized as RoutePath
    : null;
}
