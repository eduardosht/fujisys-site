import type { Metadata } from "next";
import HomePage from "@/src/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Fuji Sys — Soluções digitais com propósito",
  description:
    "A Fuji Sys transforma problemas reais em produtos digitais simples, criativos e bem entregues.",
};

export default function Page() {
  return <HomePage />;
}
