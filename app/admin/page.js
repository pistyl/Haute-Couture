"use client";

import React, { useState, useEffect } from 'react';
import Icon from '../components/Icons';

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('stats'); // stats, users, disputes, settings
  const [stats, setStats] = useState(null);
  const [statsPeriod, setStatsPeriod] = useState('all'); // all, 7d, 30d, this_month, this_year
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [commissionRate, setCommissionRate] = useState(5.0);
  const [loadingData, setLoadingData] = useState(true);
  
  // Search and filter states
  const [userSearch, setUserSearch] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  
  // Dispute filters and modal states
  const [disputeStatusFilter, setDisputeStatusFilter] = useState('All');
  const [editingDispute, setEditingDispute] = useState(null);
  const [disputeNotesText, setDisputeNotesText] = useState('');
  const [disputeStatusText, setDisputeStatusText] = useState('');
  
  // Create dispute form state
  const [showCreateDispute, setShowCreateDispute] = useState(false);
  const [newDispute, setNewDispute] = useState({
    userId: '',
    title: '',
    description: '',
    clientName: '',
    orderId: '',
    status: 'pending'
  });

  // Edit user plan state
  const [editingUserPlan, setEditingUserPlan] = useState(null);

  // Custom confirmation modal state
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  const triggerNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auth check & Mount
  useEffect(() => {
    setIsMounted(true);
    const verifyAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const body = await res.json();
          if (body.success && body.user?.isAdmin) {
            setCurrentUser(body.user);
            setCheckingAuth(false);
            // Load stats first
            loadAllAdminData();
            return;
          }
        }
        // Redirect to homepage if not admin
        triggerNotification("Accès refusé. Redirection...", "error");
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } catch (err) {
        console.error("Auth validation failed:", err);
        window.location.href = '/';
      }
    };
    verifyAdmin();
  }, []);

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, usersRes, disputesRes, settingsRes] = await Promise.all([
        fetch(`/api/admin/stats?period=${statsPeriod}`).then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/disputes').then(r => r.json()),
        fetch('/api/admin/settings').then(r => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (disputesRes.success) setDisputes(disputesRes.disputes);
      if (settingsRes.success) setCommissionRate(settingsRes.commissionRate);
    } catch (err) {
      console.error("Error loading admin data:", err);
      triggerNotification("Erreur lors de la récupération des données", "error");
    } finally {
      setLoadingData(false);
    }
  };

  // Effect to load stats when analysis period changes
  useEffect(() => {
    if (!checkingAuth && currentUser?.isAdmin) {
      setLoadingData(true);
      fetch(`/api/admin/stats?period=${statsPeriod}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setStats(data.stats);
          } else {
            triggerNotification(data.error || "Erreur de chargement des stats", "error");
          }
        })
        .catch(err => {
          console.error("Error updating stats:", err);
          triggerNotification("Erreur de connexion", "error");
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [statsPeriod, checkingAuth, currentUser]);

  // User Actions
  const toggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        triggerNotification(`Statut de ${user.email} mis à jour : ${newStatus === 'active' ? 'Activé' : 'Bloqué'}`);
        // Reload stats
        fetch('/api/admin/stats').then(r => r.json()).then(res => res.success && setStats(res.stats));
      } else {
        triggerNotification(data.error || "Erreur de mise à jour", "error");
      }
    } catch (err) {
      triggerNotification("Erreur serveur", "error");
    }
  };

  const toggleUserAdmin = async (user) => {
    const newAdminVal = !user.isAdmin;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isAdmin: newAdminVal })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isAdmin: newAdminVal } : u));
        triggerNotification(`Droits admin modifiés pour ${user.email}`);
      } else {
        triggerNotification(data.error || "Erreur de mise à jour", "error");
      }
    } catch (err) {
      triggerNotification("Erreur serveur", "error");
    }
  };

  const handleUpdatePlan = async (userId, plan) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, plan })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan, subscriptionEnd: data.user.subscriptionEnd } : u));
        setEditingUserPlan(null);
        triggerNotification(`Plan mis à jour pour l'utilisateur`);
        loadAllAdminData(); // reload stats
      } else {
        triggerNotification(data.error || "Erreur de mise à jour", "error");
      }
    } catch (err) {
      triggerNotification("Erreur serveur", "error");
    }
  };

  const handleDeleteUser = (userId, email) => {
    setConfirmConfig({
      title: "Supprimer définitivement le compte",
      message: `Voulez-vous vraiment supprimer définitivement le compte ${email} ? Cette action supprimera également tous ses ateliers, clients, commandes et stocks associés.`,
      actionLabel: "Supprimer le compte",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
            setUsers(prev => prev.filter(u => u.id !== userId));
            triggerNotification(`Compte ${email} supprimé définitivement`);
            loadAllAdminData();
          } else {
            triggerNotification(data.error || "Erreur lors de la suppression", "error");
          }
        } catch (err) {
          triggerNotification("Erreur serveur", "error");
        }
      }
    });
  };

  // Dispute Actions
  const handleUpdateDispute = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/disputes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDispute.id,
          status: disputeStatusText,
          adminNotes: disputeNotesText
        })
      });
      const data = await res.json();
      if (data.success) {
        setDisputes(prev => prev.map(d => d.id === editingDispute.id ? { ...d, status: disputeStatusText, adminNotes: disputeNotesText, updatedAt: new Date().toISOString() } : d));
        setEditingDispute(null);
        triggerNotification("Litige mis à jour avec succès");
        // Reload stats
        fetch('/api/admin/stats').then(r => r.json()).then(res => res.success && setStats(res.stats));
      } else {
        triggerNotification(data.error || "Erreur", "error");
      }
    } catch (err) {
      triggerNotification("Erreur serveur", "error");
    }
  };

  const handleCreateDispute = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDispute)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateDispute(false);
        setNewDispute({
          userId: '',
          title: '',
          description: '',
          clientName: '',
          orderId: '',
          status: 'pending'
        });
        triggerNotification("Litige créé avec succès");
        loadAllAdminData();
      } else {
        triggerNotification(data.error || "Erreur", "error");
      }
    } catch (err) {
      triggerNotification("Erreur serveur", "error");
    }
  };

  const handleDeleteDispute = (disputeId) => {
    setConfirmConfig({
      title: "Supprimer le litige",
      message: "Voulez-vous supprimer ce litige de la plateforme ?",
      actionLabel: "Supprimer",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/disputes?id=${disputeId}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
            setDisputes(prev => prev.filter(d => d.id !== disputeId));
            triggerNotification("Litige supprimé");
            loadAllAdminData();
          } else {
            triggerNotification(data.error || "Erreur", "error");
          }
        } catch (err) {
          triggerNotification("Erreur serveur", "error");
        }
      }
    });
  };

  // Settings Actions
  const handleUpdateCommission = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionRate })
      });
      const data = await res.json();
      if (data.success) {
        triggerNotification(`Taux de commission plateforme mis à jour à ${commissionRate}%`);
        loadAllAdminData();
      } else {
        triggerNotification(data.error || "Erreur", "error");
      }
    } catch (err) {
      triggerNotification("Erreur serveur", "error");
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) || 
      (u.atelierName || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchesPlan = userPlanFilter === 'All' || u.plan === userPlanFilter;
    const matchesStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Filtered Disputes
  const filteredDisputes = disputes.filter(d => {
    return disputeStatusFilter === 'All' || d.status === disputeStatusFilter;
  });

  if (!isMounted || checkingAuth) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-charcoal-dark text-brass font-serif text-xl">
        <Icon name="scissors" className="w-12 h-12 text-brass animate-spin mb-4" />
        <span>Vérification des droits d'administration...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-charcoal text-cream-light font-sans overflow-hidden">
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded shadow-xl border transition-all duration-300 transform translate-y-0 scale-100 ${
          notification.type === 'error' 
            ? 'bg-rougeSenegal-dark border-rougeSenegal text-white' 
            : 'bg-vertSenegal-dark border-vertSenegal text-white'
        }`}>
          <Icon name={notification.type === 'error' ? 'alert' : 'check'} className="w-5 h-5" />
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* ADMIN SIDEBAR */}
      <aside className="w-64 bg-charcoal-dark border-r border-charcoal-light flex flex-col justify-between select-none">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-charcoal-light flex items-center gap-3 bg-charcoal-dark">
            <div className="bg-brass p-2 rounded shadow-inner">
              <Icon name="scissors" className="w-6 h-6 text-charcoal-dark" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-brass tracking-wide leading-tight">Back-office</h1>
              <p className="text-[10px] uppercase tracking-widest text-brass-light font-bold opacity-60">Atelier Baobab</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-2">
            {[
              { id: 'stats', label: 'Stats Globales', icon: 'chart' },
              { id: 'users', label: 'Utilisateurs', icon: 'user' },
              { id: 'disputes', label: 'Gestion des Litiges', icon: 'alert' },
              { id: 'settings', label: 'Taux de Commission', icon: 'settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-200 font-medium ${
                  activeTab === tab.id
                    ? 'bg-brass text-charcoal font-semibold shadow'
                    : 'text-gray-400 hover:bg-charcoal-light hover:text-white'
                }`}
              >
                <Icon name={tab.icon} className={`w-5 h-5 ${activeTab === tab.id ? 'text-charcoal' : 'text-brass'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Area with Back to App Button */}
        <div className="p-4 border-t border-charcoal-light bg-charcoal-dark flex flex-col gap-3">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-vertSenegal animate-pulse" />
            <span className="text-[10px] font-mono text-gray-400">Admin: {currentUser.email}</span>
          </div>
          
          <a
            href="/"
            className="w-full bg-thioup hover:bg-thioup-light text-cream font-semibold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-2 border border-thioup-light/40 shadow-md"
          >
            <Icon name="dashboard" className="w-4 h-4 text-brass" />
            <span>Retour à l'Atelier</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col overflow-hidden bg-charcoal-dark">
        {/* Header */}
        <header className="h-16 border-b border-charcoal-light bg-charcoal flex items-center justify-between px-8">
          <h2 className="text-xl font-serif text-brass font-bold">
            {activeTab === 'stats' && 'Statistiques Globales de la Plateforme'}
            {activeTab === 'users' && 'Gestion des Utilisateurs'}
            {activeTab === 'disputes' && 'Traitement des Litiges Réclamés'}
            {activeTab === 'settings' && 'Configuration Financière & Paramètres'}
          </h2>
          
          {loadingData && (
            <div className="flex items-center gap-2 text-xs text-brass">
              <div className="w-4 h-4 rounded-full border-2 border-brass border-t-transparent animate-spin" />
              <span>Chargement...</span>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-charcoal to-charcoal-dark">
          
          {/* ================= STATS TAB ================= */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Period Selector Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-charcoal border border-charcoal-light/60 p-4 rounded-lg shadow-sm">
                <div>
                  <h4 className="text-sm font-semibold text-brass font-serif">Période d'Analyse des Données</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Sélectionnez la période pour filtrer les transactions et les commandes.</p>
                </div>
                <select
                  value={statsPeriod}
                  onChange={(e) => setStatsPeriod(e.target.value)}
                  className="bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-1.5 text-xs focus:outline-none focus:border-brass font-medium"
                >
                  <option value="all">Toute la période (Historique)</option>
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="this_month">Ce mois-ci</option>
                  <option value="this_year">Cette année</option>
                </select>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Users Widget */}
                <div className="bg-charcoal border border-charcoal-light/60 p-6 rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Ateliers Inscrits</p>
                      <h3 className="text-3xl font-serif font-bold text-brass mt-2">{stats.totalUsers}</h3>
                    </div>
                    <div className="bg-brass/10 p-3 rounded-full text-brass">
                      <Icon name="user" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-charcoal-light/50 flex justify-between items-center text-xs text-gray-400">
                    {statsPeriod === 'all' ? (
                      <>
                        <span>Actifs : <strong className="text-vertSenegal">{stats.activeUsers}</strong></span>
                        <span>Inactifs : <strong>{stats.totalUsers - stats.activeUsers}</strong></span>
                      </>
                    ) : (
                      <span>Nouveaux inscrits : <strong className="text-vertSenegal font-bold">{stats.newUsers}</strong></span>
                    )}
                  </div>
                </div>

                {/* Orders Widget */}
                <div className="bg-charcoal border border-charcoal-light/60 p-6 rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Commandes Totales</p>
                      <h3 className="text-3xl font-serif font-bold text-brass mt-2">{stats.totalOrders}</h3>
                    </div>
                    <div className="bg-brass/10 p-3 rounded-full text-brass">
                      <Icon name="orders" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-charcoal-light/50 text-xs text-gray-400">
                    <span>{statsPeriod === 'all' ? 'Créées sur toute la période' : 'Créées sur l\'intervalle sélectionné'}</span>
                  </div>
                </div>

                {/* Subscriptions Revenue Widget */}
                <div className="bg-charcoal border border-charcoal-light/60 p-6 rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Chiffre d'affaires SaaS</p>
                      <h3 className="text-2xl font-bold text-vertSenegal mt-2">
                        {stats.subscriptionRevenue.toLocaleString('fr-FR')} FCFA
                      </h3>
                    </div>
                    <div className="bg-vertSenegal/10 p-3 rounded-full text-vertSenegal">
                      <Icon name="billing" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-charcoal-light/50 text-xs text-gray-400">
                    <span>{statsPeriod === 'all' ? 'Revenus cumulés des abonnements' : 'Générés sur la période'}</span>
                  </div>
                </div>

                {/* Transaction Volume Widget */}
                <div className="bg-charcoal border border-charcoal-light/60 p-6 rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Volume Financier</p>
                      <h3 className="text-2xl font-bold text-brass mt-2">
                        {stats.transactionVolume.toLocaleString('fr-FR')} FCFA
                      </h3>
                    </div>
                    <div className="bg-brass/10 p-3 rounded-full text-brass">
                      <Icon name="chart" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-charcoal-light/50 text-xs text-gray-400 flex justify-between">
                    <span>Commissions ({stats.commissionRate}%) :</span>
                    <strong className="text-vertSenegal font-bold">{stats.projectedCommission.toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                </div>

              </div>

              {/* Litiges widget header & quick view */}
              <div className="bg-charcoal border border-charcoal-light/60 p-6 rounded-lg shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-rougeSenegal/10 p-2 rounded text-rougeSenegal">
                      <Icon name="alert" className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-brass">Alerte de Litiges Actifs</h4>
                      <p className="text-xs text-gray-400">Litiges clients en attente de médiation ou d'ajustements</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    stats.activeDisputes > 0 ? 'bg-rougeSenegal-dark text-white animate-pulse' : 'bg-vertSenegal-dark text-white'
                  }`}>
                    {stats.activeDisputes} litige(s) actif(s)
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  {stats.activeDisputes > 0 
                    ? "Veuillez consulter l'onglet 'Gestion des Litiges' pour résoudre les réclamations des clients ou contacter les gérants d'atelier concernés."
                    : "Aucun litige critique en cours. La plateforme fonctionne de manière optimale."}
                </p>
              </div>
            </div>
          )}

          {/* ================= USERS TAB ================= */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Search & Filter Bar */}
              <div className="bg-charcoal border border-charcoal-light/60 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
                
                {/* Search */}
                <div className="w-full md:w-80 relative">
                  <input
                    type="text"
                    placeholder="Rechercher email ou atelier..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-4 py-2 pl-10 text-sm focus:outline-none focus:border-brass text-left"
                  />
                  <Icon name="clients" className="w-4 h-4 text-brass absolute left-3 top-3 opacity-60" />
                </div>

                {/* Filters */}
                <div className="flex gap-4 w-full md:w-auto">
                  <select
                    value={userPlanFilter}
                    onChange={(e) => setUserPlanFilter(e.target.value)}
                    className="bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass"
                  >
                    <option value="All">Tous les Plans</option>
                    <option value="FREE">FREE</option>
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="QUARTERLY">QUARTERLY</option>
                  </select>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass"
                  >
                    <option value="All">Tous les Statuts</option>
                    <option value="active">Actifs</option>
                    <option value="blocked">Bloqués</option>
                  </select>
                </div>

              </div>

              {/* Users Table */}
              <div className="bg-charcoal border border-charcoal-light/60 rounded-lg shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-charcoal-dark border-b border-charcoal-light text-brass font-serif text-sm">
                      <th className="p-4">Atelier / Gérant</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Plan SaaS</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4">Droits Admin</th>
                      <th className="p-4">Date d'inscription</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-gray-400 text-sm">
                          Aucun utilisateur ne correspond aux filtres.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-charcoal-light/40 hover:bg-charcoal-light/20 text-sm transition-colors">
                          <td className="p-4 font-medium text-brass-light">{user.atelierName || "Atelier Sans Nom"}</td>
                          <td className="p-4 font-mono text-xs">{user.email}</td>
                          <td className="p-4">
                            <span className="font-semibold text-xs bg-thioup/50 border border-thioup text-brass-light px-2.5 py-0.5 rounded">
                              {user.plan}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              user.status === 'active' ? 'bg-vertSenegal/20 text-vertSenegal' : 'bg-rougeSenegal/20 text-rougeSenegal'
                            }`}>
                              {user.status === 'active' ? 'Actif' : 'Bloqué'}
                            </span>
                          </td>
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={user.isAdmin}
                              onChange={() => toggleUserAdmin(user)}
                              className="w-4 h-4 rounded accent-brass bg-charcoal-dark border-charcoal-light"
                            />
                          </td>
                          <td className="p-4 text-gray-400 text-xs">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {/* Edit Plan Button */}
                            <button
                              onClick={() => setEditingUserPlan(user)}
                              className="text-xs bg-brass/20 text-brass border border-brass/40 px-2 py-1 rounded hover:bg-brass hover:text-charcoal transition-colors"
                            >
                              Changer Plan
                            </button>
                            
                            {/* Block / Unblock Button */}
                            <button
                              onClick={() => toggleUserStatus(user)}
                              className={`text-xs px-2 py-1 rounded border transition-colors ${
                                user.status === 'active' 
                                  ? 'bg-rougeSenegal/20 border-rougeSenegal/40 text-rougeSenegal hover:bg-rougeSenegal hover:text-white'
                                  : 'bg-vertSenegal/20 border-vertSenegal/40 text-vertSenegal hover:bg-vertSenegal hover:text-white'
                              }`}
                            >
                              {user.status === 'active' ? 'Bloquer' : 'Débloquer'}
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="text-xs bg-charcoal-dark border border-rougeSenegal/30 hover:border-rougeSenegal text-rougeSenegal px-2 py-1 rounded transition-colors"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= DISPUTES TAB ================= */}
          {activeTab === 'disputes' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Options Header */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-charcoal border border-charcoal-light/60 p-4 rounded-lg shadow-sm">
                {/* Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Statut des Litiges :</span>
                  <select
                    value={disputeStatusFilter}
                    onChange={(e) => setDisputeStatusFilter(e.target.value)}
                    className="bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass"
                  >
                    <option value="All">Tous les Litiges</option>
                    <option value="pending">En attente (Pending)</option>
                    <option value="in_progress">En traitement</option>
                    <option value="resolved">Résolus</option>
                    <option value="closed">Fermés</option>
                  </select>
                </div>

                {/* Create dispute trigger */}
                <button
                  onClick={() => setShowCreateDispute(true)}
                  className="bg-brass hover:bg-brass-light text-charcoal font-semibold py-2 px-4 rounded text-sm transition-colors flex items-center gap-2"
                >
                  <Icon name="plus" className="w-4 h-4 text-charcoal" />
                  <span>Signaler un litige</span>
                </button>
              </div>

              {/* Disputes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDisputes.length === 0 ? (
                  <div className="col-span-2 bg-charcoal border border-charcoal-light/60 p-8 rounded-lg text-center text-gray-400">
                    Aucun litige enregistré sous ce filtre.
                  </div>
                ) : (
                  filteredDisputes.map(disp => (
                    <div key={disp.id} className="bg-charcoal border border-charcoal-light/60 p-6 rounded-lg shadow-xl flex flex-col justify-between space-y-4">
                      
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                            disp.status === 'pending' ? 'bg-terracotta/20 text-terracotta' :
                            disp.status === 'in_progress' ? 'bg-thioup/40 text-brass-light border border-thioup' :
                            disp.status === 'resolved' ? 'bg-vertSenegal/20 text-vertSenegal' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {disp.status === 'pending' && 'En attente'}
                            {disp.status === 'in_progress' && 'En cours'}
                            {disp.status === 'resolved' && 'Résolu'}
                            {disp.status === 'closed' && 'Fermé'}
                          </span>
                          <h4 className="text-base font-serif font-bold text-brass mt-2">{disp.title}</h4>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteDispute(disp.id)}
                          className="text-gray-500 hover:text-rougeSenegal p-1 transition-colors"
                          title="Supprimer le litige de la plateforme"
                        >
                          <Icon name="trash" className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300 leading-relaxed font-light">{disp.description}</p>

                      {/* Meta information */}
                      <div className="bg-charcoal-dark/50 p-3 rounded text-xs space-y-2 border border-charcoal-light/30">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Atelier impliqué :</span>
                          <span className="font-semibold text-brass-light">{disp.atelierName} ({disp.userEmail})</span>
                        </div>
                        {disp.clientName && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Client réclamant :</span>
                            <span className="font-semibold text-cream-light">{disp.clientName}</span>
                          </div>
                        )}
                        {disp.orderId && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Commande associée :</span>
                            <span className="font-mono text-brass-light">{disp.orderId}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-charcoal-light/30 pt-2 text-[10px] text-gray-500">
                          <span>Créé : {new Date(disp.createdAt).toLocaleDateString('fr-FR')}</span>
                          <span>Mis à jour : {new Date(disp.updatedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      {/* Admin notes */}
                      {disp.adminNotes && (
                        <div className="border-l-2 border-brass bg-brass/5 p-3 rounded text-xs">
                          <p className="font-semibold text-brass">Notes de l'Administrateur :</p>
                          <p className="text-gray-300 mt-1 italic">"{disp.adminNotes}"</p>
                        </div>
                      )}

                      {/* Edit Trigger */}
                      <button
                        onClick={() => {
                          setEditingDispute(disp);
                          setDisputeNotesText(disp.adminNotes || '');
                          setDisputeStatusText(disp.status);
                        }}
                        className="w-full bg-charcoal-light hover:bg-brass hover:text-charcoal border border-brass/20 text-brass font-semibold text-xs py-2 rounded transition-colors"
                      >
                        Traiter le litige / Modifier Notes
                      </button>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-xl">
              <div className="bg-charcoal border border-charcoal-light/60 p-8 rounded-lg shadow-xl space-y-6">
                
                <div className="flex items-center gap-3">
                  <div className="bg-brass/10 p-2.5 rounded text-brass">
                    <Icon name="billing" className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-brass">Frais de Commission de la Plateforme</h4>
                    <p className="text-xs text-gray-400">Configurez le pourcentage prélevé sur les commandes clients payées en ligne</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateCommission} className="space-y-6">
                  
                  {/* Current setting representation */}
                  <div className="bg-charcoal-dark p-6 rounded border border-charcoal-light flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">Taux de Commission Actuel</span>
                      <span className="text-sm text-gray-300 block mt-1">Appliqué à tous les ateliers</span>
                    </div>
                    <span className="text-4xl font-mono font-bold text-brass">{commissionRate} %</span>
                  </div>

                  {/* Input field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brass-light block">Nouveau Taux de Commission (%) :</label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                        className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-4 py-2 text-sm focus:outline-none focus:border-brass text-left font-mono"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-brass hover:bg-brass-light text-charcoal font-bold py-2 px-6 rounded text-sm transition-colors shadow-lg"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>

                  {/* Information block */}
                  <div className="border-t border-charcoal-light/40 pt-4 text-xs text-gray-400 space-y-2">
                    <p className="font-semibold text-brass-light">ℹ️ Note explicative :</p>
                    <p>Le taux de commission est appliqué à titre indicatif ou prélevé directement lors des transferts de fonds vers le compte bancaire/mobile money des ateliers de couture.</p>
                    <p>Changer ce taux mettra instantanément à jour le calcul des <strong className="text-vertSenegal">Commissions prévisionnelles</strong> sur le tableau de bord admin.</p>
                  </div>

                </form>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= EDIT PLAN MODAL ================= */}
      {editingUserPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal border border-charcoal-light max-w-sm w-full rounded-lg shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-serif font-bold text-brass">Changer le Plan SaaS</h4>
              <button 
                onClick={() => setEditingUserPlan(null)}
                className="text-gray-400 hover:text-white"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-400">Modifier l'abonnement pour : <strong className="text-cream-light">{editingUserPlan.email}</strong></p>
            
            <div className="flex flex-col gap-2 pt-2">
              {['FREE', 'MONTHLY', 'QUARTERLY'].map(plan => (
                <button
                  key={plan}
                  onClick={() => handleUpdatePlan(editingUserPlan.id, plan)}
                  className={`w-full py-2.5 px-4 rounded text-sm font-semibold border transition-colors text-left ${
                    editingUserPlan.plan === plan
                      ? 'bg-brass text-charcoal border-brass'
                      : 'bg-charcoal-dark text-brass-light border-charcoal-light hover:bg-charcoal-light'
                  }`}
                >
                  {plan} {plan === 'FREE' ? '(Gratuit)' : plan === 'MONTHLY' ? '(Mensuel)' : '(Trimestriel)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT DISPUTE STATUS/NOTES MODAL ================= */}
      {editingDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateDispute} className="bg-charcoal border border-charcoal-light max-w-md w-full rounded-lg shadow-2xl p-6 space-y-4">
            
            <div className="flex justify-between items-center">
              <h4 className="text-base font-serif font-bold text-brass">Traiter le Litige</h4>
              <button 
                type="button"
                onClick={() => setEditingDispute(null)}
                className="text-gray-400 hover:text-white"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">Litige : <strong className="text-cream-light">{editingDispute.title}</strong></p>

            {/* Status Select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brass-light">Statut du litige :</label>
              <select
                value={disputeStatusText}
                onChange={(e) => setDisputeStatusText(e.target.value)}
                className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass"
              >
                <option value="pending">En attente (Pending)</option>
                <option value="in_progress">En traitement (In progress)</option>
                <option value="resolved">Résolu (Resolved)</option>
                <option value="closed">Fermé (Closed)</option>
              </select>
            </div>

            {/* Admin Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brass-light">Notes de l'administrateur (Interne) :</label>
              <textarea
                value={disputeNotesText}
                onChange={(e) => setDisputeNotesText(e.target.value)}
                rows="4"
                placeholder="Ajouter des notes sur les mesures prises, appels avec l'atelier..."
                className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass text-left"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-brass hover:bg-brass-light text-charcoal font-bold py-2 rounded text-sm transition-colors"
            >
              Enregistrer les modifications
            </button>

          </form>
        </div>
      )}

      {/* ================= CREATE DISPUTE MODAL ================= */}
      {showCreateDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateDispute} className="bg-charcoal border border-charcoal-light max-w-md w-full rounded-lg shadow-2xl p-6 space-y-4">
            
            <div className="flex justify-between items-center">
              <h4 className="text-base font-serif font-bold text-brass">Signaler un Litige Client</h4>
              <button 
                type="button"
                onClick={() => setShowCreateDispute(false)}
                className="text-gray-400 hover:text-white"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Workshop (User ID) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brass-light">Atelier / Gérant (Email) :</label>
              <select
                value={newDispute.userId}
                onChange={(e) => setNewDispute({ ...newDispute, userId: e.target.value })}
                className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass"
                required
              >
                <option value="">Sélectionnez un atelier</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.atelierName} ({u.email})</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brass-light">Titre du litige :</label>
              <input
                type="text"
                placeholder="Ex: Erreur de couture sur col grand boubou"
                value={newDispute.title}
                onChange={(e) => setNewDispute({ ...newDispute, title: e.target.value })}
                className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass text-left"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brass-light">Description détaillée :</label>
              <textarea
                placeholder="Expliquez la réclamation du client et le problème survenu..."
                value={newDispute.description}
                onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                rows="3"
                className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass text-left"
                required
              />
            </div>

            {/* Client Name (Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brass-light">Nom du Client (Optionnel) :</label>
              <input
                type="text"
                placeholder="Ex: Mame Diarra"
                value={newDispute.clientName}
                onChange={(e) => setNewDispute({ ...newDispute, clientName: e.target.value })}
                className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass text-left"
              />
            </div>

            {/* Order ID (Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brass-light">Identifiant de commande (Optionnel) :</label>
              <input
                type="text"
                placeholder="Ex: ord_1"
                value={newDispute.orderId}
                onChange={(e) => setNewDispute({ ...newDispute, orderId: e.target.value })}
                className="w-full bg-charcoal-dark border border-charcoal-light text-cream-light rounded px-3 py-2 text-sm focus:outline-none focus:border-brass text-left"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-brass hover:bg-brass-light text-charcoal font-bold py-2 rounded text-sm transition-colors"
            >
              Créer le litige
            </button>

          </form>
        </div>
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
                <p className="text-sm text-gray-300 leading-relaxed font-light">
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

    </div>
  );
}
