import type { Metadata } from 'next';
import { Outfit, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthRoleProvider } from '@/context/AuthRoleContext';
import { IssueProvider } from '@/context/IssueContext';
import { SocketProvider } from '@/context/SocketContext';
import { RealtimeToast } from '@/components/RealtimeToast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const siliguri = Hind_Siliguri({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-siliguri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NagarChitra (নগরচিত্র) | Bangladesh Civic Intelligence & Issue Tracking',
  description:
    'See the Problem. Report the Problem. Track the Change. A citizen-driven civic intelligence and public issue resolution tracking platform for Dhaka and Bangladesh.',
  keywords: [
    'NagarChitra',
    'Dhaka civic complaints',
    'road damage Dhaka',
    'DNCC issue tracker',
    'WASA waterlogging',
    'civic data Bangladesh',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${siliguri.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-accent/30 selection:text-primary">
        <LanguageProvider>
          <AuthRoleProvider>
            <SocketProvider>
              <IssueProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <RealtimeToast />
              </IssueProvider>
            </SocketProvider>
          </AuthRoleProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
