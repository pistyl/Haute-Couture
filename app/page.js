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
import LoginView from './components/LoginView';
import LandingPage from './components/LandingPage';

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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("FREE");
  const [data, setData] = useState({
    config: { nomAtelier: "Chargement...", devise: "FCFA" },
    employees: [],
    clients: [],
    orders: [],
    stock: []
  });
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
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Active billing selection
  const [activeOrderView, setActiveOrderView] = useState(null);

  // Dark/Light mode state
  const [darkMode, setDarkMode] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [configRes, employeesRes, clientsRes, ordersRes, stockRes] = await Promise.all([
        fetch('/api/config').then(r => r.json()),
        fetch('/api/employees').then(r => r.json()),
        fetch('/api/clients').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/stock').then(r => r.json())
      ]);
      const configData = configRes && !configRes.error ? configRes : { nomAtelier: "Atelier Baobab - Couture Sénégalaise", devise: "FCFA" };
      const employeesData = Array.isArray(employeesRes) ? employeesRes : [];
      const clientsData = Array.isArray(clientsRes) ? clientsRes : [];
      const ordersData = Array.isArray(ordersRes) ? ordersRes : [];
      const stockData = Array.isArray(stockRes) ? stockRes : [];

      setData({
        config: configData,
        employees: employeesData,
        clients: clientsData,
        orders: ordersData,
        stock: stockData
      });
      
      if (employeesData.length > 0) {
        const savedActiveEmp = localStorage.getItem("atelier_active_employee_id");
        if (savedActiveEmp && employeesData.some(e => e.id === savedActiveEmp)) {
          setCurrentEmployeeId(savedActiveEmp);
        } else {
          setCurrentEmployeeId(employeesData[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading data from database:", err);
      triggerNotification("Erreur lors de la connexion à la base de données.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Check active user session on mount
  useEffect(() => {
    setIsMounted(true);
    
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const body = await res.json();
          if (body.success) {
            setUser(body.user);
            return;
          }
        }
      } catch (e) {
        console.error("Session check failed:", e);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    const savedTheme = localStorage.getItem("atelier_theme");
    if (savedTheme !== null) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  // Fetch data whenever user session is established
  useEffect(() => {
    if (isMounted && user) {
      fetchAllData();
    }
  }, [user, isMounted]);


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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setData({
        config: { nomAtelier: "Chargement...", devise: "FCFA" },
        employees: [],
        clients: [],
        orders: [],
        stock: []
      });
      triggerNotification("Déconnexion réussie", "info");
    } catch (e) {
      triggerNotification("Erreur de déconnexion", "error");
    }
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
    localStorage.setItem("atelier_active_employee_id", id);
    const emp = data.employees.find(e => e.id === id);
    if (emp) {
      triggerNotification(`Connecté en tant que ${emp.name} (${emp.role})`, "info");
    }
  };

  const saveClient = async (clientInput) => {
    try {
      if (clientInput.id) {
        const res = await fetch('/api/clients', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientInput)
        });
        if (!res.ok) throw new Error("API error");

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
        const res = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newClient)
        });
        if (!res.ok) throw new Error("API error");

        setData(prev => ({
          ...prev,
          clients: [...prev.clients, newClient]
        }));
        setSelectedClientId(newId);
        triggerNotification(`Nouveau client ${clientInput.name} ajouté`);
      }
      setModalType(null);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible d'enregistrer le client.", "error");
    }
  };

  const deleteClient = (id) => {
    const hasOrders = data.orders.some(o => o.clientId === id);
    if (hasOrders) {
      triggerNotification("Impossible de supprimer ce client : des commandes y sont rattachées.", "error");
      return;
    }
    const client = data.clients.find(c => c.id === id);
    setConfirmConfig({
      title: "Supprimer le client",
      message: `Êtes-vous sûr de vouloir supprimer la fiche client de ${client?.name || 'ce client'} ?`,
      actionLabel: "Supprimer le client",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error("API error");

          setData(prev => ({
            ...prev,
            clients: prev.clients.filter(c => c.id !== id)
          }));
          setSelectedClientId(null);
          triggerNotification("Client supprimé avec succès");
        } catch (err) {
          console.error(err);
          triggerNotification("Impossible de supprimer le client.", "error");
        }
      }
    });
  };

  const saveOrder = async (orderInput) => {
    try {
      if (orderInput.id) {
        const res = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderInput)
        });
        if (!res.ok) throw new Error("API error");

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
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
        if (!res.ok) throw new Error("API error");

        setData(prev => ({
          ...prev,
          orders: [newOrder, ...prev.orders]
        }));
        triggerNotification("Nouvelle commande créée");
      }
      setModalType(null);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible d'enregistrer la commande.", "error");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      if (!res.ok) throw new Error("API error");

      setData(prev => ({
        ...prev,
        orders: prev.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      }));
      triggerNotification(`Commande passée au statut : ${newStatus}`);
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible de mettre à jour le statut.", "error");
    }
  };

  const updateOrderPayment = async (orderId, newAdvance) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, advance: newAdvance })
      });
      if (!res.ok) throw new Error("API error");

      setData(prev => ({
        ...prev,
        orders: prev.orders.map(o => o.id === orderId ? { ...o, advance: newAdvance } : o)
      }));
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible d'enregistrer le versement.", "error");
      throw err;
    }
  };

  const deleteOrder = (id) => {
    setConfirmConfig({
      title: "Supprimer la commande",
      message: "Voulez-vous vraiment supprimer cette commande ?",
      actionLabel: "Supprimer",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error("API error");

          setData(prev => ({
            ...prev,
            orders: prev.orders.filter(o => o.id !== id)
          }));
          triggerNotification("Commande supprimée", "error");
        } catch (err) {
          console.error(err);
          triggerNotification("Impossible de supprimer la commande.", "error");
        }
      }
    });
  };

  const saveStockItem = async (stockInput) => {
    try {
      if (stockInput.id) {
        const res = await fetch('/api/stock', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stockInput)
        });
        if (!res.ok) throw new Error("API error");

        setData(prev => ({
          ...prev,
          stock: prev.stock.map(s => s.id === stockInput.id ? { ...s, ...stockInput } : s)
        }));
        triggerNotification(`Article "${stockInput.name}" mis à jour`);
      } else {
        const newStockItem = { ...stockInput, id: `stk_${Date.now()}` };
        const res = await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStockItem)
        });
        if (!res.ok) throw new Error("API error");

        setData(prev => ({
          ...prev,
          stock: [...prev.stock, newStockItem]
        }));
        triggerNotification(`Nouvel article "${stockInput.name}" ajouté`);
      }
      setModalType(null);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible d'enregistrer l'article de stock.", "error");
    }
  };

  const adjustStockQuantity = async (id, delta) => {
    const item = data.stock.find(s => s.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);

    try {
      const res = await fetch('/api/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: newQty })
      });
      if (!res.ok) throw new Error("API error");

      setData(prev => ({
        ...prev,
        stock: prev.stock.map(s => {
          if (s.id === id) {
            if (newQty <= s.alertThreshold && s.quantity > s.alertThreshold) {
              triggerNotification(`Alerte : Le stock de ${s.name} est bas !`, "error");
            }
            return { ...s, quantity: newQty };
          }
          return s;
        })
      }));
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible d'ajuster la quantité.", "error");
    }
  };

  const deleteStockItem = (id) => {
    setConfirmConfig({
      title: "Supprimer l'article du stock",
      message: "Voulez-vous vraiment supprimer cet article du stock ?",
      actionLabel: "Supprimer l'article",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/stock?id=${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error("API error");

          setData(prev => ({
            ...prev,
            stock: prev.stock.filter(s => s.id !== id)
          }));
          triggerNotification("Article supprimé du stock", "error");
        } catch (err) {
          console.error(err);
          triggerNotification("Impossible de supprimer l'article.", "error");
        }
      }
    });
  };

  const saveEmployee = async (empInput) => {
    try {
      if (empInput.id) {
        const res = await fetch('/api/employees', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(empInput)
        });
        if (!res.ok) throw new Error("API error");

        setData(prev => ({
          ...prev,
          employees: prev.employees.map(e => e.id === empInput.id ? { ...e, ...empInput } : e)
        }));
        triggerNotification("Profil employé mis à jour");
      } else {
        const newEmp = { ...empInput, id: `emp_${Date.now()}` };
        const res = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmp)
        });
        if (!res.ok) throw new Error("API error");

        setData(prev => ({
          ...prev,
          employees: [...prev.employees, newEmp]
        }));
        triggerNotification(`Nouvel employé "${empInput.name}" ajouté`);
      }
      setModalType(null);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible d'enregistrer l'employé.", "error");
    }
  };

  const deleteEmployee = (id) => {
    const hasOrders = data.orders.some(o => o.assignedTo === id);
    if (hasOrders) {
      triggerNotification("Impossible de supprimer cet employé : des commandes lui sont assignées.", "error");
      return;
    }
    setConfirmConfig({
      title: "Retirer l'artisan",
      message: "Voulez-vous vraiment retirer cet employé de l'atelier ?",
      actionLabel: "Retirer l'artisan",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error("API error");

          setData(prev => ({
            ...prev,
            employees: prev.employees.filter(e => e.id !== id)
          }));
          if (currentEmployeeId === id) {
            const remaining = data.employees.filter(e => e.id !== id);
            if (remaining.length > 0) {
              setCurrentEmployeeId(remaining[0].id);
            } else {
              setCurrentEmployeeId("");
            }
          }
          triggerNotification("Employé retiré", "error");
        } catch (err) {
          console.error(err);
          triggerNotification("Impossible de supprimer l'employé.", "error");
        }
      }
    });
  };

  const updateWorkshopConfig = async (newConfig) => {
    const updatedConfig = {
      ...data.config,
      ...newConfig
    };
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });
      if (!res.ok) throw new Error("API error");

      setData(prev => ({
        ...prev,
        config: updatedConfig
      }));
      triggerNotification("Configuration de l'atelier enregistrée");
    } catch (err) {
      console.error(err);
      triggerNotification("Impossible d'enregistrer la configuration.", "error");
    }
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
      fileReader.onload = async e => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.clients && parsed.orders && parsed.stock && parsed.employees && parsed.config) {
            setLoading(true);
            const res = await fetch('/api/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed)
            });
            if (!res.ok) throw new Error("Import failed");

            // Reload all
            const [configRes, employeesRes, clientsRes, ordersRes, stockRes] = await Promise.all([
              fetch('/api/config').then(r => r.json()),
              fetch('/api/employees').then(r => r.json()),
              fetch('/api/clients').then(r => r.json()),
              fetch('/api/orders').then(r => r.json()),
              fetch('/api/stock').then(r => r.json())
            ]);
            
            setData({
              config: configRes,
              employees: employeesRes,
              clients: clientsRes,
              orders: ordersRes,
              stock: stockRes
            });
            if (employeesRes.length > 0) {
              setCurrentEmployeeId(employeesRes[0].id);
            }
            triggerNotification("Base de données rechargée avec succès !", "success");
          } else {
            triggerNotification("Fichier JSON invalide.", "error");
          }
        } catch (err) {
          triggerNotification("Erreur lors de l'import.", "error");
        } finally {
          setLoading(false);
        }
      };
    }
  };
  // SSR Safe Loading Screen
  if (!isMounted) {
    return <div className="h-full bg-charcoal" />;
  }

  if (loading) {
    if (user) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-charcoal text-brass font-serif text-xl">
          <Icon name="scissors" className="w-12 h-12 text-brass animate-spin mb-4" />
          <span>Chargement de l'Atelier...</span>
        </div>
      );
    }
    return <div className="h-full bg-charcoal" />;
  }

  if (!user) {
    if (showAuth) {
      return (
        <LoginView 
          initialPlan={selectedPlan}
          onLoginSuccess={(u) => setUser(u)} 
          onBack={() => setShowAuth(false)} 
        />
      );
    }
    return (
      <LandingPage 
        onStartAuth={() => { setSelectedPlan("FREE"); setShowAuth(true); }} 
        onStartRegister={(plan) => { setSelectedPlan(plan || "FREE"); setShowAuth(true); }} 
      />
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
                créer, gérer et livrer
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
              { id: "settings", label: "Atelier & Config", icon: "settings" },
              ...(user && user.isAdmin ? [{ id: "admin", label: "Back-office Admin", icon: "user", href: "/admin" }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.href) {
                    window.location.href = tab.href;
                    return;
                  }
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

        <div className={`p-4 border-t z-10 pr-10 lg:pr-4 flex flex-col gap-3 ${
          darkMode ? 'bg-charcoal-dark border-charcoal-light' : 'bg-cream border-cream-dark'
        }`}>
          {user && (
            <div className="flex flex-col gap-2">
              <span className={`text-[10px] font-mono tracking-wider truncate block opacity-70 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                🔑 {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="w-full bg-rougeSenegal hover:bg-rougeSenegal-light text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Icon name="close" className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono font-medium">
            <Icon name="scissors" className="w-3 h-3 text-brass" />
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
              updateOrderPayment={updateOrderPayment}
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
          devise={data.config.devise}
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

      {/* ================= CUSTOM CONFIRMATION MODAL ================= */}
      {confirmConfig && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal border border-charcoal-light max-w-md w-full rounded-lg shadow-2xl p-6 space-y-6 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-start gap-4 text-left">
              <div className={`p-3 rounded-full flex-shrink-0 ${
                confirmConfig.isDanger ? 'bg-rougeSenegal/10 text-rougeSenegal' : 'bg-brass/10 text-brass'
              }`}>
                <Icon name="alert" className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-base font-serif font-bold text-brass leading-tight">
                  {confirmConfig.title}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed font-light font-sans">
                  {confirmConfig.message}
                </p>
              </div>
            </div>

            {/* Modal Footer / Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-light/40">
              <button
                type="button"
                onClick={() => setConfirmConfig(null)}
                className="bg-charcoal-light hover:bg-charcoal-light/80 text-gray-300 font-semibold text-xs py-2.5 px-4 rounded border border-charcoal-light transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmConfig.onConfirm();
                  setConfirmConfig(null);
                }}
                className={`font-bold text-xs py-2.5 px-4 rounded transition-colors shadow-md ${
                  confirmConfig.isDanger
                    ? 'bg-rougeSenegal hover:bg-rougeSenegal-light text-white'
                    : 'bg-brass hover:bg-brass-light text-charcoal'
                }`}
              >
                {confirmConfig.actionLabel || 'Confirmer'}
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ================= WHATSAPP SUPPORT FLOAT BUTTON ================= */}
      <a
        href="https://wa.me/221775849570?text=Bonjour%20Atelier%20Baobab%2C%20j'ai%20besoin%20d'assistance."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        title="Discuter sur WhatsApp"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.72 1c-5.447 0-9.873 4.372-9.877 9.802-.001 1.768.467 3.49 1.358 5.011l-.989 3.618 3.734-.967zm12.338-7.37c-.328-.163-1.94-.945-2.241-1.053-.301-.11-.52-.163-.739.163-.22.329-.85.105-1.04.105-.19-.11-.383-.163-.711-.327-1.107-.573-1.926-1.127-2.63-2.316-.182-.309-.182-.477-.02-.635.147-.143.328-.383.493-.574.165-.19.22-.328.328-.546.11-.219.055-.41-.027-.574-.082-.164-.739-1.748-1.013-2.427-.267-.648-.561-.561-.739-.57l-.626-.011c-.22 0-.575.082-.876.41-.301.328-1.15 1.12-1.15 2.733 0 1.613 1.177 3.17 1.338 3.39.164.219 2.31 3.513 5.596 4.927.781.337 1.39.538 1.86.687.787.248 1.503.213 2.068.129.632-.093 1.94-.783 2.213-1.54.274-.757.274-1.404.192-1.54-.082-.136-.301-.218-.629-.381z" />
        </svg>
        <span className="absolute right-14 bg-charcoal text-cream font-mono text-[10px] tracking-wider py-1.5 px-3 rounded shadow-xl border border-charcoal-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          💬 Support WhatsApp
        </span>
      </a>

    </div>
  );
}
