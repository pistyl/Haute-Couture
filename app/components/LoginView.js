import React, { useState } from 'react';

export default function LoginView({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [atelierName, setAtelierName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { email, password, atelierName } 
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal relative overflow-hidden font-serif p-4">
      {/* Background abstract glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brass/10 filter blur-3xl animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rougeSenegal/5 filter blur-3xl animate-pulse duration-[6000ms]" />
      
      {/* Form Container */}
      <div className="w-full max-w-md bg-charcoal-dark/70 border border-charcoal-light rounded-2xl shadow-2xl p-8 backdrop-blur-md relative z-10 animate-fade-in">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-block border-b border-brass pb-2 mb-2">
            <h1 className="font-serif text-3xl tracking-wider text-brass font-bold leading-tight">
              Haute Couture
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-widest text-brass opacity-60 mt-1">
              créer, gérer et livrer
            </p>
          </div>
          <p className="text-sm font-sans text-gray-400 mt-2">
            {isRegister ? "Créez votre atelier et gérez votre clientèle" : "Gérez vos fiches de mesures, commandes et stocks"}
          </p>
        </div>

        {error && (
          <div className="bg-rougeSenegal/10 border border-rougeSenegal-light text-rougeSenegal-light text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2 font-sans">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Nom de votre Atelier</label>
              <input
                type="text"
                required
                value={atelierName}
                onChange={(e) => setAtelierName(e.target.value)}
                placeholder="Ex: Atelier Baobab"
                className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-all font-serif"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Adresse Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tailleur@baobab.com"
              className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-all font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Mot de Passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass hover:bg-brass-light text-charcoal font-bold font-serif py-3.5 rounded-lg transition-all shadow-lg hover:shadow-brass/20 disabled:opacity-50 mt-6"
          >
            {loading ? "Chargement..." : isRegister ? "Créer mon Atelier" : "Se Connecter"}
          </button>
        </form>

        <div className="text-center mt-6 font-sans text-sm text-gray-400">
          {isRegister ? (
            <p>
              Déjà un compte ?{" "}
              <button 
                onClick={() => { setIsRegister(false); setError(""); }} 
                className="text-brass hover:underline hover:text-brass-light font-semibold"
              >
                Se connecter
              </button>
            </p>
          ) : (
            <p>
              Nouveau ici ?{" "}
              <button 
                onClick={() => { setIsRegister(true); setError(""); }} 
                className="text-brass hover:underline hover:text-brass-light font-semibold"
              >
                Créer un compte
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
