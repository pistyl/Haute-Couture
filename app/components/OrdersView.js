import React, { useMemo } from 'react';
import Icon from './Icons';

export default function OrdersView({ data, filter, setFilter, onAdd, onEdit, onDelete, updateOrderStatus, setActiveTab, setSelectedClientId, setActiveOrderView, darkMode }) {
  
  const orderSteps = ["Nouvelle", "En coupe", "En couture", "Essayage", "Prête", "Livrée"];

  const filteredOrders = useMemo(() => {
    if (filter === "All") return data.orders;
    return data.orders.filter(o => o.status === filter);
  }, [data.orders, filter]);

  const getClientName = (clientId) => {
    const client = data.clients.find(c => c.id === clientId);
    return client ? client.name : "Client Inconnu";
  };

  const getEmployeeName = (empId) => {
    const emp = data.employees.find(e => e.id === empId);
    return emp ? emp.name : "Non assigné";
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
    <div className="space-y-6 animate-fade-in">
      
      <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b pb-4 ${
        darkMode ? 'border-charcoal-light' : 'border-gray-200'
      }`}>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors border flex-shrink-0 ${
              filter === "All"
                ? "bg-brass text-charcoal border-brass font-bold"
                : darkMode
                ? "bg-charcoal text-gray-400 border-charcoal-light hover:text-white"
                : "bg-white text-gray-600 border-gray-200 hover:text-charcoal-dark shadow-sm"
            }`}
          >
            Toutes ({data.orders.length})
          </button>
          {orderSteps.map(step => {
            const count = data.orders.filter(o => o.status === step).length;
            return (
              <button
                key={step}
                onClick={() => setFilter(step)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors border flex-shrink-0 ${
                  filter === step
                    ? "bg-brass text-charcoal border-brass font-bold"
                    : darkMode
                    ? "bg-charcoal text-gray-400 border-charcoal-light hover:text-white"
                    : "bg-white text-gray-600 border-gray-200 hover:text-charcoal-dark shadow-sm"
                }`}
              >
                {step} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={onAdd}
          className="bg-brass hover:bg-brass-light text-charcoal px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow w-full xl:w-auto justify-center"
        >
          <Icon name="plus" className="w-4 h-4" strokeWidth={3} />
          <span>Créer Commande</span>
        </button>

      </div>

      {/* ORDERS DISPLAY LIST */}
      {filteredOrders.length === 0 ? (
        <div className={`text-center py-16 border rounded transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <Icon name="orders" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-gray-400 font-bold">Aucune Commande</h3>
          <p className="text-sm text-gray-500 mt-1">Aucune commande ne correspond au filtre sélectionné.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map(order => {
            const statusIndex = orderSteps.indexOf(order.status);
            
            return (
              <div key={order.id} className={`border p-4 sm:p-6 rounded shadow-md space-y-4 transition-colors ${
                darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
              }`}>
                
                {/* Order header information */}
                <div className={`flex flex-col md:flex-row md:items-start justify-between gap-4 pb-3 border-b ${
                  darkMode ? 'border-charcoal-light' : 'border-gray-200'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setSelectedClientId(order.clientId);
                          setActiveTab("clients");
                        }}
                        className="font-serif text-lg text-brass hover:underline font-bold text-left"
                      >
                        {getClientName(order.clientId)}
                      </button>
                      <span className={`font-mono text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>#{order.id}</span>
                    </div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}>{order.description}</p>
                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span>Date : {order.dateOrdered}</span>
                      <span>Livraison : <strong className="text-brass">{order.dateDelivery}</strong></span>
                      <span>Assigné à : <strong className={darkMode ? 'text-gray-200' : 'text-gray-700'}>{getEmployeeName(order.assignedTo)}</strong></span>
                    </div>
                  </div>

                  {/* Pricing and balance info */}
                  <div className={`flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 border-t md:border-t-0 pt-2 md:pt-0 ${
                    darkMode ? 'border-charcoal-light' : 'border-gray-100'
                  }`}>
                    <div className={`font-mono text-md font-bold ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}>
                      {order.price} {data.config.devise}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        order.advance === 0 ? 'bg-rougeSenegal/20 text-rougeSenegal-light border border-rougeSenegal/30' :
                        order.advance < order.price ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                        'bg-vertSenegal/20 text-vertSenegal-light border border-vertSenegal/30'
                      }`}>
                        {order.advance === 0 ? 'Impayé' : order.advance < order.price ? 'Acompte' : 'Payé'}
                      </span>
                      <button
                        onClick={() => {
                          setActiveOrderView(order.id);
                          setActiveTab("billing");
                        }}
                        className="text-[11px] text-brass hover:underline font-mono"
                      >
                        Facture
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stepper timeline */}
                <div className="pt-2">
                  <span className={`text-xs font-mono block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Suivi d'avancement dans l'atelier :</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {orderSteps.map((step, idx) => {
                      const isActive = idx === statusIndex;
                      const isCompleted = idx < statusIndex;
                      
                      let stepColor = "";
                      if (isActive) {
                        stepColor = "bg-brass text-charcoal border-brass font-bold shadow-md scale-102";
                      } else if (isCompleted) {
                        stepColor = "bg-vertSenegal/15 border-vertSenegal/40 text-vertSenegal-light";
                      } else {
                        stepColor = darkMode 
                          ? "bg-charcoal-light/10 border-charcoal-light text-gray-500 hover:border-brass/35"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-brass/50";
                      }

                      return (
                        <button
                          key={step}
                          onClick={() => updateOrderStatus(order.id, step)}
                          className={`text-left p-2 sm:p-2.5 rounded border text-xs transition-all duration-300 ${stepColor}`}
                        >
                          <div className="font-mono text-[8px] opacity-75">Étape {idx + 1}</div>
                          <div className="truncate mt-0.5 flex items-center justify-between gap-1">
                            <span>{step}</span>
                            {isCompleted && <Icon name="check" className="w-3 h-3 text-vertSenegal-light" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footnotes & operations */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t ${
                  darkMode ? 'border-charcoal-light' : 'border-gray-100'
                }`}>
                  <div className={`text-xs italic font-mono leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {order.notes ? `Instructions de broderie/coupe: "${order.notes}"` : "Aucune instruction supplémentaire."}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onEdit(order)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 border transition-colors ${
                        darkMode 
                          ? 'bg-charcoal hover:bg-charcoal-light text-gray-200 border-charcoal-light' 
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <Icon name="edit" className="w-3.5 h-3.5 text-brass" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => onDelete(order.id)}
                      className="bg-rougeSenegal hover:bg-rougeSenegal-light text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
