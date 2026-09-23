import type { Metadata } from 'next';
import AuthCallbackPage from '@/components/pages/AuthCallbackPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  referrer: 'no-referrer',
  other: { 'birthly-app-store-url': SITE.downloads.appStore },
};

export default function AuthCallbackRoute() {
  return <AuthCallbackPage />;
}
