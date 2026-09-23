import type { Metadata } from "next";
import BirthlyPage from "@/src/components/pages/BirthlyPage";

export const metadata: Metadata = {
  title: "Birthly — Datas importantes por perto | Fuji Sys",
  description:
    "Conheça o Birthly, um jeito simples e cuidadoso de manter datas importantes por perto.",
};

export default function Page() {
  return <BirthlyPage />;
}
