"use client";

import { useEffect, useRef, useState } from "react";
import type { ConfirmationStatus } from "@/src/lib/emailConfirmation.mjs";
import {
  buildFallbackAppUrl,
  confirmationReturnPath,
  consumeFallbackResult,
} from "@/src/lib/openAppNavigation.mjs";
import type { StoreLink } from "@/src/lib/openAppNavigation.mjs";
import { SITE } from "@/src/lib/site";
import styles from "./OpenBirthlyPage.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function OpenBirthlyPage({ storeLinks }: { storeLinks: StoreLink[] }) {
  const [status, setStatus] = useState<ConfirmationStatus>("unknown");
  const consumed = useRef(false);

  useEffect(() => {
    if (consumed.current) return;
    consumed.current = true;
    try {
      setStatus(consumeFallbackResult(window.sessionStorage));
    } catch {
      // Storage can be unavailable; the neutral link is already rendered.
    }
  }, []);

  return (
    <section className={styles.section} aria-labelledby="open-app-title">
      <div className={styles.card}>
        <p className={styles.eyebrow}>Birthly · Abrir aplicativo</p>
        <h1 id="open-app-title" className={styles.title}>Vamos abrir o Birthly?</h1>
        <p className={styles.detail}>
          Toque no botão para voltar ao aplicativo. Se ele ainda não estiver instalado, use um dos links de loja disponíveis abaixo.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={buildFallbackAppUrl(status)}>Abrir Birthly</a>
          <a className={styles.secondary} href={confirmationReturnPath(basePath, SITE.routes.confirmEmail)}>
            Voltar à confirmação de e-mail
          </a>
        </div>
        {storeLinks.length > 0 && (
          <div className={styles.stores} aria-label="Instalar Birthly">
            <p>Ou instale o Birthly:</p>
            <div className={styles.storeLinks}>
              {storeLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
