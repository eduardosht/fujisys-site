import type { ConfirmationStatus } from './emailConfirmation.mjs';

export const CONFIRMATION_RESULT_STORAGE_KEY: string;

export interface ConfirmationBrowser {
  location: {
    pathname: string;
    search: string;
    hash: string;
    assign(url: string): void;
  };
  history: {
    state: unknown;
    replaceState(state: unknown, unused: string, url?: string | URL | null): void;
  };
  sessionStorage: {
    setItem(key: string, value: string): void;
  };
}

export function processConfirmationCallback(
  browser: ConfirmationBrowser,
  expectedPath: string,
): { status: ConfirmationStatus; path: string } | null;

export function openBirthly(
  browser: ConfirmationBrowser,
  status: string,
  expectedPath: string,
): string | null;
