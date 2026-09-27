"use client";

import { useEffect, useRef, useState } from "react";
import type { ConfirmationStatus } from "@/src/lib/emailConfirmation.mjs";
import {
  buildConfirmationFallbackUrl,
  openBirthly,
  processConfirmationCallback,
} from "@/src/lib/emailConfirmationNavigation.mjs";
import { SITE } from "@/src/lib/site";
import styles from "./EmailConfirmationPage.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const callbackPath = `${basePath}${SITE.routes.confirmEmail}`;

const content: Record<ConfirmationStatus, { label: string; title: string; detail: string; symbol: string }> = {
  success: {
    label: "E-mail confirmado",
    title: "Seu e-mail foi confirmado.",
    detail: "Agora você pode voltar ao Birthly e continuar de onde parou.",
    symbol: "✓",
  },
  error: {
    label: "Não foi possível confirmar",
    title: "A confirmação não deu certo.",
    detail: "Volte ao Birthly para solicitar um novo e-mail de confirmação.",
    symbol: "!",
  },
  unknown: {
    label: "Confirmação de e-mail",
    title: "Vamos voltar ao Birthly?",
    detail: "Não recebemos um resultado de confirmação nesta página. Abra o app para continuar.",
    symbol: "?",
  },
};

export default function EmailConfirmationPage() {
  const [status, setStatus] = useState<ConfirmationStatus>("unknown");
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const result = processConfirmationCallback(window, callbackPath);
    if (result) setStatus(result.status);
  }, []);

  const message = content[status];

  return (
    <section className={styles.section} aria-labelledby="confirmation-title">
      <div className={styles.card} data-status={status}>
        <div className={styles.symbol} aria-hidden="true">{message.symbol}</div>
        <p className={styles.eyebrow}>Birthly · Confirmação de e-mail</p>
        <p className={styles.status}>{message.label}</p>
        <h1 id="confirmation-title" className={styles.title}>{message.title}</h1>
        <p className={styles.detail}>{message.detail}</p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => openBirthly(window, status, callbackPath)}
          >
            Abrir Birthly
          </button>
          <a
            className={styles.secondary}
            href={buildConfirmationFallbackUrl(basePath, SITE.routes.openApp, status)}
            onClick={() => processConfirmationCallback(window, callbackPath)}
          >
            Não abriu? Veja como abrir ou instalar
          </a>
          <a
            className={styles.secondary}
            href={`${basePath}${SITE.routes.birthday}`}
            onClick={() => processConfirmationCallback(window, callbackPath)}
          >
            Continuar no navegador
          </a>
        </div>
      </div>
    </section>
  );
}
