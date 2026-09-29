import type { RecoveryCallback } from "./password-recovery.ts";

export type RecoveryPageStatus =
  | "checking"
  | "ready"
  | "success"
  | "invalid"
  | "error"
  | "unavailable";

export const RECOVERY_PAGE_STATES: readonly RecoveryPageStatus[];

export function callbackPageState(callback: RecoveryCallback): {
  status: "ready" | "error" | "invalid";
  message?: string;
};

export function establishRecoverySession(
  callback: RecoveryCallback,
  supabase: {
    auth: {
      setSession(input: {
        access_token: string;
        refresh_token: string;
        expires_in?: number;
        expires_at?: number;
        token_type?: string;
      }): Promise<{ error: unknown | null }>;
    };
  },
): Promise<{ status: "ready" | "error" | "invalid"; message?: string }>;

export function replaceRecoveryHistory(
  history: Pick<History, "state" | "replaceState">,
  pathname: string,
  title?: string,
): void;

export function validateNewPassword(
  password: string,
  confirmation: string,
): string | null;

export function submitPasswordReset(
  supabase: {
    auth: {
      updateUser(input: { password: string }): Promise<{ error: unknown | null }>;
      signOut(options: { scope: "local" }): Promise<{ error: unknown | null }>;
    };
  },
  password: string,
  confirmation: string,
): Promise<
  | { status: "ready"; validationError: string }
  | { status: "error"; message: string }
  | { status: "success" }
>;

export const recoveryMessages: Readonly<{
  checking: string;
  ready: string;
  success: string;
  unavailable: string;
}>;
