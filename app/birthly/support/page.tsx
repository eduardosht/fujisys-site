import type { Metadata } from "next";
import SupportPage from "@/src/components/pages/SupportPage";

export const metadata: Metadata = {
  title: "Suporte do Birthly | Fuji Sys",
  description:
    "Suporte oficial em português do Brasil para o aplicativo Birthly.",
};

export default function Page() {
  return <SupportPage />;
}
