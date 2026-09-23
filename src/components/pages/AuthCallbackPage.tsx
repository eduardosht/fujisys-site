"use client";

import { useEffect, useState } from "react";
import {
  buildMobileConfirmationUrl,
  classifyAuthCallback,
  safeAuthErrorMessage,
} from "../../lib/auth-callback";
import { SITE } from "../../lib/site";

type CallbackStatus = "success" | "error" | "direct";

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function SupportLink() {
  return (
    <a href={`mailto:${SITE.email}?subject=Suporte%20Birthly`}>
      {SITE.email}
    </a>
  );
}

function ExternalDownloads() {
  const links = [
    { href: SITE.downloads.appStore, label: "Baixar na App Store" },
    { href: SITE.downloads.googlePlay, label: "Baixar no Google Play" },
  ].filter(({ href }) => isHttpsUrl(href));

  if (links.length === 0) return null;

  return (
    <nav className="auth-callback-external-links" aria-label="Downloads do Birthly">
      {links.map(({ href, label }) => (
        <a className="text-link" href={href} key={href} rel="noreferrer">
          {label}
        </a>
      ))}
    </nav>
  );
}

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<CallbackStatus | null>(null);
  const [mobileUrl, setMobileUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const { search, hash, pathname } = window.location;
    const sanitizedMobileUrl = buildMobileConfirmationUrl(search, hash);
    const nextStatus = classifyAuthCallback(search, hash);

    setMobileUrl(sanitizedMobileUrl);
    setStatus(nextStatus);
    setMessage(safeAuthErrorMessage(search, hash));
    window.history.replaceState({}, document.title, pathname);
  }, []);

  const title =
    status === "success"
      ? "E-mail confirmado com sucesso"
      : status === "error"
        ? "Não foi possível confirmar seu e-mail"
        : "Confirmação de e-mail";

  return (
    <section className="auth-callback-page" aria-labelledby="auth-callback-title">
      <div className="auth-callback-card">
        <div className="auth-callback-status" aria-live="polite">
          <span className="auth-callback-status-icon" aria-hidden="true">
            {status === "success" ? "✓" : status === "error" ? "!" : "•"}
          </span>
          <p className="auth-callback-status-text eyebrow">Birthly · confirmação</p>
        </div>

        <h1 id="auth-callback-title">{title}</h1>

        {status === null && (
          <p className="lede">Verificando o link de confirmação...</p>
        )}

        {status === "success" && (
          <>
            <p className="lede">
              Sua conta está pronta. Volte ao Birthly para continuar.
            </p>
            <div className="auth-callback-actions">
              {mobileUrl && (
                <a className="button coral-button" href={mobileUrl} rel="noreferrer">
                  Abrir no Birthly
                </a>
              )}
              <ExternalDownloads />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <p className="lede">{message}</p>
            <div className="auth-callback-actions">
              <a className="button" href={SITE.routes.home}>
                Voltar ao site
              </a>
              <p className="auth-callback-support">
                Precisa de ajuda? <SupportLink />
              </p>
            </div>
          </>
        )}

        {status === "direct" && (
          <>
            <p className="lede">{message}</p>
            <div className="auth-callback-actions">
              <a className="button" href={SITE.routes.home}>
                Ir para o site
              </a>
              <a className="text-link" href={SITE.routes.support}>
                Ver suporte
              </a>
              <p className="auth-callback-support">
                Fale com a gente: <SupportLink />
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
