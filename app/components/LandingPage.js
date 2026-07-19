import React, { useState } from "react";
import Icon from "./Icons";

// --- SUB-COMPONENT: GARMENT SVG SIMULATOR ---
function GarmentPreview({ type, poitrine, epaules, hauteur }) {
  // Normalize parameters relative to baseline measurements
  const scaleX = Math.max(0.7, Math.min(1.3, epaules / 45));
  const scaleY = Math.max(0.7, Math.min(1.3, hauteur / 130));
  const chestScale = Math.max(0.7, Math.min(1.3, poitrine / 95));

  if (type === "boubou") {
    return (
      <svg
        viewBox="0 0 200 240"
        className="w-full h-56 text-brass stroke-current fill-none transition-all duration-300"
      >
        {/* Sewing grid silhouette */}
        <path
          d={`M ${100 - 80 * scaleX} 20 L ${100 + 80 * scaleX} 20 L ${100 + 80 * scaleX} ${20 + 180 * scaleY} L ${100 - 80 * scaleX} ${20 + 180 * scaleY} Z`}
          className="fill-charcoal-light/10 stroke-brass/10"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* Traditional Grand Boubou Shape */}
        <path
          d={`M ${100 - 75 * scaleX} 35 
              C ${100 - 40 * scaleX} 30, ${100 + 40 * scaleX} 30, ${100 + 75 * scaleX} 35 
              L ${100 + 70 * scaleX} ${35 + 160 * scaleY} 
              C ${100 + 35 * scaleX} ${35 + 165 * scaleY}, ${100 - 35 * scaleX} ${35 + 165 * scaleY}, ${100 - 70 * scaleX} ${35 + 160 * scaleY} Z`}
          className="fill-brass/5 stroke-brass"
          strokeWidth="2"
        />
        {/* Traditional circular neckline */}
        <path
          d="M 85 35 C 85 52, 115 52, 115 35"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Central golden embroidery panel (Plastron) */}
        <path
          d={`M 92 48 L 108 48 L 106 ${48 + 50 * chestScale} L 100 ${58 + 50 * chestScale} L 94 ${48 + 50 * chestScale} Z`}
          className="fill-brass/25 stroke-brass"
          strokeWidth="1.5"
        />
        <line
          x1="100"
          y1="58"
          x2="100"
          y2={`${58 + 90 * scaleY}`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Sleeve fold/stitch indicators */}
        <path
          d={`M ${100 - 55 * scaleX} 35 L ${100 - 55 * scaleX} ${35 + 140 * scaleY}`}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="opacity-40"
        />
        <path
          d={`M ${100 + 55 * scaleX} 35 L ${100 + 55 * scaleX} ${35 + 140 * scaleY}`}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="opacity-40"
        />

        {/* Measurement arrows */}
        <text
          x="100"
          y="15"
          className="fill-brass text-[9px] font-mono text-center"
          textAnchor="middle"
        >
          Épaules: {epaules}cm
        </text>
        <line
          x1={`${100 - 75 * scaleX}`}
          y1="23"
          x2={`${100 + 75 * scaleX}`}
          y2="23"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d={`M ${100 - 75 * scaleX} 20 L ${100 - 75 * scaleX} 26 M ${100 + 75 * scaleX} 20 L ${100 + 75 * scaleX} 26`}
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (type === "robe") {
    return (
      <svg
        viewBox="0 0 200 240"
        className="w-full h-56 text-terracotta stroke-current fill-none transition-all duration-300"
      >
        {/* Grid outline */}
        <path
          d={`M ${100 - 55 * scaleX} 20 L ${100 + 55 * scaleX} 20 L ${100 + 70 * scaleX} ${20 + 190 * scaleY} L ${100 - 70 * scaleX} ${20 + 190 * scaleY} Z`}
          className="fill-charcoal-light/10 stroke-terracotta/10"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* Fitted Dress Bodice */}
        <path
          d={`M 100 30 
              L ${100 - 24 * scaleX} 35 
              C ${100 - 24 * scaleX} 55, ${100 - 22 * chestScale} 75, ${100 - 16 * chestScale} 95 
              Q 100 100, ${100 + 16 * chestScale} 95 
              C ${100 + 22 * chestScale} 75, ${100 + 24 * scaleX} 55, ${100 + 24 * scaleX} 35 Z`}
          className="fill-terracotta/5 stroke-terracotta"
          strokeWidth="2"
        />
        {/* Flared Wax Skirt */}
        <path
          d={`M ${100 - 16 * chestScale} 95 
              C ${100 - 22 * chestScale} 125, ${100 - 48 * scaleX} 165, ${100 - 54 * scaleX} ${40 + 160 * scaleY} 
              C ${100 - 22 * scaleX} ${46 + 160 * scaleY}, ${100 + 22 * scaleX} ${46 + 160 * scaleY}, ${100 + 54 * scaleX} ${40 + 160 * scaleY} 
              C ${100 + 48 * scaleX} 165, ${100 + 22 * chestScale} 125, ${100 + 16 * chestScale} 95 Z`}
          className="fill-terracotta/15 stroke-terracotta"
          strokeWidth="2"
        />
        {/* Collar line */}
        <path
          d="M 88 35 C 92 45, 108 45, 112 35"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Wax Pattern details */}
        <path
          d={`M 100 95 Q 92 125, ${100 - 20 * scaleX} ${40 + 160 * scaleY}`}
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="3 3"
          className="opacity-60"
        />
        <path
          d={`M 100 95 Q 108 125, ${100 + 20 * scaleX} ${40 + 160 * scaleY}`}
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="3 3"
          className="opacity-60"
        />

        {/* Measurement indicators */}
        <text
          x="100"
          y="15"
          className="fill-terracotta text-[9px] font-mono text-center"
          textAnchor="middle"
        >
          Poitrine: {poitrine}cm
        </text>
        <line
          x1={`${100 - 24 * chestScale}`}
          y1="23"
          x2={`${100 + 24 * chestScale}`}
          y2="23"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  // Saharienne in Thioup
  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-56 text-thioup-light stroke-current fill-none transition-all duration-300"
    >
      {/* Pattern Grid */}
      <path
        d={`M ${100 - 65 * scaleX} 20 L ${100 + 65 * scaleX} 20 L ${100 + 65 * scaleX} ${20 + 180 * scaleY} L ${100 - 65 * scaleX} ${20 + 180 * scaleY} Z`}
        className="fill-charcoal-light/10 stroke-thioup-light/10"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {/* Tailored Jacket Body */}
      <path
        d={`M ${100 - 32 * scaleX} 35 
            L ${100 + 32 * scaleX} 35 
            L ${100 + 30 * chestScale} ${35 + 145 * scaleY} 
            L ${100 - 30 * chestScale} ${35 + 145 * scaleY} Z`}
        className="fill-thioup/5 stroke-thioup-light"
        strokeWidth="2"
      />
      {/* Sleeves with cuffs */}
      <path
        d={`M ${100 - 32 * scaleX} 35 L ${100 - 58 * scaleX} 55 L ${100 - 48 * scaleX} ${55 + 75 * scaleY} L ${100 - 31 * chestScale} 90`}
        stroke="currentColor"
        strokeWidth="2"
        className="fill-thioup/10"
      />
      <path
        d={`M ${100 + 32 * scaleX} 35 L ${100 + 58 * scaleX} 55 L ${100 + 48 * scaleX} ${55 + 75 * scaleY} L ${100 + 31 * chestScale} 90`}
        stroke="currentColor"
        strokeWidth="2"
        className="fill-thioup/10"
      />

      {/* Saharienne Collar lapels */}
      <path
        d="M 84 35 L 100 52 L 116 35 L 100 68 Z"
        className="fill-thioup-light/15"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Pockets */}
      <rect
        x={`${100 - 24 * chestScale}`}
        y="75"
        width="13"
        height="16"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x={`${100 + 11 * chestScale}`}
        y="75"
        width="13"
        height="16"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x={`${100 - 26 * chestScale}`}
        y="125"
        width="16"
        height="20"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x={`${100 + 10 * chestScale}`}
        y="125"
        width="16"
        height="20"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Buttons */}
      <line
        x1="100"
        y1="68"
        x2="100"
        y2={`${35 + 140 * scaleY}`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="100" cy="90" r="2.5" className="fill-thioup-light" />
      <circle cx="100" cy="115" r="2.5" className="fill-thioup-light" />
      <circle cx="100" cy="140" r="2.5" className="fill-thioup-light" />

      {/* Label indicator */}
      <text
        x="100"
        y="15"
        className="fill-thioup-light text-[9px] font-mono text-center"
        textAnchor="middle"
      >
        Longueur: {hauteur}cm
      </text>
      <line
        x1="25"
        y1="35"
        x2="25"
        y2={`${35 + 145 * scaleY}`}
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d={`M 22 35 L 28 35 M 22 ${35 + 145 * scaleY} L 28 ${35 + 145 * scaleY}`}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function LandingPage({ onStartAuth, onStartRegister }) {
  // --- STATE FOR FABRIC CALCULATOR ---
  const [selectedGarment, setSelectedGarment] = useState("boubou");
  const [calcMeasurements, setCalcMeasurements] = useState({
    poitrine: 98,
    epaules: 44,
    hauteur: 140,
  });

  // --- STATE FOR INTERACTIVE WALKTHROUGH TABS ---
  const [activeWalkthroughTab, setActiveWalkthroughTab] = useState("dashboard");
  const [selectedMockClient, setSelectedMockClient] = useState("cli_1");
  const [mockStock, setMockStock] = useState([
    {
      id: "stk_1",
      name: "Basin Riche Getzner Blanc",
      quantity: 6,
      unit: "mètres",
      alertThreshold: 10,
    },
    {
      id: "stk_2",
      name: "Wax Hollandais Hirondelle",
      quantity: 18,
      unit: "yards",
      alertThreshold: 12,
    },
    {
      id: "stk_3",
      name: "Tissu Thioup Indigo Artisanal",
      quantity: 4,
      unit: "mètres",
      alertThreshold: 5,
    },
  ]);

  // --- STATE FOR FAQ ---
  const [openFaq, setOpenFaq] = useState(null);

  // --- STATE FOR FINAL CTA EMAIL FORM ---
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState(null); // 'success', 'error'
  const [leadMsg, setLeadMsg] = useState("");

  // Fabric calculation formula based on sliders and garment types
  const getFabricCalculation = () => {
    const { poitrine, epaules, hauteur } = calcMeasurements;
    if (selectedGarment === "boubou") {
      const meters =
        Math.round(((hauteur * 2.8 + epaules * 1.5) / 100) * 10) / 10;
      return {
        fabric: "Basin Riche (Getzner)",
        quantity: `${meters} mètres`,
        artisan: "Moustapha Ndiaye (Maître Brodeur)",
        difficulty: "Complexe (Broderie d'Or)",
        priceEst: `${Math.round(85000 + poitrine * 600).toLocaleString()} FCFA`,
      };
    } else if (selectedGarment === "robe") {
      const yards =
        Math.round(((hauteur * 2.0 + poitrine * 0.9) / 100) * 10) / 10;
      return {
        fabric: "Wax Hollandais Véritable",
        quantity: `${yards} yards`,
        artisan: "Awa Sow (Couturière Senior)",
        difficulty: "Intermédiaire (Ajustements motifs)",
        priceEst: `${Math.round(45000 + poitrine * 400).toLocaleString()} FCFA`,
      };
    } else {
      const meters =
        Math.round(((hauteur * 1.8 + epaules * 2.2) / 100) * 10) / 10;
      return {
        fabric: "Thioup Indigo artisanal",
        quantity: `${meters} mètres`,
        artisan: "Seydou Diop (Coupeur Basin)",
        difficulty: "Haute Précision (Doublure cintrée)",
        priceEst: `${Math.round(65000 + epaules * 1000).toLocaleString()} FCFA`,
      };
    }
  };

  const calcDetails = getFabricCalculation();

  const handleSliderChange = (field, val) => {
    setCalcMeasurements((prev) => ({
      ...prev,
      [field]: parseInt(val),
    }));
  };

  const adjustMockStock = (id, delta) => {
    setMockStock((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes("@")) {
      setLeadStatus("error");
      setLeadMsg("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    setLeadStatus("success");
    setLeadMsg(
      "✨ Invitation envoyée ! Vérifiez votre boîte mail pour démarrer.",
    );
    setLeadEmail("");
    setTimeout(() => {
      setLeadStatus(null);
      setLeadMsg("");
    }, 5000);
  };

  return (
    <div className="h-screen overflow-y-auto bg-charcoal text-gray-100 font-sans selection:bg-brass selection:text-charcoal relative overflow-x-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div
          className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-brass/5 filter blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full bg-rougeSenegal/3 filter blur-3xl animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-thioup/5 filter blur-3xl" />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="relative z-20 border-b border-charcoal-light backdrop-blur-md bg-charcoal-dark/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="border-b border-brass pb-1">
              <span className="font-serif text-2xl tracking-wider text-brass font-bold leading-tight flex items-center gap-2">
                <Icon
                  name="scissors"
                  className="w-6 h-6 text-brass rotate-90"
                />
                Haute Couture
              </span>
              <p className="font-mono text-[8px] uppercase tracking-widest text-brass opacity-60">
                créer, gérer et livrer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onStartAuth}
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={onStartRegister}
              className="bg-brass hover:bg-brass-light text-charcoal px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-brass/20 scale-100 hover:scale-102"
            >
              Créer mon Atelier
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brass/30 bg-brass/5 text-brass text-xs font-mono tracking-wider">
            <span></span> L'excellence de la couture digitale
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-white">
            Gérez votre atelier avec <span className="text-brass">art</span> et{" "}
            <span className="text-brass">précision</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed font-serif">
            Haute Couture est la solution SaaS tout-en-un conçue pour les
            maîtres tailleurs et créateurs de mode d'exception. Centralisez vos
            fiches de mesures, suivez la fabrication de vos pièces en temps
            réel, et pilotez vos stocks sans effort.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={onStartRegister}
              className="w-full sm:w-auto bg-brass hover:bg-brass-light text-charcoal px-8 py-4 rounded-xl text-base font-bold transition-all shadow-xl hover:shadow-brass/25 hover:scale-103 text-center"
            >
              Commencer l'Essai Gratuit (14j)
            </button>
            <button
              onClick={onStartAuth}
              className="w-full sm:w-auto border border-charcoal-light hover:border-brass/50 bg-charcoal-light/30 hover:bg-charcoal-light/50 px-8 py-4 rounded-xl text-base font-medium transition-all text-center text-white"
            >
              Accéder à l'Atelier
            </button>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-mono pt-4">
            <div className="flex items-center gap-1">✔ Sans carte bancaire</div>
            <div className="flex items-center gap-1">
              ✔ Configuration immédiate
            </div>
          </div>
        </div>

        {/* Hero Mockup Frame */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brass/10 to-rougeSenegal/5 rounded-2xl filter blur-xl opacity-30 animate-pulse" />
          <div className="relative border border-charcoal-light bg-charcoal-dark/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            {/* Window header */}
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-light mb-4">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rougeSenegal opacity-75" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-75" />
                <span className="w-3 h-3 rounded-full bg-vertSenegal opacity-75" />
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                haute-couture.app/atelier
              </span>
            </div>

            {/* Simulated UI list of orders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded bg-charcoal/60 border border-charcoal-light hover:border-brass/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brass/10 flex items-center justify-center text-brass font-bold text-xs">
                    FD
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-serif font-bold text-white">
                      Fatou Diome
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                      Basin Getzner d'or
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-brass/10 border border-brass/30 text-brass">
                  En Couture
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-charcoal/60 border border-charcoal-light hover:border-brass/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brass/10 flex items-center justify-center text-brass font-bold text-xs">
                    AF
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-serif font-bold text-white">
                      Amadou Fall
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                      Grand Boubou 3 pièces
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-500/10 border border-yellow-500/30 text-yellow-500">
                  En Coupe
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-charcoal/60 border border-charcoal-light opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brass/10 flex items-center justify-center text-brass font-bold text-xs">
                    RD
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-serif font-bold text-white">
                      Rokhaya Diallo
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                      Robe Wax Hirondelle
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-vertSenegal/10 border border-vertSenegal/30 text-vertSenegal">
                  Livrée
                </span>
              </div>
            </div>

            {/* Quick stock warning */}
            <div className="mt-4 p-3 rounded-lg border border-rougeSenegal/30 bg-rougeSenegal/5 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <span className="text-rougeSenegal text-xs">⚠️</span>
                <span className="text-[10px] font-mono text-gray-400">
                  Alerte : Basin Riche (Stock Bas)
                </span>
              </div>
              <span className="text-[10px] text-white font-mono font-bold">
                18m restants
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE BESPOKE SIMULATOR */}
      <section className="relative z-10 py-24 border-t border-charcoal-light bg-charcoal-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              L'Atelier Virtuel : Estimez et visualisez vos créations
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
              Ajustez les mesures en temps réel pour générer une estimation de
              métrage de tissu, identifier l'artisan idéal de votre atelier, et
              voir le patron géométrique s'adapter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Simulator Inputs (Left) */}
            <div className="lg:col-span-5 p-6 rounded-2xl border border-charcoal-light bg-charcoal-dark/80 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-brass font-serif text-lg font-bold mb-4">
                  1. Choisissez le Modèle
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "boubou", label: "Boubou Basin", icon: "scissors" },
                    { id: "robe", label: "Robe Wax", icon: "clients" },
                    {
                      id: "saharienne",
                      label: "Saharienne Thioup",
                      icon: "orders",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedGarment(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                        selectedGarment === item.id
                          ? "border-brass bg-brass/10 text-brass"
                          : "border-charcoal-light bg-charcoal hover:border-gray-500 text-gray-400"
                      }`}
                    >
                      <Icon name={item.icon} className="w-5 h-5 mb-1.5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-brass font-serif text-lg font-bold">
                  2. Ajustez les Mesures (cm)
                </h3>

                {/* Chest Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Tour de Poitrine</span>
                    <span className="text-white font-bold">
                      {calcMeasurements.poitrine} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="130"
                    value={calcMeasurements.poitrine}
                    onChange={(e) =>
                      handleSliderChange("poitrine", e.target.value)
                    }
                    className="w-full h-1 bg-charcoal rounded-lg appearance-none cursor-pointer accent-brass"
                  />
                </div>

                {/* Shoulders Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Largeur d'Épaules</span>
                    <span className="text-white font-bold">
                      {calcMeasurements.epaules} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="60"
                    value={calcMeasurements.epaules}
                    onChange={(e) =>
                      handleSliderChange("epaules", e.target.value)
                    }
                    className="w-full h-1 bg-charcoal rounded-lg appearance-none cursor-pointer accent-brass"
                  />
                </div>

                {/* Height Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Hauteur Totale / Robe</span>
                    <span className="text-white font-bold">
                      {calcMeasurements.hauteur} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="165"
                    value={calcMeasurements.hauteur}
                    onChange={(e) =>
                      handleSliderChange("hauteur", e.target.value)
                    }
                    className="w-full h-1 bg-charcoal rounded-lg appearance-none cursor-pointer accent-brass"
                  />
                </div>
              </div>

              <div className="border-t border-charcoal-light pt-4 text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                <span className="text-brass">💡</span>
                <span>
                  Ces calculs automatisent l'achat du tissu pour vos tailleurs.
                </span>
              </div>
            </div>

            {/* Simulator Output View (Right) */}
            <div className="lg:col-span-7 rounded-2xl border-2 border-dashed border-brass/40 bg-charcoal/50 paper-texture p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-2 right-2 border border-brass/20 px-2 py-0.5 rounded text-[8px] font-mono text-brass uppercase tracking-widest bg-charcoal/80">
                Patron Dynamique
              </div>

              {/* Dynamic SVG Visual */}
              <div className="flex-1 w-full flex items-center justify-center bg-charcoal-dark/50 rounded-xl p-4 border border-charcoal-light shadow-inner relative">
                <GarmentPreview
                  type={selectedGarment}
                  poitrine={calcMeasurements.poitrine}
                  epaules={calcMeasurements.epaules}
                  hauteur={calcMeasurements.hauteur}
                />
              </div>

              {/* Calculated Specs */}
              <div className="flex-1 w-full space-y-4">
                <div className="border-b border-charcoal-light pb-2">
                  <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider block">
                    Tissu Recommandé
                  </span>
                  <span className="font-serif text-lg font-bold text-white">
                    {calcDetails.fabric}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-mono block">
                      Métrage requis
                    </span>
                    <span className="text-sm font-bold text-brass font-mono">
                      {calcDetails.quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase font-mono block">
                      Difficulté coupe
                    </span>
                    <span className="text-xs font-bold text-gray-200">
                      {calcDetails.difficulty}
                    </span>
                  </div>
                </div>

                <div className="border-t border-charcoal-light pt-3">
                  <span className="text-[9px] text-gray-500 uppercase font-mono block">
                    Artisan assignable suggéré
                  </span>
                  <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-brass animate-pulse" />
                    {calcDetails.artisan}
                  </span>
                </div>

                <div className="p-3 rounded bg-brass/5 border border-brass/20 flex justify-between items-center mt-2">
                  <span className="text-[10px] font-mono text-brass">
                    Prix Estimé Couture :
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    {calcDetails.priceEst}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="relative z-10 py-24 border-t border-charcoal-light bg-charcoal-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Une suite d'outils façonnés pour les professionnels
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dites adieu aux carnets de mesures papier et aux stocks mal
              comptabilisés. Haute Couture structure les tâches quotidiennes de
              votre atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-charcoal-light bg-charcoal/50 hover:border-brass/30 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center text-brass mb-4 group-hover:bg-brass group-hover:text-charcoal transition-all">
                <Icon name="clients" className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Fiches Clients & Mesures
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Enregistrez les fiches anthropométriques détaillées (poitrine,
                longueur de manche, épaules, tour de cou, etc.) et accédez-y en
                un clic lors des essayages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-charcoal-light bg-charcoal/50 hover:border-brass/30 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center text-brass mb-4 group-hover:bg-brass group-hover:text-charcoal transition-all">
                <Icon name="orders" className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Suivi de Fabrication
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Suivez la progression de chaque vêtement à travers les étapes de
                l'atelier : "En coupe", "En couture", "À l'essayage", et "Livré"
                à vos clients.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-charcoal-light bg-charcoal/50 hover:border-brass/30 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center text-brass mb-4 group-hover:bg-brass group-hover:text-charcoal transition-all">
                <Icon name="billing" className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Factures & Acomptes
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Générez des reçus propres avec le calcul automatique du solde
                restant à payer sur chaque commande d'atelier.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-charcoal-light bg-charcoal/50 hover:border-brass/30 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center text-brass mb-4 group-hover:bg-brass group-hover:text-charcoal transition-all">
                <Icon name="stock" className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Alerte de Stock Bas
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Gerez vos tissus (Wax, Basin) et fournitures (fils, boutons).
                Recevez une alerte visuelle instantanée dès qu'une ressource
                franchit le seuil critique.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-charcoal-light bg-charcoal/50 hover:border-brass/30 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center text-brass mb-4 group-hover:bg-brass group-hover:text-charcoal transition-all">
                <Icon name="chart" className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Statistiques & CA
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Visualisez la santé financière de votre atelier avec des
                indicateurs de chiffre d'affaires, acomptes encaissés et
                commandes en cours.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-charcoal-light bg-charcoal/50 hover:border-brass/30 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center text-brass mb-4 group-hover:bg-brass group-hover:text-charcoal transition-all">
                <Icon name="settings" className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Multi-tenancy Total
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Chaque artisan dispose de son compte sécurisé avec sa
                configuration d'atelier, ses propres artisans assignables et ses
                bases de clients isolées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE WALKTHROUGH TABS */}
      <section className="relative z-10 py-24 border-t border-charcoal-light bg-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Visite Guidée : Prenez les commandes de l'Atelier
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explorez ci-dessous comment l'interface s'anime au quotidien dans
              votre travail de création.
            </p>
          </div>

          <div className="max-w-5xl mx-auto border border-charcoal-light bg-charcoal-dark/90 rounded-2xl overflow-hidden shadow-2xl">
            {/* Tabs Header */}
            <div className="flex border-b border-charcoal-light bg-charcoal/80">
              {[
                {
                  id: "dashboard",
                  label: "Tableau de Bord",
                  icon: "dashboard",
                },
                { id: "clients", label: "Fiches Clients", icon: "clients" },
                { id: "stock", label: "Gestion des Stocks", icon: "stock" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWalkthroughTab(tab.id)}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all ${
                    activeWalkthroughTab === tab.id
                      ? "bg-brass/10 text-brass border-b-2 border-brass"
                      : "text-gray-400 hover:text-white hover:bg-charcoal/40"
                  }`}
                >
                  <Icon name={tab.icon} className="w-4 h-4 text-brass" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="p-6 sm:p-8 min-h-[320px] flex flex-col justify-between">
              {/* Tab 1: Dashboard View */}
              {activeWalkthroughTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base font-bold text-white">
                        Chiffres de l'Atelier Baobab
                      </h4>
                      <p className="text-xs text-gray-500">
                        Données en direct de ce mois
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-vertSenegal/10 border border-vertSenegal/30 text-vertSenegal px-2 py-0.5 rounded">
                      En hausse (+12%)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-charcoal p-4 rounded-xl border border-charcoal-light">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">
                        Chiffre d'Affaires
                      </span>
                      <span className="text-xl font-bold font-mono text-brass">
                        355 000 FCFA
                      </span>
                    </div>
                    <div className="bg-charcoal p-4 rounded-xl border border-charcoal-light">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">
                        Acomptes Encaissés
                      </span>
                      <span className="text-xl font-bold font-mono text-vertSenegal">
                        195 000 FCFA
                      </span>
                    </div>
                    <div className="bg-charcoal p-4 rounded-xl border border-charcoal-light">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">
                        Soldes à Récupérer
                      </span>
                      <span className="text-xl font-bold font-mono text-rougeSenegal">
                        160 000 FCFA
                      </span>
                    </div>
                  </div>

                  {/* Simulated Activity Feed */}
                  <div className="bg-charcoal/50 p-4 rounded-xl border border-charcoal-light">
                    <h5 className="text-xs font-bold text-gray-300 mb-2.5">
                      Activités Récentes
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brass" />
                          Broderie terminée sur le Boubou de Fatou Diome
                        </span>
                        <span className="text-[10px] font-mono text-gray-600">
                          il y a 10 min
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          Acompte de 60 000 FCFA enregistré pour Amadou Fall
                        </span>
                        <span className="text-[10px] font-mono text-gray-600">
                          il y a 2h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Clients View */}
              {activeWalkthroughTab === "clients" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Client List Selection */}
                  <div className="md:col-span-5 space-y-2.5 text-left">
                    <h4 className="font-serif text-sm font-bold text-white mb-2">
                      Sélectionnez un profil
                    </h4>
                    {[
                      {
                        id: "cli_1",
                        name: "Fatou Diome",
                        orders: "1 commande",
                      },
                      {
                        id: "cli_2",
                        name: "Amadou Fall",
                        orders: "2 commandes",
                      },
                    ].map((cli) => (
                      <button
                        key={cli.id}
                        onClick={() => setSelectedMockClient(cli.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs transition-all ${
                          selectedMockClient === cli.id
                            ? "bg-brass/5 border-brass text-brass"
                            : "bg-charcoal border-charcoal-light text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <span className="font-bold">{cli.name}</span>
                        <span className="text-[10px] font-mono">
                          {cli.orders}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Dynamic Client Measurement Card */}
                  <div className="md:col-span-7 bg-charcoal/50 p-5 rounded-xl border border-charcoal-light stitch-border paper-texture relative text-left">
                    {selectedMockClient === "cli_1" ? (
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-brass/25 pb-2">
                          <div>
                            <h4 className="font-serif font-bold text-white text-sm">
                              Fiche de Mesures : Fatou Diome
                            </h4>
                            <p className="text-[10px] text-gray-500">
                              +221 77 123 45 67
                            </p>
                          </div>
                          <span className="text-[10px] font-serif italic text-brass">
                            Dernière mise à jour : hier
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Poitrine
                            </span>
                            <span className="text-white font-bold">98 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Taille
                            </span>
                            <span className="text-white font-bold">76 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Hanches
                            </span>
                            <span className="text-white font-bold">108 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Épaules
                            </span>
                            <span className="text-white font-bold">42 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Manches
                            </span>
                            <span className="text-white font-bold">60 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Longueur
                            </span>
                            <span className="text-white font-bold">142 cm</span>
                          </div>
                        </div>
                        <div className="bg-charcoal/60 p-2.5 rounded border border-charcoal-light text-[10px] text-gray-400 leading-relaxed italic">
                          "Préfère les broderies d'or complexes le long du
                          plastron. Basin riche Getzner blanc uniquement."
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-brass/25 pb-2">
                          <div>
                            <h4 className="font-serif font-bold text-white text-sm">
                              Fiche de Mesures : Amadou Fall
                            </h4>
                            <p className="text-[10px] text-gray-500">
                              +221 78 987 65 43
                            </p>
                          </div>
                          <span className="text-[10px] font-serif italic text-brass">
                            Dernière mise à jour : il y a 5 jours
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Poitrine
                            </span>
                            <span className="text-white font-bold">110 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Taille
                            </span>
                            <span className="text-white font-bold">96 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Hanches
                            </span>
                            <span className="text-white font-bold">112 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Épaules
                            </span>
                            <span className="text-white font-bold">50 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Tour Cou
                            </span>
                            <span className="text-white font-bold">44 cm</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 block">
                              Pantalon
                            </span>
                            <span className="text-white font-bold">104 cm</span>
                          </div>
                        </div>
                        <div className="bg-charcoal/60 p-2.5 rounded border border-charcoal-light text-[10px] text-gray-400 leading-relaxed italic">
                          "Demande un grand boubou classique 3 pièces très
                          ample. Teinture indigo thioup artisanale uniquement."
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Stock View */}
              {activeWalkthroughTab === "stock" && (
                <div className="space-y-6">
                  <div className="text-left">
                    <h4 className="font-serif text-base font-bold text-white">
                      Inventaire & Alertes Seuils
                    </h4>
                    <p className="text-xs text-gray-500">
                      Cliquez sur +/- pour simuler les entrées/sorties de
                      l'atelier et tester le déclenchement des alertes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {mockStock.map((item) => {
                      const isLow = item.quantity <= item.alertThreshold;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-charcoal rounded-xl border border-charcoal-light"
                        >
                          <div className="flex-1 min-w-0 pr-4 text-left">
                            <span className="text-xs font-serif font-bold text-white block truncate">
                              {item.name}
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">
                              Seuil critique d'alerte : {item.alertThreshold}{" "}
                              {item.unit}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Alert Badge */}
                            {isLow ? (
                              <span className="bg-rougeSenegal/10 border border-rougeSenegal/30 text-rougeSenegal px-2 py-0.5 rounded text-[10px] font-mono font-bold animate-pulse">
                                ⚠️ STOCK BAS
                              </span>
                            ) : (
                              <span className="bg-vertSenegal/10 border border-vertSenegal/30 text-vertSenegal px-2 py-0.5 rounded text-[10px] font-mono">
                                Correct
                              </span>
                            )}

                            {/* Quantity Control */}
                            <div className="flex items-center gap-2 bg-charcoal-dark border border-charcoal-light rounded p-1">
                              <button
                                onClick={() => adjustMockStock(item.id, -2)}
                                className="w-5 h-5 text-gray-400 hover:text-white rounded bg-charcoal hover:bg-charcoal-light flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold w-12 text-center text-white">
                                {item.quantity} {item.unit.slice(0, 3)}
                              </span>
                              <button
                                onClick={() => adjustMockStock(item.id, 2)}
                                className="w-5 h-5 text-gray-400 hover:text-white rounded bg-charcoal hover:bg-charcoal-light flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom CTA to trigger registration inside mockup */}
              <div className="border-t border-charcoal-light pt-6 mt-6 flex justify-end">
                <button
                  onClick={onStartRegister}
                  className="bg-brass text-charcoal hover:bg-brass-light font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow"
                >
                  <span>Créer mon compte pour configurer mes fiches</span>
                  <Icon name="chevronRight" className="w-4 h-4 text-charcoal" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="relative z-10 py-24 border-t border-charcoal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Des abonnements simples, adaptés à votre croissance
            </h2>
            <p className="text-gray-400 text-sm">
              Démarrez gratuitement pour tester les fonctionnalités, puis
              choisissez l'abonnement qui vous correspond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* PLAN 1: Free Trial */}
            <div className="border border-charcoal-light bg-charcoal/40 rounded-2xl p-8 flex flex-col justify-between hover:border-brass/20 transition-all">
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Essai Gratuit
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Idéal pour démarrer
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif font-bold text-white">
                    0 F
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    / 14 jours
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-gray-400 font-sans border-t border-charcoal-light pt-6">
                  <li className="flex items-center gap-2">
                    ✔ Accès à toutes les fonctionnalités
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Fiches clients et mesures illimitées
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Alertes de stock activées
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Pas de carte de crédit requise
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onStartRegister("FREE")}
                className="mt-8 w-full border border-charcoal-light hover:border-brass/50 text-white bg-charcoal-light/20 hover:bg-charcoal-light/40 py-3 rounded-lg text-xs font-bold transition-all"
              >
                Lancer mon essai
              </button>
            </div>

            {/* PLAN 2: Monthly (Recommended) */}
            <div className="border border-brass bg-charcoal-dark/90 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative hover:scale-102 transition-all">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-brass text-charcoal text-[9px] font-mono font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                Recommandé
              </div>
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-lg font-serif font-bold text-brass">
                    Plan Mensuel
                  </h3>
                  <p className="text-xs text-brass/75 font-mono mt-1">
                    Pour les ateliers actifs
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif font-bold text-white">
                    10 000 F
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    / mois
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-gray-300 font-sans border-t border-charcoal-light pt-6">
                  <li className="flex items-center gap-2 text-brass">
                    ✔ Tout ce qui est dans l'essai gratuit
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Base de données persistante
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Export et imports des données
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Support réactif 24/7
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onStartRegister("MONTHLY")}
                className="mt-8 w-full bg-brass hover:bg-brass-light text-charcoal py-3 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-brass/25"
              >
                S'abonner au plan
              </button>
            </div>

            {/* PLAN 3: 3 Months */}
            <div className="border border-charcoal-light bg-charcoal/40 rounded-2xl p-8 flex flex-col justify-between hover:border-brass/20 transition-all">
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Plan Trimestriel
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Économisez 17%
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif font-bold text-white">
                    25 000 F
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    / 3 mois
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-gray-400 font-sans border-t border-charcoal-light pt-6">
                  <li className="flex items-center gap-2">
                    ✔ Avantages du plan mensuel
                  </li>
                  <li className="flex items-center gap-2 text-brass">
                    ✔ 5 000 F d'économie sur 3 mois
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Idéal pour stabiliser votre budget
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Support prioritaire
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onStartRegister("QUARTERLY")}
                className="mt-8 w-full border border-charcoal-light hover:border-brass/50 text-white bg-charcoal-light/20 hover:bg-charcoal-light/40 py-3 rounded-lg text-xs font-bold transition-all"
              >
                Choisir le trimestriel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="relative z-10 py-24 border-t border-charcoal-light bg-charcoal-dark/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl text-white">
              Questions Fréquentes
            </h2>
            <p className="text-gray-400 text-sm">
              Tout ce que vous devez savoir pour démarrer l'esprit tranquille.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {[
              {
                q: "Comment fonctionne la période d'essai de 14 jours ?",
                a: "Vous bénéficiez d'un accès complet et sans restriction à toutes les fonctionnalités de l'application (fiches clients, mesures, commandes, stocks, CA) pendant 14 jours. Aucune carte bancaire n'est requise. À la fin de cette période, vous pouvez choisir de vous abonner ou d'exporter vos données.",
              },
              {
                q: "Puis-je exporter mes données si je décide de partir ?",
                a: "Oui, absolument. Nous croyons en la souveraineté de vos données. Depuis la section de configuration de l'atelier, vous pouvez à tout moment exporter l'intégralité de vos bases de données clients, mesures et commandes dans un fichier structuré.",
              },
              {
                q: "L'application est-elle compatible avec les smartphones des tailleurs ?",
                a: "Oui. L'interface a été méticuleusement conçue pour être 100% responsive. Elle s'adapte à tous les types d'écrans : téléphones portables Android/iOS, tablettes de comptoir, et ordinateurs de bureau.",
              },
              {
                q: "Nos mesures et données clients sont-elles sécurisées ?",
                a: "Chaque atelier enregistré dispose d'un espace totalement étanche. Toutes les communications sont chiffrées et les données sont hébergées de manière sécurisée avec des sauvegardes quotidiennes automatiques.",
              },
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-charcoal-light bg-charcoal/50 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-serif font-bold text-sm sm:text-base text-white hover:bg-charcoal transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <Icon
                      name="chevronRight"
                      className={`w-5 h-5 text-brass transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  {/* Dynamic Height Transition Container */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen
                        ? "max-h-[200px] border-t border-charcoal-light bg-charcoal-dark/20"
                        : "max-h-0"
                    }`}
                  >
                    <p className="px-6 py-5 text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: PREMIUM TESTIMONIALS */}
      <section className="relative z-10 py-24 border-t border-charcoal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl text-white">
              Paroles de Couturiers
            </h2>
            <p className="text-gray-400 text-sm">
              Ils utilisent notre logiciel au quotidien pour piloter leur maison
              de couture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {[
              {
                quote:
                  "Depuis que nous utilisons Haute Couture, nous ne perdons plus aucun historique. Les mesures des clients sont archivées de manière structurée. Plus besoin de feuilleter nos vieux cahiers pendant des heures !",
                name: "Madame Ndèye Barro",
                role: "Directrice, Maison Barro (Dakar Plateau)",
                avatar: "NB",
                badge: "Basin & Wax Luxe",
              },
              {
                quote:
                  "Le suivi d'avancement par étape (Coupe, Couture, Essayage, Livré) nous a permis d'optimiser le planning de nos tailleurs et brodeurs. Le retard de livraison a été réduit à zéro, pour le plus grand bonheur de nos clients.",
                name: "Maître Seydou Sy",
                role: "Chef d'Atelier, Sartorial Sy (Saint-Louis)",
                avatar: "SS",
                badge: "Boubous Traditionnels",
              },
              {
                quote:
                  "La fonctionnalité d'alertes de stock de tissus est exceptionnelle. Plus de mauvaise surprise où le Wax commandé par un client est en rupture dans nos tiroirs. Un outil vraiment moderne et adapté à nos réalités.",
                name: "Awa Diallo",
                role: "Créatrice, Atelier Awadi (Paris / Dakar)",
                avatar: "AD",
                badge: "Création Prêt-à-Porter",
              },
            ].map((t, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-charcoal-light bg-charcoal-dark/75 hover:border-brass/35 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-brass">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="border-t border-charcoal-light mt-6 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center font-bold text-brass text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-white">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {t.role}
                    </p>
                    <span className="inline-block bg-brass/10 text-brass text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded mt-1.5 font-bold">
                      {t.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION / LEAD CAPTURE */}
      <section className="relative z-10 py-20 border-t border-charcoal-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-brass/40 bg-gradient-to-br from-charcoal-dark via-charcoal to-charcoal-light/40 p-8 sm:p-12 shadow-2xl overflow-hidden text-center space-y-6">
            <div className="absolute inset-0 bg-radial-gradient from-brass/5 to-transparent pointer-events-none" />

            <span className="inline-block text-[10px] font-mono text-brass uppercase tracking-widest border border-brass/30 px-3 py-1 rounded-full bg-charcoal/80">
              Essai Gratuit 14 Jours
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
              Prêt à numériser votre savoir-faire ?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Rejoignez des dizaines d'artisans d'exception qui modernisent la
              gestion de leur atelier de couture dès aujourd'hui.
            </p>

            <form
              onSubmit={handleLeadSubmit}
              className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3 pt-4"
            >
              <input
                type="email"
                placeholder="Saisissez votre adresse e-mail"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="w-full bg-charcoal border border-charcoal-light focus:border-brass rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brass text-white placeholder:text-gray-600 font-mono"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto flex-shrink-0 bg-brass hover:bg-brass-light text-charcoal font-bold text-sm px-6 py-3 rounded-lg transition-all shadow hover:shadow-brass/25 active:scale-95"
              >
                Rejoindre l'Atelier
              </button>
            </form>

            {leadStatus && (
              <div
                className={`text-xs font-mono font-medium max-w-md mx-auto transition-opacity duration-300 ${
                  leadStatus === "success"
                    ? "text-vertSenegal"
                    : "text-rougeSenegal"
                }`}
              >
                {leadMsg}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-charcoal-light bg-charcoal-dark/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="border-b border-brass/35 pb-1">
            <span className="font-serif text-lg tracking-wider text-brass font-bold leading-tight">
              Haute Couture
            </span>
            <p className="font-mono text-[7px] uppercase tracking-widest text-brass opacity-60">
              créer, gérer et livrer
            </p>
          </div>
          <p className="text-[10px] text-gray-600 font-mono">
            &copy; 2026 Haute Couture. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
