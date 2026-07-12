import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: "Atelier Baobab - Maison de la Couture Sénégalaise",
  description: "Système de suivi et gestion de commandes d'inspiration sénégalaise. Fiches clients, mesures, broderies d'or, basin, wax, facturation et gestion de stock.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} h-full bg-charcoal text-white font-sans antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
