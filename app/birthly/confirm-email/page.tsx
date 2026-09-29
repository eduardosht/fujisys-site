import type { Metadata } from "next";
import EmailConfirmationPage from "@/src/components/pages/EmailConfirmationPage";

export const metadata: Metadata = {
  title: "Confirmação de e-mail do Birthly | Fuji Sys",
  description: "Confira o resultado da confirmação de e-mail e volte ao Birthly.",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EmailConfirmationPage />;
}
