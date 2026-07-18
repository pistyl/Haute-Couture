import React, { useMemo, useEffect, useState } from 'react';
import Icon from './Icons';

export default function ClientsView({ data, selectedClientId, setSelectedClientId, search, setSearch, onAdd, onEdit, onDelete, setActiveTab, darkMode }) {
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  const filteredClients = useMemo(() => {
    return data.clients.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  }, [data.clients, search]);

  const selectedClient = data.clients.find(c => c.id === selectedClientId) || filteredClients[0] || null;

  // Sync mobile view on selection change if needed
  useEffect(() => {
    if (!selectedClientId && filteredClients.length > 0) {
      setSelectedClientId(filteredClients[0].id);
    }
  }, [selectedClientId, filteredClients, setSelectedClientId]);

  const clientOrders = useMemo(() => {
    if (!selectedClient) return [];
    return data.orders.filter(o => o.clientId === selectedClient.id);
  }, [data.orders, selectedClient]);

  return (
    <div className="h-full">
      {/* Mobile back button */}
      {showDetailMobile && selectedClient && (
        <button
          onClick={() => setShowDetailMobile(false)}
          className={`lg:hidden mb-4 border text-brass px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors self-start ${
            darkMode ? 'bg-charcoal-light border-charcoal-light hover:bg-charcoal' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Icon name="chevronRight" className="w-3.5 h-3.5 rotate-180" />
          <span>← Retour à la liste des clients</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start animate-fade-in">
        
        {/* CLIENTS DIRECTORY & SEARCH */}
        <div className={`lg:col-span-1 border p-5 sm:p-6 rounded flex flex-col h-[70vh] shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between mb-4 pb-2 border-b ${darkMode ? 'border-charcoal-light' : 'border-gray-200'}`}>
            <h3 className={`font-serif text-lg font-bold ${darkMode ? 'text-brass' : 'text-brass-dark'}`}>Annuaire Clients</h3>
            <button
              onClick={onAdd}
              className="bg-brass hover:bg-brass-light text-charcoal px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Icon name="plus" className="w-3.5 h-3.5" strokeWidth={3} />
              <span>Nouveau</span>
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher nom ou tél..."
              className={`w-full text-sm rounded pl-3 pr-8 py-2 focus:outline-none focus:border-brass font-mono ${
                darkMode ? 'bg-charcoal-light border-charcoal-light text-white' : 'bg-gray-100 border-gray-200 text-charcoal'
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-brass">
              <Icon name="scissors" className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredClients.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-8">Aucun client trouvé.</p>
            ) : (
              filteredClients.map(c => {
                const isActive = selectedClient && selectedClient.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedClientId(c.id);
                      setShowDetailMobile(true);
                    }}
                    className={`w-full text-left p-3 rounded transition-all duration-300 border ${
                      isActive
                        ? 'bg-brass/25 border-brass text-white'
                        : darkMode
                        ? 'bg-charcoal-light/20 hover:bg-charcoal-light/50 border-transparent text-gray-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-100 text-charcoal-dark'
                    }`}
                  >
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className={`text-xs font-mono mt-0.5 ${isActive ? 'text-brass' : 'text-gray-500'}`}>{c.phone}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* INDIVIDUAL CLIENT BESPOKE PAPER FICHE & MEASUREMENTS */}
        <div className={`lg:col-span-2 space-y-6 ${
          !showDetailMobile ? 'hidden lg:block' : 'block'
        }`}>
          {selectedClient ? (
            <div className="space-y-6">
              
              <div className="stitch-border paper-texture bg-cream text-charcoal rounded shadow-2xl p-5 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M90 10 L40 60 C35 65, 30 70, 20 80 M40 60 C42 58, 48 55, 60 55 C70 55, 80 65, 75 75 C70 85, 55 80, 55 70" stroke="#D2A679" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="85" cy="15" r="2" fill="#D2A679" />
                  </svg>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-brass/30 pb-4 sm:pb-6 mb-6">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-brass font-bold">Fiche de Mesure Client</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mt-1 text-charcoal-dark">{selectedClient.name}</h2>
                    <div className="flex items-center gap-2 mt-2 text-xs font-mono text-gray-600">
                      <Icon name="phone" className="w-3.5 h-3.5 text-brass-dark" />
                      <span>{selectedClient.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => onEdit(selectedClient)}
                      className="bg-charcoal hover:bg-charcoal-light text-cream px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-charcoal-light"
                    >
                      <Icon name="edit" className="w-3.5 h-3.5 text-brass" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => onDelete(selectedClient.id)}
                      className="bg-rougeSenegal hover:bg-rougeSenegal-light text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-serif text-md sm:text-lg font-bold border-b border-brass/20 pb-2 mb-4 text-brass-dark uppercase tracking-wider">
                    Fiche des Mesures (cm)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                    {[
                      { key: 'poitrine', label: 'Poitrine' },
                      { key: 'taille', label: 'Taille' },
                      { key: 'hanches', label: 'Hanches' },
                      { key: 'epaules', label: 'Épaules' },
                      { key: 'manches', label: 'Manches' },
                      { key: 'longueurPantalon', label: 'Long. Pantalon' },
                      { key: 'entrejambe', label: 'Entrejambe' },
                      { key: 'cou', label: 'Tour de Cou' },
                      { key: 'hauteurBuste', label: 'Ht. Buste' },
                      { key: 'poignet', label: 'Poignet' }
                    ].map(item => (
                      <div key={item.key} className="bg-cream-dark/40 border border-brass/20 p-2.5 rounded text-center">
                        <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase block font-medium tracking-tight mb-1">{item.label}</span>
                        <span className="font-mono text-md sm:text-lg font-bold text-charcoal-dark bg-cream px-2 py-0.5 rounded shadow-sm border border-brass/10">
                          {selectedClient.measurements?.[item.key] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="mt-6 bg-cream-dark/30 border border-brass/10 p-4 rounded-sm">
                    <h4 className="font-serif text-sm font-bold text-brass-dark mb-1">Notes d'Atelier & Finitions :</h4>
                    <p className="text-xs text-gray-700 italic leading-relaxed whitespace-pre-line">{selectedClient.notes}</p>
                  </div>
                )}
              </div>

              {/* Order History */}
              <div className={`p-5 sm:p-6 rounded border shadow-sm transition-colors ${
                darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-serif text-lg font-bold mb-4 border-b pb-2 ${darkMode ? 'text-brass border-charcoal-light' : 'text-brass-dark border-gray-200'}`}>
                  Historique des Commandes
                </h3>
                {clientOrders.length === 0 ? (
                  <p className={`text-xs italic py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucune commande pour ce client.</p>
                ) : (
                  <div className="space-y-3">
                    {clientOrders.map(order => (
                      <div key={order.id} className={`p-3 border rounded flex items-center justify-between text-xs gap-3 ${
                        darkMode ? 'bg-charcoal-light/30 border-charcoal-light text-gray-300' : 'bg-gray-50 border-gray-100 text-charcoal'
                      }`}>
                        <div>
                          <span className={`font-medium block ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}>{order.description}</span>
                          <span className={`font-mono mt-1 block ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Créée : {order.dateOrdered} | Livraison : {order.dateDelivery}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-mono text-brass font-medium">{order.price} {data.config.devise}</span>
                          <button
                            onClick={() => {
                              setActiveTab("orders");
                            }}
                            className="text-brass hover:text-brass-light hover:underline font-mono"
                          >
                            Suivre
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className={`text-center py-16 border rounded transition-colors ${
              darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
            }`}>
              <Icon name="clients" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="font-serif text-lg text-gray-400 font-bold">Aucun Client Sélectionné</h3>
              <p className="text-sm text-gray-500 mt-1">Sélectionnez un client dans l'annuaire ou créez-en un nouveau.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
