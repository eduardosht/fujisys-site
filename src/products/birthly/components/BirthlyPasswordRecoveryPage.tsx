"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { BIRTHLY_PRODUCT } from "@/src/products/catalog";
import {
  getBrowserSupabaseClient,
  SupabaseBrowserConfigError,
} from "@/src/integrations/supabase/browser-client";
import {
  parseRecoveryCallback,
  recoveryErrorMessage,
} from "@/src/products/birthly/auth/password-recovery";
import {
  callbackPageState,
  establishRecoverySession,
  recoveryMessages,
  replaceRecoveryHistory,
  submitPasswordReset,
} from "@/src/products/birthly/auth/password-recovery-page.mjs";
import styles from "./BirthlyPasswordRecoveryPage.module.css";

type RecoveryPageStatus =
  | "checking"
  | "ready"
  | "success"
  | "invalid"
  | "error"
  | "unavailable";

type RecoveryPageState = {
  status: RecoveryPageStatus;
  message: string;
};

const genericSessionError =
  "Não foi possível validar este link de recuperação. Solicite um novo link.";

function stateMessage(status: RecoveryPageStatus): string {
  if (status === "checking") return recoveryMessages.checking;
  if (status === "ready") return recoveryMessages.ready;
  if (status === "success") return recoveryMessages.success;
  if (status === "unavailable") return recoveryMessages.unavailable;
  return "Este link de recuperação é inválido ou expirou. Solicite um novo link.";
}

function statusSymbol(status: RecoveryPageStatus): string {
  if (status === "success") return "✓";
  if (status === "checking") return "•";
  return status === "ready" ? "↻" : "!";
}

export default function BirthlyPasswordRecoveryPage() {
  const [pageState, setPageState] = useState<RecoveryPageState>({
    status: "checking",
    message: recoveryMessages.checking,
  });
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const clientRef = useRef<ReturnType<typeof getBrowserSupabaseClient> | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    let active = true;

    async function consumeCallback() {
      const { search, hash, pathname } = window.location;
      const callback = parseRecoveryCallback(search, hash);

      replaceRecoveryHistory(window.history, pathname, document.title);

      if (callback.state !== "recovery") {
        const next = callbackPageState(callback);
        if (active) {
          setPageState({
            status: next.status as RecoveryPageStatus,
            message: next.message ?? recoveryErrorMessage(callback),
          });
        }
        return;
      }

      try {
        const client = getBrowserSupabaseClient();
        clientRef.current = client;
        const next = await establishRecoverySession(callback, client);
        if (!active) return;
        setPageState({
          status: next.status as RecoveryPageStatus,
          message: next.message ?? stateMessage(next.status as RecoveryPageStatus),
        });
      } catch (error) {
        if (!active) return;
        setPageState({
          status: error instanceof SupabaseBrowserConfigError ? "unavailable" : "error",
          message:
            error instanceof SupabaseBrowserConfigError
              ? recoveryMessages.unavailable
              : genericSessionError,
        });
      }
    }

    void consumeCallback();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || pageState.status !== "ready") return;

    setFormMessage("");
    const client = clientRef.current;
    if (!client) {
      setPageState({ status: "unavailable", message: recoveryMessages.unavailable });
      return;
    }

    setSubmitting(true);
    const result = await submitPasswordReset(client, password, confirmation);
    setSubmitting(false);

    if (result.status === "ready") {
      setFormMessage(result.validationError);
      return;
    }

    setPassword("");
    setConfirmation("");
    if (result.status === "error") {
      setPageState({ status: "error", message: result.message });
      return;
    }
    setPageState({
      status: "success",
      message: recoveryMessages.success,
    });
  }

  const { status } = pageState;
  const title =
    status === "checking"
      ? "Verificando seu link"
      : status === "ready"
        ? "Crie uma nova senha"
        : status === "success"
          ? "Senha atualizada"
          : status === "unavailable"
            ? "Recuperação indisponível"
            : status === "error"
              ? "Não foi possível atualizar sua senha"
              : "Link inválido ou expirado";

  return (
    <section className={styles.section} aria-labelledby="password-recovery-title">
      <div className={styles.card} data-status={status}>
        <div className={styles.statusRow}>
          <span className={styles.symbol} aria-hidden="true">
            {statusSymbol(status)}
          </span>
          <div>
            <p className={styles.eyebrow}>Birthly · Recuperação de senha</p>
            <h1 id="password-recovery-title" className={styles.title}>
              {title}
            </h1>
          </div>
        </div>

        <p className={styles.detail} aria-live="polite">
          {pageState.message}
        </p>

        {status === "ready" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="new-password">Nova senha</label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-describedby="password-help"
              />
              <p id="password-help" className={styles.help}>
                Use pelo menos 8 caracteres, com uma letra e um número.
              </p>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm-password">Confirme sua nova senha</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </div>

            {formMessage && (
              <p className={styles.formMessage} role="alert">
                {formMessage}
              </p>
            )}

            <button className="button coral-button" type="submit" disabled={submitting}>
              {submitting ? "Atualizando..." : "Atualizar senha"}
            </button>
          </form>
        )}

        {status === "success" && (
          <div className={styles.actions}>
            <a className="button coral-button" href={BIRTHLY_PRODUCT.routes.openApp()}>
              Abrir ou instalar o Birthly
            </a>
            <a className="text-link" href={BIRTHLY_PRODUCT.routes.support()}>
              Precisa de ajuda?
            </a>
          </div>
        )}

        {(status === "invalid" || status === "error" || status === "unavailable") && (
          <div className={styles.actions}>
            <a className="button" href={BIRTHLY_PRODUCT.routes.support()}>
              Falar com o suporte
            </a>
            <a className="text-link" href={BIRTHLY_PRODUCT.routes.home()}>
              Voltar ao Birthly
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
