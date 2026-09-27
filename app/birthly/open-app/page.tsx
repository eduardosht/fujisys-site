import type { Metadata } from "next";
import OpenBirthlyPage from "@/src/components/pages/OpenBirthlyPage";
import { configuredStoreLinks } from "@/src/lib/openAppNavigation.mjs";

export const metadata: Metadata = {
  title: "Abrir Birthly | Fuji Sys",
  description: "Abra o aplicativo Birthly ou veja como instalá-lo.",
};

export default function Page() {
  const storeLinks = configuredStoreLinks(
    process.env.NEXT_PUBLIC_BIRTHLY_IOS_URL,
    process.env.NEXT_PUBLIC_BIRTHLY_ANDROID_URL,
  );
  return <OpenBirthlyPage storeLinks={storeLinks} />;
}
