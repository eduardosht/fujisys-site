import type { ConfirmationStatus } from './emailConfirmation.mjs';

export interface FallbackStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
}

export interface StoreLink {
  label: string;
  href: string;
}

export function consumeFallbackResult(storage: FallbackStorage): ConfirmationStatus;
export function buildFallbackAppUrl(status: string): string;
export function confirmationReturnPath(basePath: string, confirmationPath: string): string;
export function configuredStoreLinks(iosUrl: string | undefined, androidUrl: string | undefined): StoreLink[];
