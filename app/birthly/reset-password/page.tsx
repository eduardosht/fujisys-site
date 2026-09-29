import type { Metadata } from "next";
import BirthlyPasswordRecoveryPage from "@/src/products/birthly/components/BirthlyPasswordRecoveryPage";

export const metadata: Metadata = {
  title: "Redefinir senha do Birthly | Fuji Sys",
  description: "Crie uma nova senha para voltar ao aplicativo Birthly.",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BirthlyPasswordRecoveryPage />;
}
