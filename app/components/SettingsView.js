import React, { useState, useEffect } from 'react';
import Icon from './Icons';

export default function SettingsView({ data, onAddEmployee, onEditEmployee, onDeleteEmployee, updateWorkshopConfig, exportDatabase, importDatabase, darkMode }) {
  
  const [workshopName, setWorkshopName] = useState(data.config.nomAtelier);
  const [workshopCurrency, setWorkshopCurrency] = useState(data.config.devise);

  useEffect(() => {
    setWorkshopName(data.config.nomAtelier);
    setWorkshopCurrency(data.config.devise);
  }, [data.config.nomAtelier, data.config.devise]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start animate-fade-in">
      
      {/* ATELIER CONFIGURATION & BACKUPS */}
      <div className="space-y-6">
        <div className={`border p-5 sm:p-6 rounded space-y-4 shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-serif text-lg font-bold pb-2 border-b ${darkMode ? 'text-brass border-charcoal-light' : 'text-brass-dark border-gray-200'}`}>
            Identité de l'Atelier
          </h3>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nom officiel de l'atelier :</label>
              <input
                type="text"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                className={`w-full rounded text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-serif ${
                  darkMode ? 'bg-charcoal-light border-charcoal-light text-white' : 'bg-gray-100 border-gray-200 text-charcoal'
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Devise monétaire par défaut :</label>
              <input
                type="text"
                value={workshopCurrency}
                onChange={(e) => setWorkshopCurrency(e.target.value)}
                className={`w-24 rounded text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono ${
                  darkMode ? 'bg-charcoal-light border-charcoal-light text-white' : 'bg-gray-100 border-gray-200 text-charcoal'
                }`}
              />
            </div>
            
            <button
              onClick={() => {
                updateWorkshopConfig({
                  nomAtelier: workshopName,
                  devise: workshopCurrency
                });
              }}
              className="bg-brass hover:bg-brass-light text-charcoal px-4 py-2.5 rounded text-xs font-bold transition-colors w-full sm:w-auto"
            >
              Sauvegarder les Paramètres
            </button>
          </div>
        </div>

        <div className={`border p-5 sm:p-6 rounded space-y-4 shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-serif text-lg font-bold pb-2 border-b ${darkMode ? 'text-brass border-charcoal-light' : 'text-brass-dark border-gray-200'}`}>
            Sauvegarde & Restauration
          </h3>
          <p className={`text-xs leading-relaxed font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Sauvegardez l'intégralité des données de l'atelier (clients, fiches de mesure, stock, historique des commandes, employés) dans un fichier JSON pour pouvoir le transférer sur d'autres navigateurs ou conserver un backup de sécurité.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={exportDatabase}
              className="bg-brass/20 border border-brass text-brass hover:bg-brass/30 px-4 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Icon name="download" className="w-3.5 h-3.5" />
              <span>Exporter Base (JSON)</span>
            </button>

            <div className="relative flex-1">
              <input
                type="file"
                id="db-import-file"
                accept=".json"
                onChange={importDatabase}
                className="hidden"
              />
              <label
                htmlFor="db-import-file"
                className={`border text-gray-200 hover:border-brass hover:text-white px-4 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  darkMode ? 'bg-charcoal-light border-charcoal-light text-white' : 'bg-gray-100 border-gray-200 text-charcoal-dark hover:bg-gray-200'
                }`}
              >
                <Icon name="upload" className="w-3.5 h-3.5" />
                <span>Importer Base (JSON)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ATELIER STAFF / EMPLOYEES MANAGEMENT */}
      <div className={`border p-5 sm:p-6 rounded flex flex-col shadow-sm transition-colors ${
        darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center justify-between mb-4 border-b pb-2 ${darkMode ? 'border-charcoal-light' : 'border-gray-200'}`}>
          <h3 className={`font-serif text-lg font-bold ${darkMode ? 'text-brass' : 'text-brass-dark'}`}>Équipe de l'Atelier</h3>
          <button
            onClick={onAddEmployee}
            className="bg-brass hover:bg-brass-light text-charcoal px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Icon name="plus" className="w-3.5 h-3.5" strokeWidth={3} />
            <span>Nouvel Artisan</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.employees.length === 0 ? (
            <div className={`p-4 rounded border text-center text-sm ${
              darkMode ? 'bg-charcoal-light/10 border-charcoal-light text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'
            }`}>
              Aucun artisan configuré dans l'équipe. Cliquez sur "Nouvel Artisan" pour commencer à bâtir votre équipe.
            </div>
          ) : (
            data.employees.map(emp => (
              <div key={emp.id} className={`p-4 border rounded flex items-center justify-between gap-3 transition-colors ${
                darkMode ? 'bg-charcoal-light/30 border-charcoal-light' : 'bg-gray-50 border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="bg-brass/10 w-9 h-9 rounded-full flex items-center justify-center text-brass flex-shrink-0">
                    <Icon name="user" className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`font-medium text-sm block ${darkMode ? 'text-white' : 'text-charcoal-dark'}`}>{emp.name}</span>
                    <span className={`text-xs font-mono block mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{emp.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className={`p-2 rounded border transition-colors ${
                      darkMode 
                        ? 'bg-charcoal-light border-charcoal-light text-brass hover:border-brass' 
                        : 'bg-white border-gray-200 text-brass hover:border-brass'
                    }`}
                  >
                    <Icon name="edit" className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(emp.id)}
                    className="p-2 bg-rougeSenegal/20 border border-rougeSenegal/30 rounded text-rougeSenegal-light hover:bg-rougeSenegal/40 transition-colors"
                  >
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
