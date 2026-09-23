import type { Metadata } from "next";
import PrivacyPage from "@/src/components/pages/PrivacyPage";

export const metadata: Metadata = {
  title: "Política de Privacidade | Fuji Sys",
  description:
    "Política de privacidade oficial do aplicativo Birthly, da Fuji Sys.",
};

export default function Page() {
  return <PrivacyPage />;
}
