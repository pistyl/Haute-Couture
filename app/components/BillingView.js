import React, { useState, useEffect, useMemo } from 'react';
import Icon from './Icons';

export default function BillingView({ data, activeOrderView, setActiveOrderView, triggerNotification, updateOrderPayment, darkMode }) {
  
  const [customAdvance, setCustomAdvance] = useState("");
  const [showReceiptMobile, setShowReceiptMobile] = useState(false);

  const pendingBillingOrders = useMemo(() => {
    return data.orders.filter(o => o.status !== "Livrée" || o.advance < o.price);
  }, [data.orders]);

  const selectedOrder = data.orders.find(o => o.id === activeOrderView) || pendingBillingOrders[0] || data.orders[0] || null;

  useEffect(() => {
    if (!activeOrderView && pendingBillingOrders.length > 0) {
      setActiveOrderView(pendingBillingOrders[0].id);
    }
  }, [activeOrderView, pendingBillingOrders, setActiveOrderView]);

  const getClient = (clientId) => {
    return data.clients.find(c => c.id === clientId) || { name: "Client Inconnu", phone: "N/A" };
  };

  const handleAddPayment = () => {
    if (!selectedOrder) return;
    const inputAmount = parseFloat(customAdvance);
    if (isNaN(inputAmount) || inputAmount <= 0) {
      triggerNotification("Veuillez saisir un montant de règlement valide.", "error");
      return;
    }

    const remaining = selectedOrder.price - selectedOrder.advance;
    if (inputAmount > remaining) {
      triggerNotification(`Le versement (${inputAmount} FCFA) dépasse le solde restant dû (${remaining} FCFA).`, "error");
      return;
    }

    const newAdvance = selectedOrder.advance + inputAmount;
    updateOrderPayment(selectedOrder.id, newAdvance)
      .then(() => {
        setCustomAdvance("");
        triggerNotification(`Règlement de ${inputAmount} FCFA enregistré pour cette commande.`);
      })
      .catch(() => {});
  };

  const handleMarkAsFullyPaid = () => {
    if (!selectedOrder) return;
    updateOrderPayment(selectedOrder.id, selectedOrder.price)
      .then(() => {
        triggerNotification(`Règlement intégral de ${selectedOrder.price} FCFA enregistré.`);
      })
      .catch(() => {});
  };

  return (
    <div className="h-full">
      {/* Mobile back button */}
      {showReceiptMobile && selectedOrder && (
        <button
          onClick={() => setShowReceiptMobile(false)}
          className={`lg:hidden mb-4 border text-brass px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors self-start ${
            darkMode ? 'bg-charcoal-light border-charcoal-light hover:bg-charcoal' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Icon name="chevronRight" className="w-3.5 h-3.5 rotate-180" />
          <span>← Retour à la liste des règlements</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start animate-fade-in">
        
        {/* ORDERS BILLING LIST SELECTOR */}
        <div className={`lg:col-span-1 border p-5 sm:p-6 rounded flex flex-col h-[70vh] shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-serif text-lg font-bold mb-4 pb-2 border-b ${darkMode ? 'text-brass border-charcoal-light' : 'text-brass-dark border-gray-200'}`}>
            Factures & Règlements
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {data.orders.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-8">Aucune facture en attente.</p>
            ) : (
              data.orders.map(o => {
                const client = getClient(o.clientId);
                const isPaid = o.advance >= o.price;
                const isActive = selectedOrder && selectedOrder.id === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      setActiveOrderView(o.id);
                      setShowReceiptMobile(true);
                    }}
                    className={`w-full text-left p-3 rounded transition-all duration-300 border ${
                      isActive
                        ? 'bg-brass/25 border-brass text-white'
                        : darkMode
                        ? 'bg-charcoal-light/20 hover:bg-charcoal-light/50 border-transparent text-gray-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-100 text-charcoal-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className={`font-mono ${isActive ? 'text-white' : 'text-gray-500'}`}>#{o.id}</span>
                      <span className={`font-semibold font-mono whitespace-nowrap ${isPaid ? 'text-vertSenegal-light' : 'text-terracotta'}`}>
                        {o.advance.toLocaleString()} / {o.price.toLocaleString()} {data.config.devise}
                      </span>
                    </div>
                    <div className="font-medium text-sm mt-1">{client.name}</div>
                    <div className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>{o.description}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* BESPOKE TICKET TAILOR PRINTABLE INVOICE */}
        <div className={`lg:col-span-2 space-y-6 ${
          !showReceiptMobile ? 'hidden lg:block' : 'block'
        }`}>
          {selectedOrder ? (
            <div className="space-y-6">
              
              <div className={`flex items-center justify-between border p-4 rounded shadow-sm transition-colors ${
                darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
              }`}>
                <span className={`text-xs font-mono hidden sm:inline ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Options de Facturation</span>
                <span className={`text-xs font-mono sm:hidden ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Action</span>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => window.print()}
                    className="bg-brass hover:bg-brass-light text-charcoal px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Icon name="print" className="w-3.5 h-3.5" />
                    <span>Imprimer le Reçu</span>
                  </button>
                </div>
              </div>

              {/* Print Area - Printable Vintage Tailor Receipt Card */}
              <div id="print-area" className="stitch-border paper-texture bg-cream text-charcoal rounded shadow-2xl p-5 sm:p-8 max-w-xl mx-auto w-full">
                <div className="text-center border-b-2 border-dashed border-brass/50 pb-6 mb-6">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-charcoal-dark uppercase block leading-tight">
                    {data.config.nomAtelier}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brass-dark font-semibold mt-1 block">
                    Reçu de Commande Bespoke & Broderie
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-charcoal-dark border-b border-brass/20 pb-4 mb-4">
                  <div>
                    <span className="text-gray-500 block uppercase">Client :</span>
                    <strong className="text-sm font-serif text-charcoal-dark font-bold block truncate">{getClient(selectedOrder.clientId).name}</strong>
                    <span className="block mt-0.5">{getClient(selectedOrder.clientId).phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block uppercase">N° Commande :</span>
                    <strong className="text-sm text-charcoal-dark font-bold block">#{selectedOrder.id}</strong>
                    <span className="block mt-0.5 text-[10px]">Émise le: {selectedOrder.dateOrdered}</span>
                  </div>
                </div>

                <div className="space-y-4 py-2 border-b border-brass/20 pb-4 mb-4 text-xs">
                  <span className="font-mono text-gray-500 uppercase block">Désignation du travail d'atelier :</span>
                  <div className="flex items-start justify-between font-serif text-sm text-charcoal-dark gap-4">
                    <div className="font-medium flex-1">
                      {selectedOrder.description}
                      {selectedOrder.notes && (
                        <span className="block font-sans text-[11px] text-gray-500 italic mt-1 font-normal">
                          Note : {selectedOrder.notes}
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-bold whitespace-nowrap">{selectedOrder.price.toLocaleString()} {data.config.devise}</div>
                  </div>
                </div>

                <div className="space-y-2 border-b border-brass/20 pb-4 mb-6 text-xs font-mono">
                  <div className="flex justify-between text-gray-600">
                    <span>PRIX TOTAL BÂTI</span>
                    <span>{selectedOrder.price.toLocaleString()} {data.config.devise}</span>
                  </div>
                  <div className="flex justify-between text-vertSenegal-dark font-bold">
                    <span>ACOMPTES PERÇUS</span>
                    <span>- {selectedOrder.advance.toLocaleString()} {data.config.devise}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-dark font-bold text-sm border-t border-brass/10 pt-2">
                    <span>SOLDE RESTANT DU</span>
                    <span className={selectedOrder.price - selectedOrder.advance > 0 ? 'text-terracotta-dark font-extrabold' : 'text-vertSenegal-dark font-extrabold'}>
                      {(selectedOrder.price - selectedOrder.advance).toLocaleString()} {data.config.devise}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-[9px] text-gray-400 font-mono">Maison de la Couture Sénégalaise - Dakar</p>
                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">Signature de l'Atelier Baobab</p>
                  </div>
                  
                  <div className={`border-2 px-4 py-1.5 rounded font-serif text-sm font-bold tracking-wider uppercase rotate-[-6deg] ${
                    selectedOrder.advance >= selectedOrder.price 
                      ? 'border-vertSenegal text-vertSenegal-dark bg-vertSenegal/10' 
                      : selectedOrder.advance > 0 
                      ? 'border-amber-500 text-amber-700 bg-amber-500/10'
                      : 'border-rougeSenegal text-rougeSenegal-dark bg-rougeSenegal/10'
                  }`}>
                    {selectedOrder.advance >= selectedOrder.price ? 'Payé Intégral' : selectedOrder.advance > 0 ? 'Acompte' : 'Non Payé'}
                  </div>
                </div>
              </div>

              {/* Transactions Recording Form */}
              <div className={`border p-5 sm:p-6 rounded space-y-4 shadow-sm transition-colors ${
                darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`font-serif text-md font-bold border-b pb-2 ${darkMode ? 'text-brass border-charcoal-light' : 'text-brass-dark border-gray-200'}`}>
                  Enregistrer un Règlement
                </h4>

                <div className="flex flex-col sm:flex-row items-end gap-3 pt-2">
                  <div className="flex-1 space-y-1 w-full">
                    <label className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Montant du versement ({data.config.devise}) :</label>
                    <input
                      type="number"
                      placeholder="Ex: 50000"
                      value={customAdvance}
                      onChange={(e) => setCustomAdvance(e.target.value)}
                      className={`w-full text-sm rounded px-3 py-2.5 focus:outline-none focus:border-brass font-mono ${
                        darkMode ? 'bg-charcoal-light border-charcoal-light text-white' : 'bg-gray-100 border-gray-200 text-charcoal'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleAddPayment}
                    className="bg-brass hover:bg-brass-light text-charcoal px-4 py-2.5 rounded text-xs font-bold transition-all w-full sm:w-auto h-10 flex-shrink-0 shadow-sm"
                  >
                    Enregistrer Versement
                  </button>
                  <button
                    onClick={handleMarkAsFullyPaid}
                    className="bg-vertSenegal hover:bg-vertSenegal-light text-white px-4 py-2.5 rounded text-xs font-bold transition-all w-full sm:w-auto h-10 flex-shrink-0 shadow-sm"
                  >
                    Marquer Payé
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className={`text-center py-16 border rounded transition-colors ${
              darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
            }`}>
              <Icon name="billing" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="font-serif text-lg text-gray-400 font-bold">Aucune Commande</h3>
              <p className="text-sm text-gray-500 mt-1">Créez une commande pour commencer à consigner des versements.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
