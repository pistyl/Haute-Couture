export default function manifest() {
  return {
    name: "Haute Couture - créer, gérer et livrer",
    short_name: "Haute Couture",
    description: "Système de suivi et gestion de commandes d'inspiration sénégalaise. Fiches clients, mesures, broderies d'or, basin, wax, facturation et gestion de stock.",
    start_url: "/",
    display: "standalone",
    background_color: "#12100E",
    theme_color: "#D4AF37",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };
}
