import { BIRTHLY_LINK_ROUTES, BIRTHLY_ROUTES } from "./routes.ts";

export const BIRTHLY_PRODUCT_CONFIG = {
  id: "birthly",
  slug: "birthly",
  name: "Birthly",
  eyebrow: "Lembrar também é cuidar.",
  description: "Um jeito simples e cuidadoso de manter datas importantes por perto.",
  href: BIRTHLY_LINK_ROUTES.home(),
  routes: BIRTHLY_ROUTES,
  linkRoutes: BIRTHLY_LINK_ROUTES,
  support: {
    email: "contato@fujisys.com.br",
  },
} as const;

export const BIRTHLY_PRODUCT = BIRTHLY_PRODUCT_CONFIG;
