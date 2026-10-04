"use client";

import { useEffect, useState } from "react";
import { assetPath } from "../lib/site";

type Slide = "push" | "card";

const SLIDE_DURATION = 8000;
const PROGRESS_TICK = 50;

const slides = {
  push: {
    eyebrow: "Um lembrete na hora certa",
    title: "Push notifications para lembrar.",
    description: "O Birthly lembra você das datas importantes para que o cuidado não dependa só da memória.",
  },
  card: {
    eyebrow: "Uma lembrança para compartilhar",
    title: "Cartões que guardam um momento.",
    description: "Escolha uma foto, escreva sua mensagem e assine do seu jeito para compartilhar algo feito por você.",
  },
} as const;

export function BirthlyFeatureShowcase() {
  const [slide, setSlide] = useState<Slide>("push");
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const current = slides[slide];
  const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setElapsed((value) => Math.min(value + PROGRESS_TICK, SLIDE_DURATION));
    }, PROGRESS_TICK);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    if (elapsed < SLIDE_DURATION) return;

    setElapsed(0);
    setSlide((value) => value === "push" ? "card" : "push");
  }, [elapsed]);

  const pausePresentation = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPaused(true);
  };

  const resumePresentation = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsPaused(false);
  };

  return (
    <div className="birthday-feature-showcase-content" data-slide={slide} data-paused={isPaused}>
      <div className="birthday-card-copy birthday-feature-copy" aria-live="polite">
        <p className="section-index">{current.eyebrow}</p>
        <h2 id="birthday-card-title">{current.title}</h2>
        <p>{current.description}</p>
      </div>

      <div
        className={"birthday-card-stage" + (isPaused ? " is-paused" : "")}
        onPointerDown={pausePresentation}
        onPointerUp={resumePresentation}
        onPointerCancel={resumePresentation}
        aria-label="Área da apresentação. Pressione e segure para pausar."
      >
        {slide === "push" ? (
          <video
            key="push"
            className="birthday-feature-media birthday-feature-video"
            src={assetPath("/birthday/examples/push-notification.mp4")}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-label="Demonstração das notificações push do Birthly"
          />
        ) : (
          <img
            key="card"
            className="birthday-feature-media birthday-card-image"
            src={assetPath("/birthday/examples/leandro-birthday-card.jpeg")}
            alt="Exemplo de cartão de aniversário do Birthly"
          />
        )}
      </div>

      <div className="birthday-feature-controller">
        <div
          className="birthday-feature-progress"
          role="progressbar"
          aria-label={slide === "push" ? "Tempo da feature de notificações push" : "Tempo da feature de cartão compartilhado"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <span className="birthday-feature-progress-fill" style={{ width: progress + "%" }} />
        </div>
      </div>
    </div>
  );
}
