import React, { useState, useEffect } from 'react';

export default function LoginView({ initialPlan = "FREE", onLoginSuccess, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [atelierName, setAtelierName] = useState("");
  const [plan, setPlan] = useState(initialPlan);
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wave");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // States for resuming pending payment
  const [pendingUser, setPendingUser] = useState(null); // { userId, email, plan }

  useEffect(() => {
    if (initialPlan) {
      setPlan(initialPlan);
      if (initialPlan !== "FREE") {
        setIsRegister(true);
      }
    }
  }, [initialPlan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { email, password, atelierName, plan, phone, paymentMethod } 
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 403 && data.code === 'SUBSCRIPTION_PENDING') {
          // Store pending user info to show payment resume page
          setPendingUser({
            userId: data.userId,
            email: data.email,
            plan: data.plan
          });
          setPhone("");
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Une erreur est survenue");
      }

      if (data.pendingPayment && data.redirectUrl) {
        // Redirect user directly to the UnitechPay checkout
        window.location.href = data.redirectUrl;
      } else {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePendingPaySubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!phone) {
      setError("Veuillez renseigner votre numéro de téléphone.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/subscribe-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: pendingUser.userId,
          phone,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("Lien de redirection introuvable.");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getPlanDetails = (planKey) => {
    switch (planKey) {
      case 'MONTHLY':
      case 'PLAN_MENSUEL':
        return { name: "Plan Mensuel", price: "10 000 F", duration: "/ mois" };
      case 'QUARTERLY':
      case 'PLAN_TRIMESTRIEL':
        return { name: "Plan Trimestriel", price: "25 000 F", duration: "/ 3 mois" };
      default:
        return { name: "Essai Gratuit", price: "0 F", duration: "/ 14 jours" };
    }
  };

  const planDetails = getPlanDetails(pendingUser ? pendingUser.plan : plan);

  if (pendingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal relative overflow-hidden font-serif p-4">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brass/10 filter blur-3xl animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rougeSenegal/5 filter blur-3xl animate-pulse duration-[6000ms]" />
        
        <div className="w-full max-w-md bg-charcoal-dark/70 border border-brass/20 rounded-2xl shadow-2xl p-8 backdrop-blur-md relative z-10 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-brass">Règlement requis</h1>
            <p className="text-xs text-gray-400 font-sans mt-2">
              Votre atelier a été créé. Pour l'activer, veuillez finaliser le paiement de votre abonnement.
            </p>
          </div>

          {error && (
            <div className="bg-rougeSenegal/10 border border-rougeSenegal-light text-rougeSenegal-light text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2 font-sans">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="bg-charcoal-light/30 border border-charcoal-light rounded-xl p-4 mb-6 font-sans text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Atelier :</span>
              <span className="text-white font-bold">{pendingUser.email}</span>
            </div>
            <div className="flex justify-between border-t border-charcoal-light pt-2 mt-2">
              <span className="text-gray-400">Formule :</span>
              <span className="text-brass font-bold">{planDetails.name}</span>
            </div>
            <div className="flex justify-between border-t border-charcoal-light pt-2 mt-2">
              <span className="text-gray-400">Montant :</span>
              <span className="text-white font-bold">{planDetails.price}</span>
            </div>
          </div>

          <form onSubmit={handlePendingPaySubmit} className="space-y-4 font-sans text-left">
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Opérateur</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wave")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all ${
                    paymentMethod === "wave"
                      ? "border-brass bg-brass/10 text-white font-semibold"
                      : "border-charcoal-light bg-charcoal-light/30 text-gray-400 hover:border-brass/30 hover:text-white"
                  }`}
                >
                  <img src="/wave-logo.png" alt="Wave" className="w-4 h-4 rounded-sm object-cover" />
                  <span className="text-xs font-sans">Wave</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("orange")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all ${
                    paymentMethod === "orange"
                      ? "border-brass bg-brass/10 text-white font-semibold"
                      : "border-charcoal-light bg-charcoal-light/30 text-gray-400 hover:border-brass/30 hover:text-white"
                  }`}
                >
                  <img src="/orange-logo.png" alt="Orange" className="w-4 h-4 rounded-sm object-cover" />
                  <span className="text-xs font-sans">Orange</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Numéro de Téléphone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 771234567"
                className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brass hover:bg-brass-light text-charcoal font-bold font-serif py-3.5 rounded-lg transition-all shadow-lg shadow-brass/10 disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></span>
                  <span>Initialisation...</span>
                </>
              ) : (
                <span>Payer {planDetails.price} avec UnitechPay</span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => { setPendingUser(null); setError(""); }}
              className="w-full border border-charcoal-light text-gray-400 hover:text-white py-2.5 rounded-lg text-xs font-bold transition-all text-center"
            >
              Retour à la connexion
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal relative overflow-hidden font-serif p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brass/10 filter blur-3xl animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rougeSenegal/5 filter blur-3xl animate-pulse duration-[6000ms]" />
      
      <div className="w-full max-w-md bg-charcoal-dark/70 border border-charcoal-light rounded-2xl shadow-2xl p-8 backdrop-blur-md relative z-10 animate-fade-in">
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="absolute top-4 left-4 text-xs font-mono text-gray-500 hover:text-white transition-colors"
          >
            ← Retour
          </button>
        )}
        
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
            {isRegister ? "Créez votre atelier et gérez votre clientèle" : "Gerez vos fiches de mesures, commandes et stocks"}
          </p>
        </div>

        {error && (
          <div className="bg-rougeSenegal/10 border border-rougeSenegal-light text-rougeSenegal-light text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2 font-sans">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-sans text-left">
          
          {/* Plan Selector visible during signup */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Abonnement choisi</label>
              <select
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setError("");
                }}
                className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-brass font-semibold text-sm px-4 py-3 focus:outline-none focus:border-brass transition-all cursor-pointer font-serif"
              >
                <option value="FREE">Essai Gratuit (14 jours - 0 F)</option>
                <option value="MONTHLY">Plan Mensuel (10 000 F / mois)</option>
                <option value="QUARTERLY">Plan Trimestriel (25 000 F / 3 mois)</option>
              </select>
            </div>
          )}

          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Nom de votre Atelier</label>
              <input
                type="text"
                required
                value={atelierName}
                onChange={(e) => setAtelierName(e.target.value)}
                placeholder="Ex: Atelier Baobab"
                className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass transition-all font-serif"
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
              className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass transition-all font-mono"
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
              className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass transition-all font-mono"
            />
          </div>

          {/* Additional fields for paid registration plan */}
          {isRegister && plan !== "FREE" && (
            <div className="border-t border-charcoal-light/40 pt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Opérateur</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wave")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all ${
                      paymentMethod === "wave"
                        ? "border-brass bg-brass/10 text-white font-semibold"
                        : "border-charcoal-light bg-charcoal-light/30 text-gray-400 hover:border-brass/30 hover:text-white"
                    }`}
                  >
                    <img src="/wave-logo.png" alt="Wave" className="w-4 h-4 rounded-sm object-cover" />
                    <span className="text-xs font-sans">Wave</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("orange")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all ${
                      paymentMethod === "orange"
                        ? "border-brass bg-brass/10 text-white font-semibold"
                        : "border-charcoal-light bg-charcoal-light/30 text-gray-400 hover:border-brass/30 hover:text-white"
                    }`}
                  >
                    <img src="/orange-logo.png" alt="Orange" className="w-4 h-4 rounded-sm object-cover" />
                    <span className="text-xs font-sans">Orange</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Numéro de Téléphone (Mobile Money)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 771234567"
                  className="w-full bg-charcoal-light/60 border border-charcoal-light rounded-lg text-white text-sm px-4 py-3 focus:outline-none focus:border-brass transition-all font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass hover:bg-brass-light text-charcoal font-bold font-serif py-3.5 rounded-lg transition-all shadow-lg hover:shadow-brass/20 disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></span>
                <span>Traitement...</span>
              </>
            ) : (
              <span>
                {isRegister 
                  ? (plan === "FREE" ? "Créer mon Atelier (Gratuit)" : `Payer ${planDetails.price} & S'inscrire`)
                  : "Se Connecter"}
              </span>
            )}
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
