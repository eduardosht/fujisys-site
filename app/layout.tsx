import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/src/components/SiteFooter";
import { SiteHeader } from "@/src/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fuji Sys — Soluções digitais com propósito",
  description:
    "A Fuji Sys transforma problemas reais em produtos digitais simples, criativos e bem entregues.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
