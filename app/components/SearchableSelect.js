"use client";

import React, { useState, useMemo } from 'react';
import Icon from './Icons';

export default function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Sélectionner...", 
  required = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value) || null;
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(opt => opt.label.toLowerCase().includes(term));
  }, [options, searchTerm]);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchTerm("");
        }}
        className="w-full bg-charcoal-light border border-charcoal-light text-left text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-brass flex items-center justify-between cursor-pointer transition-all"
      >
        <span className={selectedOption ? "text-white" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon 
          name="chevronDown" 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Hidden input for HTML5 validation if required */}
      {required && (
        <input
          type="text"
          value={value || ""}
          required
          tabIndex={-1}
          onChange={() => {}}
          className="absolute opacity-0 pointer-events-none h-0 w-0 bottom-0 left-0"
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for closing */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 right-0 mt-1 bg-charcoal-dark border border-charcoal-light rounded shadow-2xl z-50 flex flex-col max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-charcoal-light flex items-center gap-2 bg-charcoal-light/10">
              <Icon name="search" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white text-xs outline-none focus:ring-0 placeholder-gray-500 font-sans"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-white"
                >
                  <Icon name="close" className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="overflow-y-auto py-1 flex-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-xs text-gray-500 font-mono">Aucun résultat</div>
              ) : (
                filteredOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors font-mono flex items-center justify-between hover:bg-brass/10 hover:text-white ${
                      value === opt.value ? 'bg-brass/20 text-brass font-bold' : 'text-gray-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && <Icon name="check" className="w-3.5 h-3.5 text-brass" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
