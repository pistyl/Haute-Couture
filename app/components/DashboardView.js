import React, { useMemo } from 'react';
import Icon from './Icons';

export default function DashboardView({ data, stats, updateOrderStatus, setActiveTab, setSelectedClientId, darkMode }) {
  
  const urgentDeliveries = useMemo(() => {
    return data.orders
      .filter(o => o.status !== "Livrée")
      .sort((a, b) => new Date(a.dateDelivery) - new Date(b.dateDelivery))
      .slice(0, 3);
  }, [data.orders]);

  const lowStockItems = useMemo(() => {
    return data.stock.filter(item => item.quantity <= item.alertThreshold);
  }, [data.stock]);

  const getClientName = (clientId) => {
    const client = data.clients.find(c => c.id === clientId);
    return client ? client.name : "Client Inconnu";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Nouvelle': return 'bg-charcoal border-brass text-brass';
      case 'En coupe': return 'bg-thioup-dark/40 border-thioup text-thioup-light';
      case 'En couture': return 'bg-terracotta-dark/30 border-terracotta text-terracotta-light';
      case 'Essayage': return 'bg-purple-900/30 border-purple-500 text-purple-300';
      case 'Prête': return 'bg-vertSenegal-dark/30 border-vertSenegal text-vertSenegal-light';
      case 'Livrée': return 'bg-vertSenegal/25 border-vertSenegal text-white';
      default: return 'bg-gray-800 border-gray-600 text-gray-300';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Active Orders */}
        <div className={`p-5 sm:p-6 rounded flex items-center justify-between shadow-sm border transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light text-white' : 'bg-white border-gray-200 text-charcoal'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Commandes en Cours</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-brass">{stats.activeOrders}</h3>
          </div>
          <div className="bg-brass/10 p-2.5 sm:p-3 rounded-full text-brass">
            <Icon name="orders" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className={`p-5 sm:p-6 rounded flex items-center justify-between shadow-sm border transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light text-white' : 'bg-white border-gray-200 text-charcoal'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chiffre d'Affaires</span>
            <h3 className="font-mono text-xl sm:text-2xl font-bold mt-1 text-brass">{stats.totalRevenue.toLocaleString()} {data.config.devise}</h3>
          </div>
          <div className="bg-brass/10 p-2.5 sm:p-3 rounded-full text-brass">
            <Icon name="billing" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Advances */}
        <div className={`p-5 sm:p-6 rounded flex items-center justify-between shadow-sm border transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light text-white' : 'bg-white border-gray-200 text-charcoal'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Acomptes Encaissés</span>
            <h3 className="font-mono text-xl sm:text-2xl font-bold mt-1 text-vertSenegal-light">{stats.totalAdvance.toLocaleString()} {data.config.devise}</h3>
          </div>
          <div className="bg-vertSenegal/10 p-2.5 sm:p-3 rounded-full text-vertSenegal">
            <Icon name="check" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Outstanding Balances */}
        <div className={`p-5 sm:p-6 rounded flex items-center justify-between shadow-sm border transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light text-white' : 'bg-white border-gray-200 text-charcoal'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solde Restant Dû</span>
            <h3 className="font-mono text-xl sm:text-2xl font-bold mt-1 text-terracotta">{stats.totalRemaining.toLocaleString()} {data.config.devise}</h3>
          </div>
          <div className="bg-terracotta/10 p-2.5 sm:p-3 rounded-full text-terracotta">
            <Icon name="info" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* PROCHAINES LIVRAISONS */}
        <div className={`p-5 sm:p-6 rounded flex flex-col justify-between shadow-sm border transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <div className={`flex items-center justify-between mb-4 border-b pb-2 ${darkMode ? 'border-charcoal-light' : 'border-gray-200'}`}>
              <h4 className="font-serif text-lg text-brass font-semibold flex items-center gap-2">
                <Icon name="ruler" className="w-5 h-5 text-brass" />
                <span className={darkMode ? 'text-white' : 'text-charcoal-dark'}>Prochaines Livraisons</span>
              </h4>
              <button onClick={() => setActiveTab("orders")} className="text-xs text-brass hover:underline font-mono">Tout voir</button>
            </div>

            {urgentDeliveries.length === 0 ? (
              <p className={`text-sm italic py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucune commande en cours de fabrication.</p>
            ) : (
              <div className="space-y-4">
                {urgentDeliveries.map(order => {
                  const today = new Date();
                  const delDate = new Date(order.dateDelivery);
                  const diffTime = delDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const isUrgent = diffDays <= 4;

                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isUrgent
                          ? 'border-rougeSenegal/60 bg-rougeSenegal/10'
                          : darkMode
                          ? 'border-charcoal-light bg-charcoal-light/30'
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedClientId(order.clientId);
                              setActiveTab("clients");
                            }}
                            className={`font-medium text-sm hover:underline text-left ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}
                          >
                            {getClientName(order.clientId)}
                          </button>
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.description}</p>
                        <p className={`text-[11px] font-mono ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Livraison prévue le : <strong className={isUrgent ? 'text-rougeSenegal-light font-bold' : darkMode ? 'text-gray-300' : 'text-gray-700'}>{order.dateDelivery}</strong> {isUrgent && `(J-${diffDays})`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {order.status !== "Prête" && (
                          <button
                            onClick={() => {
                              const steps = ["Nouvelle", "En coupe", "En couture", "Essayage", "Prête", "Livrée"];
                              const currentIdx = steps.indexOf(order.status);
                              if (currentIdx < steps.length - 1) {
                                updateOrderStatus(order.id, steps[currentIdx + 1]);
                              }
                            }}
                            className="bg-brass hover:bg-brass-light text-charcoal px-3 py-1.5 text-xs rounded font-medium flex items-center gap-1 transition-colors"
                          >
                            <span>Suivant</span>
                            <Icon name="chevronRight" className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ALERTE STOCKS */}
        <div className={`p-5 sm:p-6 rounded flex flex-col justify-between shadow-sm border transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <div className={`flex items-center justify-between mb-4 border-b pb-2 ${darkMode ? 'border-charcoal-light' : 'border-gray-200'}`}>
              <h4 className="font-serif text-lg text-rougeSenegal-light font-semibold flex items-center gap-2">
                <Icon name="alert" className="w-5 h-5 text-rougeSenegal-light animate-pulse" />
                <span className="text-rougeSenegal-light">Alerte de Stock Bas</span>
              </h4>
              <button onClick={() => setActiveTab("stock")} className="text-xs text-brass hover:underline font-mono">Gérer le stock</button>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-vertSenegal">
                <Icon name="check" className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Tout le stock est suffisant ! Excellent travail.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map(item => (
                  <div key={item.id} className="p-3 bg-rougeSenegal/10 border border-rougeSenegal/40 rounded flex items-center justify-between">
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}>{item.name}</span>
                      <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type: {item.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm text-rougeSenegal-light font-bold block">{item.quantity} {item.unit}</span>
                      <span className={`text-[10px] font-mono block ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Alerte sous {item.alertThreshold} {item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* AFRICA/SENEGAL-INSPIRED COUTURE ATELIER GUIDE */}
      <div className={`p-5 sm:p-6 rounded border transition-colors ${
        darkMode ? 'bg-charcoal border-charcoal-light text-gray-400' : 'bg-white border-gray-200 text-gray-600'
      }`}>
        <h4 className={`font-serif text-lg text-brass font-semibold mb-3 ${darkMode ? '' : 'text-brass-dark'}`}>Guide de l'Atelier Baobab</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm leading-relaxed">
          <div className="space-y-1">
            <span className={`font-bold font-serif block ${darkMode ? 'text-brass' : 'text-brass-dark'}`}>1. Fiches Clients & Basin</span>
            <p>Renseignez l'annuaire client et leurs 10 mesures anatomiques indispensables pour la coupe parfaite des Grands Boubous et robes Wax.</p>
          </div>
          <div className="space-y-1">
            <span className={`font-bold font-serif block ${darkMode ? 'text-brass' : 'text-brass-dark'}`}>2. Suivi de Broderie & Coupe</span>
            <p>Faites progresser chaque habit par les étapes de l'atelier (En coupe ➔ En couture ➔ Essayage), et affectez le travail aux artisans brodeurs.</p>
          </div>
          <div className="space-y-1">
            <span className={`font-bold font-serif block ${darkMode ? 'text-brass' : 'text-brass-dark'}`}>3. Factures de Fête & Fournitures</span>
            <p>Générez des reçus de couture imprimables style étiquette vintage et surveillez le niveau de stock en Basin, fils de soie et brocarts.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
