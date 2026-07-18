import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata = {
  title: "Haute Couture - créer, gérer et livrer",
  description: "Système de suivi et gestion de commandes d'inspiration sénégalaise. Fiches clients, mesures, broderies d'or, basin, wax, facturation et gestion de stock.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${plusJakarta.variable} h-full bg-charcoal text-white font-sans antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
