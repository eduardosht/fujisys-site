import type { Metadata } from "next";
import { InstitutionalPrivacyPage } from "@/src/components/pages/Content";

export const metadata: Metadata = {
  title: "Política de Privacidade | Fuji Sys",
  description: "Política de privacidade institucional da Fuji Sys.",
};

export default function Page() {
  return <InstitutionalPrivacyPage />;
}
