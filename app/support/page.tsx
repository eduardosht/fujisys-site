import type { Metadata } from "next";
import { InstitutionalSupportPage } from "@/src/components/pages/Content";

export const metadata: Metadata = {
  title: "Suporte | Fuji Sys",
  description: "Entre em contato com a Fuji Sys.",
};

export default function Page() {
  return <InstitutionalSupportPage />;
}
