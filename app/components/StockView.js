import React, { useMemo } from 'react';
import Icon from './Icons';

export default function StockView({ data, filter, setFilter, onAdd, onEdit, onDelete, adjustStock, darkMode }) {
  
  const filteredStock = useMemo(() => {
    if (filter === "All") return data.stock;
    return data.stock.filter(s => s.type === filter);
  }, [data.stock, filter]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 ${
        darkMode ? 'border-charcoal-light' : 'border-gray-200'
      }`}>
        
        {/* Filters */}
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
            Tous les articles
          </button>
          <button
            onClick={() => setFilter("Tissu")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors border flex-shrink-0 ${
              filter === "Tissu"
                ? "bg-brass text-charcoal border-brass font-bold"
                : darkMode
                ? "bg-charcoal text-gray-400 border-charcoal-light hover:text-white"
                : "bg-white text-gray-600 border-gray-200 hover:text-charcoal-dark shadow-sm"
            }`}
          >
            Tissus (Basin/Wax)
          </button>
          <button
            onClick={() => setFilter("Fourniture")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors border flex-shrink-0 ${
              filter === "Fourniture"
                ? "bg-brass text-charcoal border-brass font-bold"
                : darkMode
                ? "bg-charcoal text-gray-400 border-charcoal-light hover:text-white"
                : "bg-white text-gray-600 border-gray-200 hover:text-charcoal-dark shadow-sm"
            }`}
          >
            Fournitures & Broderie
          </button>
        </div>

        <button
          onClick={onAdd}
          className="bg-brass hover:bg-brass-light text-charcoal px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow w-full md:w-auto justify-center"
        >
          <Icon name="plus" className="w-4 h-4" strokeWidth={3} />
          <span>Ajouter Tissu / Fourniture</span>
        </button>

      </div>

      {/* STOCK GRID */}
      {filteredStock.length === 0 ? (
        <div className={`text-center py-16 border rounded transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <Icon name="stock" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-gray-400 font-bold">Aucun Article</h3>
          <p className="text-sm text-gray-500 mt-1">Aucun article ne correspond à votre filtre de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredStock.map(item => {
            const isAlert = item.quantity <= item.alertThreshold;
            
            return (
              <div
                key={item.id}
                className={`p-5 rounded border shadow transition-colors flex flex-col justify-between ${
                  isAlert
                    ? 'border-rougeSenegal bg-rougeSenegal/15'
                    : darkMode
                    ? 'border-charcoal-light bg-charcoal text-white'
                    : 'border-gray-200 bg-white text-charcoal-dark'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className={`font-serif text-md font-bold leading-tight ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}>{item.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      item.type === 'Tissu' ? 'bg-brass/25 text-brass' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className={`text-3xl font-mono font-bold leading-none ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}>
                      {item.quantity}
                    </span>
                    <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.unit}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-mono text-gray-500">
                    Seuil d'alerte : {item.alertThreshold} {item.unit}
                  </div>

                  {isAlert && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-rougeSenegal-light font-bold">
                      <Icon name="alert" className="w-3.5 h-3.5 animate-pulse" />
                      <span>Rupture imminente ! Réapprovisionner.</span>
                    </div>
                  )}
                </div>

                <div className={`mt-6 pt-3 border-t flex items-center justify-between gap-4 ${
                  darkMode ? 'border-charcoal-light' : 'border-gray-100'
                }`}>
                  {/* Quantity adjustments */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => adjustStock(item.id, -1)}
                      className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-sm transition-colors ${
                        darkMode 
                          ? 'bg-charcoal-light text-white border-charcoal-light hover:border-brass' 
                          : 'bg-gray-100 text-charcoal border-gray-200 hover:border-brass'
                      }`}
                    >
                      -
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 1)}
                      className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-sm transition-colors ${
                        darkMode 
                          ? 'bg-charcoal-light text-white border-charcoal-light hover:border-brass' 
                          : 'bg-gray-100 text-charcoal border-gray-200 hover:border-brass'
                      }`}
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className={`p-2 rounded border transition-colors ${
                        darkMode 
                          ? 'bg-charcoal-light border-charcoal-light text-brass hover:border-brass' 
                          : 'bg-gray-50 border-gray-200 text-brass hover:border-brass'
                      }`}
                    >
                      <Icon name="edit" className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 bg-rougeSenegal/20 border border-rougeSenegal/30 rounded text-rougeSenegal-light hover:bg-rougeSenegal/40 transition-colors"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
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
