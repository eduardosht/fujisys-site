import type { Metadata } from "next";
import { TermsPage } from "@/src/components/pages/Content";

export const metadata: Metadata = {
  title: "Termos de Uso | Fuji Sys",
  description: "Termos de Uso oficiais do aplicativo Birthly, da Fuji Sys.",
};

export default function Page() {
  return <TermsPage />;
}
