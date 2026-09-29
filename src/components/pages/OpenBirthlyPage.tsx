"use client";

import { useEffect, useRef, useState } from "react";
import type { ConfirmationStatus } from "@/src/lib/emailConfirmation.mjs";
import {
  buildAppUrl,
  buildFallbackAppUrl,
  confirmationReturnPath,
  consumeFallbackResult,
  openAppInstruction,
} from "@/src/lib/openAppNavigation.mjs";
import type { StoreLink } from "@/src/lib/openAppNavigation.mjs";
import { SITE } from "@/src/lib/site";
import styles from "./OpenBirthlyPage.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function OpenBirthlyPage({ storeLinks }: { storeLinks: StoreLink[] }) {
  const [status, setStatus] = useState<ConfirmationStatus>("unknown");
  const [isEmailConfirmationFlow, setIsEmailConfirmationFlow] = useState(false);
  const consumed = useRef(false);

  useEffect(() => {
    if (consumed.current) return;
    consumed.current = true;
    const search = window.location.search;
    const isConfirmation = new URLSearchParams(search).get("source") === "email-confirmation";
    setIsEmailConfirmationFlow(isConfirmation);
    if (search || window.location.hash) {
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }
    if (!isConfirmation) return;
    try {
      setStatus(consumeFallbackResult(window.sessionStorage, search));
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
          {openAppInstruction(storeLinks)}
        </p>
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={isEmailConfirmationFlow ? buildFallbackAppUrl(status) : buildAppUrl()}
          >
            Abrir Birthly
          </a>
          <a
            className={styles.secondary}
            href={isEmailConfirmationFlow
              ? confirmationReturnPath(basePath, SITE.routes.confirmEmail)
              : `${basePath}${SITE.routes.birthday}`}
          >
            {isEmailConfirmationFlow ? "Voltar à confirmação de e-mail" : "Voltar ao Birthly"}
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
