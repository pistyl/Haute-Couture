import React, { useState } from 'react';
import Icon from './Icons';

// --- CLIENT MODAL (ADD / EDIT) ---
export function ClientModal({ client, onClose, onSave }) {
  const [name, setName] = useState(client ? client.name : "");
  const [phone, setPhone] = useState(client ? client.phone : "");
  const [notes, setNotes] = useState(client ? client.notes : "");
  
  const [measurements, setMeasurements] = useState(client ? (client.measurements || {}) : {
    poitrine: 0, taille: 0, hanches: 0, epaules: 0, manches: 0,
    longueurPantalon: 0, entrejambe: 0, cou: 0, hauteurBuste: 0, poignet: 0
  });

  const handleMeasurementChange = (field, val) => {
    const numVal = parseFloat(val) || 0;
    setMeasurements(prev => ({
      ...prev,
      [field]: numVal
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: client?.id,
      name,
      phone,
      notes,
      measurements
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-charcoal border border-charcoal-light w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <header className="bg-charcoal flex items-center justify-between px-4 sm:px-6 py-4 border-b border-charcoal-light flex-shrink-0">
          <span className="font-serif text-lg text-brass font-bold">
            {client ? `Modifier Fiche : ${client.name}` : "Ajouter Nouveau Client"}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Nom Complet :</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Fatou Diome"
                className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Téléphone de contact :</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +221 77 123 45 67"
                className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono"
              />
            </div>
          </div>

          {/* Measurements */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm text-brass font-semibold border-b border-charcoal-light pb-1">
              Mesures anatomiques (cm) :
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: 'poitrine', label: 'Poitrine' },
                { key: 'taille', label: 'Taille' },
                { key: 'hanches', label: 'Hanches' },
                { key: 'epaules', label: 'Épaules' },
                { key: 'manches', label: 'Manches' },
                { key: 'longueurPantalon', label: 'Long. Pantalon' },
                { key: 'entrejambe', label: 'Entrejambe' },
                { key: 'cou', label: 'Tour Cou' },
                { key: 'hauteurBuste', label: 'Ht. Buste' },
                { key: 'poignet', label: 'Poignet' }
              ].map(m => (
                <div key={m.key} className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase truncate block">{m.label} :</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={measurements[m.key] || ""}
                    onChange={(e) => handleMeasurementChange(m.key, e.target.value)}
                    placeholder="0"
                    className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-2 py-2 focus:outline-none focus:border-brass font-mono text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Notes d'atelier, finitions, détails de broderie :</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Souhaite des broderies d'or complexes le long du col et du plastron..."
              rows="3"
              className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2 focus:outline-none focus:border-brass"
            />
          </div>

          <footer className="pt-4 border-t border-charcoal-light flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-charcoal hover:bg-charcoal-light border border-charcoal-light text-gray-300 px-4 py-2.5 rounded text-xs font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-brass hover:bg-brass-light text-charcoal px-5 py-2.5 rounded text-xs font-bold transition-colors shadow-md"
            >
              Enregistrer la Fiche
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// --- ORDER MODAL (ADD / EDIT) ---
export function OrderModal({ order, clients, employees, onClose, onSave }) {
  const [clientId, setClientId] = useState(order ? order.clientId : (clients[0]?.id || ""));
  const [description, setDescription] = useState(order ? order.description : "");
  const [status, setStatus] = useState(order ? order.status : "Nouvelle");
  const [dateDelivery, setDateDelivery] = useState(order ? order.dateDelivery : "");
  const [price, setPrice] = useState(order ? order.price : 0);
  const [advance, setAdvance] = useState(order ? order.advance : 0);
  const [assignedTo, setAssignedTo] = useState(order ? order.assignedTo : (employees[0]?.id || ""));
  const [notes, setNotes] = useState(order ? order.notes : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId || !description.trim()) return;
    
    onSave({
      id: order?.id,
      clientId,
      description,
      status,
      dateDelivery,
      price: parseFloat(price) || 0,
      advance: parseFloat(advance) || 0,
      assignedTo,
      notes,
      dateOrdered: order ? order.dateOrdered : new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-charcoal border border-charcoal-light w-full max-w-xl rounded-lg shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <header className="bg-charcoal flex items-center justify-between px-4 sm:px-6 py-4 border-b border-charcoal-light flex-shrink-0">
          <span className="font-serif text-lg text-brass font-bold">
            {order ? "Modifier la Commande" : "Créer une Commande d'Atelier"}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Client Selection */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Client lié à la commande :</label>
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-charcoal-light border border-charcoal-light text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-brass cursor-pointer"
            >
              <option value="" disabled>Sélectionner un client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Désignation du vêtement (Ex: Grand Boubou 3 pièces Basin) :</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Robe de soirée en Wax"
              className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass"
            />
          </div>

          {/* Status & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Statut de fabrication :</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-charcoal-light border border-charcoal-light text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-brass cursor-pointer font-mono"
              >
                {["Nouvelle", "En coupe", "En couture", "Essayage", "Prête", "Livrée"].map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Artisan assigné :</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-charcoal-light border border-charcoal-light text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-brass cursor-pointer"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Advance and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Prix total ({data.config.devise}) :</label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Acompte versé :</label>
              <input
                type="number"
                min="0"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Date livraison :</label>
              <input
                type="date"
                required
                value={dateDelivery}
                onChange={(e) => setDateDelivery(e.target.value)}
                className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Détails couture & métrages nécessaires :</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Nécessite 4 yards de Wax hollandais. Doublure légère en satin..."
              rows="3"
              className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2 focus:outline-none focus:border-brass"
            />
          </div>

          <footer className="pt-4 border-t border-charcoal-light flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-charcoal hover:bg-charcoal-light border border-charcoal-light text-gray-300 px-4 py-2.5 rounded text-xs font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-brass hover:bg-brass-light text-charcoal px-5 py-2.5 rounded text-xs font-bold transition-colors shadow-md"
            >
              Enregistrer Commande
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// --- STOCK MODAL (ADD / EDIT) ---
export function StockModal({ stockItem, onClose, onSave }) {
  const [name, setName] = useState(stockItem ? stockItem.name : "");
  const [type, setType] = useState(stockItem ? stockItem.type : "Tissu");
  const [quantity, setQuantity] = useState(stockItem ? stockItem.quantity : 0);
  const [unit, setUnit] = useState(stockItem ? stockItem.unit : "mètres");
  const [alertThreshold, setAlertThreshold] = useState(stockItem ? stockItem.alertThreshold : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: stockItem?.id,
      name,
      type,
      quantity: parseFloat(quantity) || 0,
      unit,
      alertThreshold: parseFloat(alertThreshold) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-charcoal border border-charcoal-light w-full max-w-md rounded-lg shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <header className="bg-charcoal flex items-center justify-between px-6 py-4 border-b border-charcoal-light flex-shrink-0">
          <span className="font-serif text-lg text-brass font-bold">
            {stockItem ? `Modifier : ${stockItem.name}` : "Ajouter au Stock"}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Nom de l'article :</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Basin riche blanc Getzner"
              className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Nature de l'article :</label>
            <div className="flex gap-4">
              {["Tissu", "Fourniture"].map(t => (
                <label key={t} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="stock-type"
                    value={t}
                    checked={type === t}
                    onChange={(e) => setType(e.target.value)}
                    className="text-brass focus:ring-brass bg-charcoal-light border-charcoal-light"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Quantité :</label>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400">Unité :</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="mètres, yards, pièces..."
                className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Seuil d'alerte :</label>
            <input
              type="number"
              min="0"
              required
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass font-mono"
            />
          </div>

          <footer className="pt-4 border-t border-charcoal-light flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-charcoal hover:bg-charcoal-light border border-charcoal-light text-gray-300 px-4 py-2.5 rounded text-xs font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-brass hover:bg-brass-light text-charcoal px-5 py-2.5 rounded text-xs font-bold transition-colors shadow-md"
            >
              Enregistrer l'Article
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// --- EMPLOYEE MODAL (ADD / EDIT) ---
export function EmployeeModal({ employee, onClose, onSave }) {
  const [name, setName] = useState(employee ? employee.name : "");
  const [role, setRole] = useState(employee ? employee.role : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    onSave({
      id: employee?.id,
      name,
      role
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-charcoal border border-charcoal-light w-full max-w-sm rounded-lg shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <header className="bg-charcoal flex items-center justify-between px-6 py-4 border-b border-charcoal-light flex-shrink-0">
          <span className="font-serif text-lg text-brass font-bold">
            {employee ? `Modifier : ${employee.name}` : "Ajouter un Collaborateur"}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Nom de l'artisan :</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Moustapha Ndiaye"
              className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-400">Rôle / Spécialité :</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ex: Brodeur principal"
              className="w-full bg-charcoal-light border border-charcoal-light rounded text-white text-sm px-3 py-2.5 focus:outline-none focus:border-brass"
            />
          </div>

          <footer className="pt-4 border-t border-charcoal-light flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-charcoal hover:bg-charcoal-light border border-charcoal-light text-gray-300 px-4 py-2.5 rounded text-xs font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-brass hover:bg-brass-light text-charcoal px-5 py-2.5 rounded text-xs font-bold transition-colors shadow-md"
            >
              Enregistrer
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
