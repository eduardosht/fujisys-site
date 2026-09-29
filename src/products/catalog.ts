import { BIRTHLY_PRODUCT_CONFIG } from "./birthly/config.ts";
import type { BirthlyRoutes } from "./birthly/routes.ts";

export type ProductRouteBuilder = () => string;
export type ProductRoutes = Readonly<Record<string, ProductRouteBuilder>>;

export interface ProductDefinition<TRoutes extends ProductRoutes = ProductRoutes> {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly href: string;
  readonly routes: TRoutes;
  readonly linkRoutes: TRoutes;
  readonly support: {
    readonly email: string;
  };
}

export const BIRTHLY_PRODUCT: ProductDefinition<BirthlyRoutes> = BIRTHLY_PRODUCT_CONFIG;

export const PRODUCT_CATALOG: readonly ProductDefinition[] = [BIRTHLY_PRODUCT];
