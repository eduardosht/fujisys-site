import type { Metadata } from 'next';
import AuthCallbackPage from '@/components/pages/AuthCallbackPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  referrer: 'no-referrer',
  robots: { index: false, follow: false },
  other: { 'birthly-app-store-url': SITE.downloads.appStore },
};

export default function AuthCallbackRoute() {
  return <AuthCallbackPage />;
}
