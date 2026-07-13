"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Icon from './components/Icons';
import DashboardView from './components/DashboardView';
import ClientsView from './components/ClientsView';
import OrdersView from './components/OrdersView';
import BillingView from './components/BillingView';
import StockView from './components/StockView';
import SettingsView from './components/SettingsView';
import { ClientModal, OrderModal, StockModal, EmployeeModal } from './components/Modals';
import AnalyticsView from './components/AnalyticsView';

// --- INITIAL SENEGALESE STATE DATA ---
const defaultData = {
  config: {
    nomAtelier: "Atelier Baobab - Couture Sénégalaise",
    devise: "FCFA"
  },
  employees: [
    { id: "emp_1", name: "Moustapha Ndiaye", role: "Maître Brodeur" },
    { id: "emp_2", name: "Seydou Diop", role: "Coupeur Basin" },
    { id: "emp_3", name: "Awa Sow", role: "Couturière Senior - Wax" }
  ],
  clients: [
    {
      id: "cli_1",
      name: "Fatou Diome",
      phone: "+221 77 123 45 67",
      notes: "Préfère les broderies d'or complexes le long du plastron et des manches. Basin riche Getzner uniquement. Toujours prévoir 1 yard de tissu supplémentaire pour l'ajustement de la coiffe assortie.",
      measurements: {
        poitrine: 98,
        taille: 76,
        hanches: 108,
        epaules: 42,
        manches: 60,
        longueurPantalon: 106,
        entrejambe: 82,
        cou: 38,
        hauteurBuste: 44,
        poignet: 16
      }
    },
    {
      id: "cli_2",
      name: "Amadou Fall",
      phone: "+221 78 987 65 43",
      notes: "Demande un grand boubou classique 3 pièces très ample. Sensible aux finitions intérieures de l'encolure. Teinture indigo thioup artisanale uniquement.",
      measurements: {
        poitrine: 110,
        taille: 96,
        hanches: 112,
        epaules: 50,
        manches: 65,
        longueurPantalon: 104,
        entrejambe: 80,
        cou: 44,
        hauteurBuste: 46,
        poignet: 19
      }
    },
    {
      id: "cli_3",
      name: "Rokhaya Diallo",
      phone: "+221 76 555 44 33",
      notes: "Préfère les coupes près du corps pour ses jupes et vestes en Wax hollandais. Demande des poches latérales invisibles sur la robe.",
      measurements: {
        poitrine: 90,
        taille: 66,
        hanches: 94,
        epaules: 39,
        manches: 58,
        longueurPantalon: 102,
        entrejambe: 78,
        cou: 35,
        hauteurBuste: 41,
        poignet: 14
      }
    }
  ],
  orders: [
    {
      id: "ord_1",
      clientId: "cli_1",
      description: "Grand Boubou 3 pièces en Basin riche blanc avec broderies d'or complexes",
      status: "En couture",
      dateOrdered: "2026-07-02",
      dateDelivery: "2026-07-28",
      price: 150000,
      advance: 50000,
      assignedTo: "emp_1",
      notes: "Broderie d'or fin. Encolure ronde traditionnelle."
    },
    {
      id: "ord_2",
      clientId: "cli_2",
      description: "Boubou traditionnel en Basin riche teinté bleu Indigo thioup",
      status: "En coupe",
      dateOrdered: "2026-06-25",
      dateDelivery: "2026-07-20",
      price: 120000,
      advance: 60000,
      assignedTo: "emp_2",
      notes: "Teinture thioup artisanale de Dakar. Assemblage fils noirs."
    },
    {
      id: "ord_3",
      clientId: "cli_3",
      description: "Robe et veste cintrée en Wax hollandais véritable motif Hirondelle",
      status: "Livrée",
      dateOrdered: "2026-06-10",
      dateDelivery: "2026-07-05",
      price: 85000,
      advance: 85000,
      assignedTo: "emp_3",
      notes: "Doublure jupe légère. Livré à la cliente."
    },
    {
      id: "ord_4",
      clientId: "cli_1",
      description: "Boubou traditionnel brodé en Basin Getzner bleu ciel",
      status: "Livrée",
      dateOrdered: "2026-05-12",
      dateDelivery: "2026-06-05",
      price: 180000,
      advance: 180000,
      assignedTo: "emp_1",
      notes: "Livré complet."
    },
    {
      id: "ord_5",
      clientId: "cli_2",
      description: "Veste saharienne et pantalon en Thioup Indigo",
      status: "Livrée",
      dateOrdered: "2026-04-18",
      dateDelivery: "2026-05-10",
      price: 110000,
      advance: 110000,
      assignedTo: "emp_2",
      notes: "Finition boutons d'or."
    },
    {
      id: "ord_6",
      clientId: "cli_3",
      description: "Robe longue évasée en Wax hollandais rouge",
      status: "Livrée",
      dateOrdered: "2026-05-04",
      dateDelivery: "2026-05-25",
      price: 95000,
      advance: 95000,
      assignedTo: "emp_3",
      notes: "Broderie fine noire."
    },
    {
      id: "ord_7",
      clientId: "cli_1",
      description: "Ensemble veste courte et jupe longue Basin brodé",
      status: "Livrée",
      dateOrdered: "2026-03-20",
      dateDelivery: "2026-04-15",
      price: 210000,
      advance: 210000,
      assignedTo: "emp_1",
      notes: "Bespoke haut de gamme."
    },
    {
      id: "ord_8",
      clientId: "cli_2",
      description: "Tunique cintrée et pantalon Thioup bleu indigo",
      status: "Livrée",
      dateOrdered: "2026-02-02",
      dateDelivery: "2026-02-25",
      price: 75000,
      advance: 75000,
      assignedTo: "emp_2",
      notes: "Teinture naturelle."
    }
  ],
  stock: [
    {
      id: "stk_1",
      name: "Basin Riche blanc (Getzner)",
      type: "Tissu",
      quantity: 18,
      unit: "mètres",
      alertThreshold: 6
    },
    {
      id: "stk_2",
      name: "Wax Hollandais Véritable (Motif Hirondelle)",
      type: "Tissu",
      quantity: 4,
      unit: "yards",
      alertThreshold: 12
    },
    {
      id: "stk_3",
      name: "Tissu Thioup Indigo artisanal (Dakar)",
      type: "Tissu",
      quantity: 12,
      unit: "mètres",
      alertThreshold: 5
    },
    {
      id: "stk_4",
      name: "Fils d'or pour broderie de fête",
      type: "Fourniture",
      quantity: 8,
      unit: "bobines",
      alertThreshold: 10
    },
    {
      id: "stk_5",
      name: "Boutons recouverts assortis 15mm",
      type: "Fourniture",
      quantity: 150,
      unit: "pièces",
      alertThreshold: 50
    }
  ]
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState(defaultData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");
  
  // Mobile responsive sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Search/Filters states
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [stockFilter, setStockFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");

  // Modals states
  const [modalType, setModalType] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Active billing selection
  const [activeOrderView, setActiveOrderView] = useState(null);

  // Dark/Light mode state
  const [darkMode, setDarkMode] = useState(true);

  // Safe client-side localstorage initialization
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("atelier_couture_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        if (parsed.employees?.length > 0) {
          setCurrentEmployeeId(parsed.employees[0].id);
        }
      } catch (e) {
        console.error("Erreur lors de la lecture des données locales", e);
      }
    } else {
      if (defaultData.employees?.length > 0) {
        setCurrentEmployeeId(defaultData.employees[0].id);
      }
    }

    const savedTheme = localStorage.getItem("atelier_theme");
    if (savedTheme !== null) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("atelier_couture_data", JSON.stringify(data));
    }
  }, [data, isMounted]);

  // Sync theme to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("atelier_theme", darkMode ? "dark" : "light");
    }
  }, [darkMode, isMounted]);

  // Notifications timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const currentEmployee = useMemo(() => {
    return data.employees.find(e => e.id === currentEmployeeId) || { name: "Visiteur", role: "Inconnu" };
  }, [data.employees, currentEmployeeId]);

  const stats = useMemo(() => {
    const totalRevenue = data.orders.reduce((sum, o) => sum + (o.price || 0), 0);
    const totalAdvance = data.orders.reduce((sum, o) => sum + (o.advance || 0), 0);
    const activeOrders = data.orders.filter(o => o.status !== "Livrée").length;
    const totalRemaining = totalRevenue - totalAdvance;
    const lowStockCount = data.stock.filter(item => item.quantity <= item.alertThreshold).length;

    return {
      totalRevenue,
      totalAdvance,
      totalRemaining,
      activeOrders,
      lowStockCount
    };
  }, [data.orders, data.stock]);

  // --- ACTIONS HANDLERS ---
  const handleEmployeeChange = (id) => {
    setCurrentEmployeeId(id);
    const emp = data.employees.find(e => e.id === id);
    if (emp) {
      triggerNotification(`Connecté en tant que ${emp.name} (${emp.role})`, "info");
    }
  };

  const saveClient = (clientInput) => {
    if (clientInput.id) {
      setData(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === clientInput.id ? { ...c, ...clientInput } : c)
      }));
      triggerNotification(`Fiche client de ${clientInput.name} mise à jour`);
    } else {
      const newId = `cli_${Date.now()}`;
      const newClient = {
        ...clientInput,
        id: newId,
        measurements: clientInput.measurements || {
          poitrine: 0, taille: 0, hanches: 0, epaules: 0, sleeves: 0,
          manches: 0, longueurPantalon: 0, entrejambe: 0, cou: 0, hauteurBuste: 0, poignet: 0
        }
      };
      setData(prev => ({
        ...prev,
        clients: [...prev.clients, newClient]
      }));
      setSelectedClientId(newId);
      triggerNotification(`Nouveau client ${clientInput.name} ajouté`);
    }
    setModalType(null);
    setEditItem(null);
  };

  const deleteClient = (id) => {
    const hasOrders = data.orders.some(o => o.clientId === id);
    if (hasOrders) {
      triggerNotification("Impossible de supprimer ce client : des commandes y sont rattachées.", "error");
      return;
    }
    const client = data.clients.find(c => c.id === id);
    if (confirm(`Êtes-vous sûr de vouloir supprimer la fiche client de ${client.name} ?`)) {
      setData(prev => ({
        ...prev,
        clients: prev.clients.filter(c => c.id !== id)
      }));
      setSelectedClientId(null);
      triggerNotification("Client supprimé avec succès");
    }
  };

  const saveOrder = (orderInput) => {
    if (orderInput.id) {
      setData(prev => ({
        ...prev,
        orders: prev.orders.map(o => o.id === orderInput.id ? { ...o, ...orderInput } : o)
      }));
      triggerNotification("Commande mise à jour");
    } else {
      const newOrder = {
        ...orderInput,
        id: `ord_${Date.now()}`,
        dateOrdered: new Date().toISOString().split('T')[0]
      };
      setData(prev => ({
        ...prev,
        orders: [newOrder, ...prev.orders]
      }));
      triggerNotification("Nouvelle commande créée");
    }
    setModalType(null);
    setEditItem(null);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    }));
    triggerNotification(`Commande passée au statut : ${newStatus}`);
  };

  const deleteOrder = (id) => {
    if (confirm("Voulez-vous vraiment supprimer cette commande ?")) {
      setData(prev => ({
        ...prev,
        orders: prev.orders.filter(o => o.id !== id)
      }));
      triggerNotification("Commande supprimée", "error");
    }
  };

  const saveStockItem = (stockInput) => {
    if (stockInput.id) {
      setData(prev => ({
        ...prev,
        stock: prev.stock.map(s => s.id === stockInput.id ? { ...s, ...stockInput } : s)
      }));
      triggerNotification(`Article "${stockInput.name}" mis à jour`);
    } else {
      setData(prev => ({
        ...prev,
        stock: [...prev.stock, { ...stockInput, id: `stk_${Date.now()}` }]
      }));
      triggerNotification(`Nouvel article "${stockInput.name}" ajouté`);
    }
    setModalType(null);
    setEditItem(null);
  };

  const adjustStockQuantity = (id, delta) => {
    setData(prev => ({
      ...prev,
      stock: prev.stock.map(s => {
        if (s.id === id) {
          const newQty = Math.max(0, s.quantity + delta);
          if (newQty <= s.alertThreshold && s.quantity > s.alertThreshold) {
            triggerNotification(`Alerte : Le stock de ${s.name} est bas !`, "error");
          }
          return { ...s, quantity: newQty };
        }
        return s;
      })
    }));
  };

  const deleteStockItem = (id) => {
    if (confirm("Supprimer cet article du stock ?")) {
      setData(prev => ({
        ...prev,
        stock: prev.stock.filter(s => s.id !== id)
      }));
      triggerNotification("Article supprimé du stock", "error");
    }
  };

  const saveEmployee = (empInput) => {
    if (empInput.id) {
      setData(prev => ({
        ...prev,
        employees: prev.employees.map(e => e.id === empInput.id ? { ...e, ...empInput } : e)
      }));
      triggerNotification("Profil employé mis à jour");
    } else {
      const newEmp = { ...empInput, id: `emp_${Date.now()}` };
      setData(prev => ({
        ...prev,
        employees: [...prev.employees, newEmp]
      }));
      triggerNotification(`Nouvel employé "${empInput.name}" ajouté`);
    }
    setModalType(null);
    setEditItem(null);
  };

  const deleteEmployee = (id) => {
    if (data.employees.length <= 1) {
      triggerNotification("L'atelier doit conserver au moins un employé.", "error");
      return;
    }
    const hasOrders = data.orders.some(o => o.assignedTo === id);
    if (hasOrders) {
      triggerNotification("Impossible de supprimer cet employé : des commandes lui sont assignées.", "error");
      return;
    }
    if (confirm("Voulez-vous vraiment retirer cet employé de l'atelier ?")) {
      setData(prev => ({
        ...prev,
        employees: prev.employees.filter(e => e.id !== id)
      }));
      if (currentEmployeeId === id) {
        const remaining = data.employees.filter(e => e.id !== id);
        setCurrentEmployeeId(remaining[0].id);
      }
      triggerNotification("Employé retiré", "error");
    }
  };

  const updateWorkshopConfig = (field, value) => {
    setData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value
      }
    }));
    triggerNotification("Configuration de l'atelier enregistrée");
  };

  const exportDatabase = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `atelier_database_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    triggerNotification("Base de données exportée");
  };

  const importDatabase = (event) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.clients && parsed.orders && parsed.stock && parsed.employees) {
            setData(parsed);
            if (parsed.employees.length > 0) {
              setCurrentEmployeeId(parsed.employees[0].id);
            }
            triggerNotification("Base de données rechargée avec succès !", "success");
          } else {
            triggerNotification("Fichier JSON invalide.", "error");
          }
        } catch (err) {
          triggerNotification("Erreur lors de l'import.", "error");
        }
      };
    }
  };

  // SSR Safe Loading Screen
  if (!isMounted) {
    return (
      <div className="h-full flex items-center justify-center bg-charcoal text-brass font-serif text-xl">
        Chargement de l'Atelier...
      </div>
    );
  }

  return (
    <div className={`h-full flex overflow-hidden relative transition-colors duration-300 ${
      darkMode ? 'bg-charcoal text-gray-100' : 'bg-cream-light text-charcoal'
    }`}>
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded shadow-lg border ${
          notification.type === 'error' ? 'bg-rougeSenegal border-rougeSenegal-light text-white' :
          notification.type === 'info' ? 'bg-charcoal-light border-brass text-brass' :
          'bg-vertSenegal border-vertSenegal-light text-white'
        }`}>
          <Icon name={notification.type === 'error' ? 'alert' : 'info'} className="w-5 h-5" />
          <span className="font-medium text-sm">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-white opacity-70 hover:opacity-100">
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MOBILE DRAWER OVERLAY BACKDROP */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-black/75 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      {/* LEFT MEASURING TAPE SIDEBAR (Responsive drawer on mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform lg:transform-none lg:relative transition-all duration-300 w-64 flex flex-col justify-between border-r ${
        darkMode ? 'bg-charcoal-dark border-charcoal-light' : 'bg-cream border-cream-dark shadow-md'
      } ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex-1 flex flex-col pt-6 overflow-y-auto">
          {/* Sidebar Close Button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-10 text-black font-bold bg-yellow-500 w-6 h-6 rounded-full flex items-center justify-center hover:bg-yellow-400"
          >
            ×
          </button>

          <div className="px-6 mb-8 text-center pr-10 lg:pr-6">
            <div className="inline-block border-b border-brass pb-2">
              <h1 className="font-serif text-xl tracking-wider text-brass font-bold leading-tight">
                {data.config.nomAtelier}
              </h1>
              <p className="font-mono text-[9px] uppercase tracking-widest text-brass opacity-60 mt-1">
                Wax, Basin & Broderies
              </p>
            </div>
          </div>

          <nav className="px-4 space-y-2 pr-10 lg:pr-4">
            {[
              { id: "dashboard", label: "Tableau de bord", icon: "dashboard" },
              { id: "clients", label: "Fiches Clients", icon: "clients" },
              { id: "orders", label: "Suivi Commandes", icon: "orders" },
              { id: "billing", label: "Facturation", icon: "billing" },
              { id: "analytics", label: "Analyses & CA", icon: "chart" },
              { id: "stock", label: "Gestion Stock", icon: "stock" },
              { id: "settings", label: "Atelier & Config", icon: "settings" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveOrderView(null);
                  setSidebarOpen(false); // auto-close on mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-300 font-medium ${
                  activeTab === tab.id
                    ? "bg-brass text-charcoal font-semibold shadow-inner scale-102"
                    : darkMode
                      ? "text-gray-400 hover:bg-charcoal-light hover:text-white"
                      : "text-gray-600 hover:bg-cream-dark/40 hover:text-charcoal-dark"
                }`}
              >
                <Icon name={tab.icon} className={`w-5 h-5 ${activeTab === tab.id ? 'text-charcoal' : 'text-brass'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={`p-4 border-t text-center z-10 pr-10 lg:pr-4 ${
          darkMode ? 'bg-charcoal-dark border-charcoal-light' : 'bg-cream border-cream-dark'
        }`}>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
            <Icon name="scissors" className="w-3.5 h-3.5 text-brass" />
            <span>Atelier v1.1.0</span>
          </div>
        </div>

        {/* Graduation measuring tape divider */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-yellow-500 flex flex-col items-center justify-between py-4 select-none overflow-hidden border-l border-yellow-600 shadow-2xl">
          <div className="flex-1 w-full flex flex-col justify-around relative">
            {Array.from({ length: 28 }).map((_, idx) => {
              const cmValue = idx * 5 + 5;
              return (
                <div key={idx} className="w-full flex flex-col items-end pr-1 text-black font-mono">
                  <div className="w-6 border-b border-black"></div>
                  <span className="text-[8px] font-bold pr-1 select-none leading-none pt-0.5">{cmValue}</span>
                  <div className="w-full flex flex-col items-end pr-1 opacity-50 space-y-1 my-1">
                    <div className="w-2.5 border-b border-black"></div>
                    <div className="w-4 border-b border-black"></div>
                    <div className="w-2.5 border-b border-black"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT */}
      <main className={`flex-1 flex flex-col overflow-hidden mr-0 lg:mr-8 w-full transition-colors duration-300 ${
        darkMode ? 'bg-charcoal-dark' : 'bg-cream-dark/10'
      }`}>
        
        {/* TOP HEADER */}
        <header className={`flex items-center justify-between px-4 sm:px-8 py-4 border-b shadow-md gap-4 flex-shrink-0 transition-colors duration-300 ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Button for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 flex-shrink-0 rounded border transition-colors ${
                darkMode
                  ? 'text-brass hover:text-white bg-charcoal-light border-charcoal-light hover:border-brass'
                  : 'text-brass-dark hover:text-charcoal-dark bg-gray-50 border-gray-200 hover:border-brass'
              }`}
              title="Ouvrir le menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <span className={`font-serif text-lg sm:text-xl font-medium tracking-wide truncate ${
              darkMode ? 'text-white' : 'text-charcoal-dark'
            }`}>
              {activeTab === 'dashboard' && "Tableau de Bord"}
              {activeTab === 'clients' && "Fiches Clients & Mesures"}
              {activeTab === 'orders' && "Suivi des Commandes"}
              {activeTab === 'billing' && "Facturation & Règlements"}
              {activeTab === 'analytics' && "Analyses & Chiffre d'Affaires"}
              {activeTab === 'stock' && "Gestion du Stock"}
              {activeTab === 'settings' && "Configuration de l'Atelier"}
            </span>

            {stats.lowStockCount > 0 && (
              <span className="hidden sm:flex items-center gap-1 bg-rougeSenegal text-white px-2 py-0.5 rounded text-[11px] font-mono font-medium animate-pulse flex-shrink-0">
                <Icon name="alert" className="w-3 h-3" />
                <span>{stats.lowStockCount} alerte{stats.lowStockCount > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>

          {/* USER SWITCHER */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Dark/Light Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded border transition-colors ${
                darkMode
                  ? 'bg-charcoal-light border-charcoal-light text-brass hover:text-white'
                  : 'bg-gray-100 border-gray-200 text-brass-dark hover:text-charcoal-dark'
              }`}
              title={darkMode ? "Mode Clair" : "Mode Sombre"}
            >
              <Icon name={darkMode ? "sun" : "moon"} className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-gray-500 font-mono">Artisan actif :</span>
              <span className={`text-xs font-semibold truncate max-w-[120px] ${
                darkMode ? 'text-brass' : 'text-brass-dark'
              }`}>{currentEmployee.name}</span>
            </div>
            <div className="relative">
              <select
                value={currentEmployeeId}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className={`border text-xs rounded px-2.5 sm:px-3 py-1.5 focus:outline-none focus:ring-1 appearance-none pr-8 cursor-pointer font-mono ${
                  darkMode
                    ? 'bg-charcoal-light border-brass text-white focus:ring-brass'
                    : 'bg-gray-50 border-brass-dark text-charcoal-dark focus:ring-brass-dark'
                }`}
              >
                {data.employees.map(emp => (
                  <option key={emp.id} value={emp.id} className={darkMode ? 'bg-charcoal-dark text-white' : 'bg-white text-charcoal-dark'}>
                    {emp.name.split(" ")[0]} {/* only show first name to save header space */}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
                darkMode ? 'text-brass' : 'text-brass-dark'
              }`}>
                <Icon name="chevronRight" className="w-3.5 h-3.5 rotate-90" strokeWidth={3} />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN ROUTER PANEL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={data}
              stats={stats}
              updateOrderStatus={updateOrderStatus}
              setActiveTab={setActiveTab}
              setSelectedClientId={setSelectedClientId}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              data={data}
              selectedClientId={selectedClientId}
              setSelectedClientId={setSelectedClientId}
              search={clientSearch}
              setSearch={setClientSearch}
              onAdd={() => { setEditItem(null); setModalType('client'); }}
              onEdit={(cli) => { setEditItem(cli); setModalType('client'); }}
              onDelete={deleteClient}
              setActiveTab={setActiveTab}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              data={data}
              filter={orderFilter}
              setFilter={setOrderFilter}
              onAdd={() => { setEditItem(null); setModalType('order'); }}
              onEdit={(ord) => { setEditItem(ord); setModalType('order'); }}
              onDelete={deleteOrder}
              updateOrderStatus={updateOrderStatus}
              setActiveTab={setActiveTab}
              setSelectedClientId={setSelectedClientId}
              setActiveOrderView={setActiveOrderView}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              data={data}
              activeOrderView={activeOrderView}
              setActiveOrderView={setActiveOrderView}
              triggerNotification={triggerNotification}
              setData={setData}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              data={data}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'stock' && (
            <StockView
              data={data}
              filter={stockFilter}
              setFilter={setStockFilter}
              onAdd={() => { setEditItem(null); setModalType('stock'); }}
              onEdit={(stk) => { setEditItem(stk); setModalType('stock'); }}
              onDelete={deleteStockItem}
              adjustStock={adjustStockQuantity}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              data={data}
              onAddEmployee={() => { setEditItem(null); setModalType('employee'); }}
              onEditEmployee={(emp) => { setEditItem(emp); setModalType('employee'); }}
              onDeleteEmployee={deleteEmployee}
              updateWorkshopConfig={updateWorkshopConfig}
              exportDatabase={exportDatabase}
              importDatabase={importDatabase}
              darkMode={darkMode}
            />
          )}
        </div>
      </main>

      {/* --- MODALS --- */}
      {modalType === 'client' && (
        <ClientModal
          client={editItem}
          onClose={() => { setModalType(null); setEditItem(null); }}
          onSave={saveClient}
        />
      )}

      {modalType === 'order' && (
        <OrderModal
          order={editItem}
          clients={data.clients}
          employees={data.employees}
          onClose={() => { setModalType(null); setEditItem(null); }}
          onSave={saveOrder}
        />
      )}

      {sidebarOpen && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}

      {modalType === 'stock' && (
        <StockModal
          stockItem={editItem}
          onClose={() => { setModalType(null); setEditItem(null); }}
          onSave={saveStockItem}
        />
      )}

      {modalType === 'employee' && (
        <EmployeeModal
          employee={editItem}
          onClose={() => { setModalType(null); setEditItem(null); }}
          onSave={saveEmployee}
        />
      )}

    </div>
  );
}
