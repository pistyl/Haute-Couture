import React, { useState, useMemo } from 'react';
import Icon from './Icons';

export default function AnalyticsView({ data, darkMode }) {
  const [period, setPeriod] = useState("thisYear"); // "thisMonth", "lastMonth", "thisYear", "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getClientName = (clientId) => {
    const client = data.clients.find(c => c.id === clientId);
    return client ? client.name : "Client Inconnu";
  };

  const getEmployeeName = (empId) => {
    const emp = data.employees.find(e => e.id === empId);
    return emp ? emp.name : "Non assigné";
  };

  // --- PERIOD DATE RANGES ---
  const activeDateRange = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let start = new Date(currentYear, 0, 1);
    let end = new Date(currentYear, 11, 31);

    if (period === "thisMonth") {
      start = new Date(currentYear, currentMonth, 1);
      end = new Date(currentYear, currentMonth + 1, 0);
    } else if (period === "lastMonth") {
      start = new Date(currentYear, currentMonth - 1, 1);
      end = new Date(currentYear, currentMonth, 0);
    } else if (period === "thisYear") {
      start = new Date(currentYear, 0, 1);
      end = new Date(currentYear, 11, 31);
    } else if (period === "custom") {
      start = startDate ? new Date(startDate) : new Date(currentYear - 2, 0, 1);
      end = endDate ? new Date(endDate) : new Date(currentYear + 2, 11, 31);
    }

    return { start, end };
  }, [period, startDate, endDate]);

  // --- FILTERED ORDERS BY PERIOD ---
  const periodOrders = useMemo(() => {
    return data.orders.filter(order => {
      if (!order.dateOrdered) return false;
      const orderDate = new Date(order.dateOrdered);
      return orderDate >= activeDateRange.start && orderDate <= activeDateRange.end;
    });
  }, [data.orders, activeDateRange]);

  // --- FINANCIAL STATS ---
  const stats = useMemo(() => {
    const potentialRevenue = periodOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    const collectedRevenue = periodOrders.reduce((sum, o) => sum + (o.advance || 0), 0);
    const remainingRevenue = potentialRevenue - collectedRevenue;
    const orderCount = periodOrders.length;

    return {
      potentialRevenue,
      collectedRevenue,
      remainingRevenue,
      orderCount
    };
  }, [periodOrders]);

  // --- 6 MONTHS REVENUE CHART COMPUTATION ---
  const last6MonthsData = useMemo(() => {
    const monthsNames = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
    const result = [];
    const now = new Date();
    
    // We compute the last 6 months up to the current month
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const label = `${monthsNames[monthIdx]} ${year}`;
      
      // Calculate revenue and collection for this specific month
      const monthOrders = data.orders.filter(o => {
        if (!o.dateOrdered) return false;
        const oDate = new Date(o.dateOrdered);
        return oDate.getFullYear() === year && oDate.getMonth() === monthIdx;
      });

      const totalRevenue = monthOrders.reduce((sum, o) => sum + (o.price || 0), 0);
      const totalCollected = monthOrders.reduce((sum, o) => sum + (o.advance || 0), 0);

      result.push({
        label,
        revenue: totalRevenue,
        collected: totalCollected
      });
    }

    // Find the maximum value to scale the bars
    const maxVal = Math.max(...result.map(r => r.revenue), 10000); // minimum scale 10,000

    return result.map(r => ({
      ...r,
      revenuePercentage: (r.revenue / maxVal) * 100,
      collectedPercentage: (r.collected / maxVal) * 100
    }));
  }, [data.orders]);

  // --- WORK STATUS BREAKDOWN ---
  const statusBreakdown = useMemo(() => {
    const orderSteps = ["Nouvelle", "En coupe", "En couture", "Essayage", "Prête", "Livrée"];
    const counts = orderSteps.reduce((acc, step) => {
      acc[step] = periodOrders.filter(o => o.status === step).length;
      return acc;
    }, {});

    const total = periodOrders.length || 1;
    return orderSteps.map(step => ({
      status: step,
      count: counts[step],
      percentage: (counts[step] / total) * 100
    }));
  }, [periodOrders]);

  // --- ARTISANS LEADERBOARD ---
  const artisansStats = useMemo(() => {
    return data.employees.map(emp => {
      const empOrders = periodOrders.filter(o => o.assignedTo === emp.id);
      const revenue = empOrders.reduce((sum, o) => sum + (o.price || 0), 0);
      const collected = empOrders.reduce((sum, o) => sum + (o.advance || 0), 0);
      const count = empOrders.length;
      return {
        ...emp,
        revenue,
        collected,
        count
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [data.employees, periodOrders]);

  // --- FABRIC POPULARITY ---
  const fabricStats = useMemo(() => {
    let basinCount = 0;
    let waxCount = 0;
    let thioupCount = 0;
    let autreCount = 0;

    periodOrders.forEach(o => {
      const desc = o.description.toLowerCase();
      if (desc.includes("basin")) basinCount++;
      else if (desc.includes("wax")) waxCount++;
      else if (desc.includes("thioup")) thioupCount++;
      else autreCount++;
    });

    const total = periodOrders.length || 1;

    return [
      { name: "Basin Riche", count: basinCount, percentage: (basinCount / total) * 100, color: "bg-brass" },
      { name: "Wax Hollandais", count: waxCount, percentage: (waxCount / total) * 100, color: "bg-thioup" },
      { name: "Thioup Artisanal", count: thioupCount, percentage: (thioupCount / total) * 100, color: "bg-terracotta" },
      { name: "Autres / Mercerie", count: autreCount, percentage: (autreCount / total) * 100, color: "bg-gray-400" }
    ].sort((a, b) => b.count - a.count);
  }, [periodOrders]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* PERIOD FILTERS BAR */}
      <div className={`p-4 rounded border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "thisMonth", label: "Ce Mois" },
            { id: "lastMonth", label: "Mois Dernier" },
            { id: "thisYear", label: "Cette Année" },
            { id: "custom", label: "Période Personnalisée" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium border transition-all ${
                period === p.id
                  ? 'bg-brass border-brass text-charcoal font-bold'
                  : darkMode
                  ? 'bg-charcoal-light border-charcoal-light text-gray-300 hover:text-white'
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-charcoal-dark'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {period === "custom" && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`text-xs rounded px-2.5 py-1.5 border font-mono focus:outline-none focus:border-brass ${
                darkMode ? 'bg-charcoal-light border-charcoal-light text-white' : 'bg-gray-50 border-gray-200 text-charcoal'
              }`}
            />
            <span className="text-xs text-gray-500 font-mono">au</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`text-xs rounded px-2.5 py-1.5 border font-mono focus:outline-none focus:border-brass ${
                darkMode ? 'bg-charcoal-light border-charcoal-light text-white' : 'bg-gray-50 border-gray-200 text-charcoal'
              }`}
            />
          </div>
        )}
      </div>

      {/* PERIOD FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Orders in Period */}
        <div className={`p-5 sm:p-6 rounded border flex items-center justify-between shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Commandes Période</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-brass">{stats.orderCount}</h3>
          </div>
          <div className="bg-brass/10 p-2.5 sm:p-3 rounded-full text-brass">
            <Icon name="orders" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Potential Revenue */}
        <div className={`p-5 sm:p-6 rounded border flex items-center justify-between shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chiffre d'Affaires</span>
            <h3 className="font-mono text-xl sm:text-2xl font-bold mt-1 text-brass">{stats.potentialRevenue.toLocaleString()} {data.config.devise}</h3>
          </div>
          <div className="bg-brass/10 p-2.5 sm:p-3 rounded-full text-brass">
            <Icon name="billing" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Collected Revenue */}
        <div className={`p-5 sm:p-6 rounded border flex items-center justify-between shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenu Encaissé</span>
            <h3 className="font-mono text-xl sm:text-2xl font-bold mt-1 text-vertSenegal-light">{stats.collectedRevenue.toLocaleString()} {data.config.devise}</h3>
          </div>
          <div className="bg-vertSenegal/10 p-2.5 sm:p-3 rounded-full text-vertSenegal">
            <Icon name="check" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Remaining Revenue */}
        <div className={`p-5 sm:p-6 rounded border flex items-center justify-between shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Restant à Percevoir</span>
            <h3 className="font-mono text-xl sm:text-2xl font-bold mt-1 text-terracotta">{stats.remainingRevenue.toLocaleString()} {data.config.devise}</h3>
          </div>
          <div className="bg-terracotta/10 p-2.5 sm:p-3 rounded-full text-terracotta">
            <Icon name="info" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

      </div>

      {/* VISUAL REPORT CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* REVENUE EVOLUTION GRAPH (6 MONTHS) */}
        <div className={`lg:col-span-2 p-5 sm:p-6 rounded border flex flex-col justify-between shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <h4 className={`font-serif text-lg font-bold pb-2 border-b mb-6 ${darkMode ? 'text-white border-charcoal-light' : 'text-charcoal-dark border-gray-200'}`}>
              Évolution Financière Mensuelle (FCFA)
            </h4>
            
            {/* Visual Bar Chart */}
            <div className="h-64 flex items-end justify-around gap-2 pt-6 relative border-b border-brass/30 border-l border-brass/30 px-2 sm:px-6">
              
              {/* Y-Axis helper gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0.5 pl-1.5 opacity-10">
                <div className="w-full border-t border-gray-400"></div>
                <div className="w-full border-t border-gray-400"></div>
                <div className="w-full border-t border-gray-400"></div>
                <div className="w-full border-t border-gray-400"></div>
              </div>

              {last6MonthsData.map((m, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end max-w-[70px]">
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full mb-2 bg-charcoal-dark text-white text-[10px] rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg text-center font-mono border border-brass">
                    <span className="font-bold block text-brass">{m.label}</span>
                    <span className="block">Facturé : {m.revenue.toLocaleString()}</span>
                    <span className="block text-vertSenegal-light">Encaissé : {m.collected.toLocaleString()}</span>
                  </div>

                  {/* Revenue Bar */}
                  <div className="w-full rounded-t relative flex items-end justify-center bg-gray-500/10 h-full overflow-hidden">
                    <div 
                      style={{ height: `${m.revenuePercentage}%` }}
                      className="w-full bg-brass/30 border-t-2 border-brass rounded-t flex items-end justify-center relative transition-all duration-700 ease-out"
                    >
                      {/* Inner Encaissé Bar */}
                      <div 
                        style={{ height: `${m.revenue > 0 ? (m.collected / m.revenue) * 100 : 0}%` }}
                        className="w-full bg-vertSenegal/35 border-t-2 border-vertSenegal transition-all duration-700 ease-out"
                      />
                    </div>
                  </div>

                  {/* Values label on top of bar on desktop */}
                  {m.revenue > 0 && (
                    <span className="absolute bottom-[101%] text-[9px] font-mono font-bold text-brass pointer-events-none scale-90 sm:scale-100">
                      {(m.revenue / 1000).toFixed(0)}k
                    </span>
                  )}

                  {/* Month Label */}
                  <span className={`text-[9px] sm:text-[10px] font-mono mt-2 text-center whitespace-nowrap block transform rotate-[-15deg] sm:rotate-0 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {m.label.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend indicators */}
            <div className="flex items-center justify-center gap-6 mt-8 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-brass">
                <span className="w-3.5 h-3.5 bg-brass/30 border border-brass rounded-sm block" />
                <span>Facturé (CA)</span>
              </div>
              <div className="flex items-center gap-1.5 text-vertSenegal-light">
                <span className="w-3.5 h-3.5 bg-vertSenegal/35 border border-vertSenegal rounded-sm block" />
                <span>Encaissé Réel</span>
              </div>
            </div>
          </div>
        </div>

        {/* WORKLOAD BREAKDOWN BY STATUS */}
        <div className={`p-5 sm:p-6 rounded border flex flex-col justify-between shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <div>
            <h4 className={`font-serif text-lg font-bold pb-2 border-b mb-4 ${darkMode ? 'text-white border-charcoal-light' : 'text-charcoal-dark border-gray-200'}`}>
              Charge de Travail par Statut
            </h4>
            
            <div className="space-y-3.5">
              {statusBreakdown.map((row, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{row.status}</span>
                    <span className="font-bold text-brass">{row.count} ({row.percentage.toFixed(0)}%)</span>
                  </div>
                  
                  {/* Progress bar background */}
                  <div className={`w-full h-2 rounded overflow-hidden ${darkMode ? 'bg-charcoal-light' : 'bg-gray-100'}`}>
                    <div 
                      style={{ width: `${row.percentage}%` }}
                      className="bg-brass h-full rounded transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* LEADERBOARD ARTISANS */}
        <div className={`lg:col-span-2 p-5 sm:p-6 rounded border flex flex-col shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <h4 className={`font-serif text-lg font-bold pb-2 border-b mb-4 ${darkMode ? 'text-white border-charcoal-light' : 'text-charcoal-dark border-gray-200'}`}>
            Performance des Artisans de l'Atelier
          </h4>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-charcoal-light text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                  <th className="py-2.5 font-semibold">Artisan</th>
                  <th className="py-2.5 font-semibold text-center">Commandes</th>
                  <th className="py-2.5 font-semibold text-right">CA Bâti (FCFA)</th>
                  <th className="py-2.5 font-semibold text-right">Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/10">
                {artisansStats.map(art => (
                  <tr key={art.id} className={darkMode ? 'text-gray-300' : 'text-charcoal-dark'}>
                    <td className="py-3 font-serif font-bold text-sm">
                      {art.name}
                      <span className={`block font-mono text-[10px] font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{art.role}</span>
                    </td>
                    <td className="py-3 text-center text-sm font-bold text-brass">{art.count}</td>
                    <td className="py-3 text-right text-sm">{art.revenue.toLocaleString()}</td>
                    <td className="py-3 text-right text-sm text-vertSenegal-light font-bold">{art.collected.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TISSUS POPULARITY BREAKDOWN */}
        <div className={`p-5 sm:p-6 rounded border flex flex-col shadow-sm transition-colors ${
          darkMode ? 'bg-charcoal border-charcoal-light' : 'bg-white border-gray-200'
        }`}>
          <h4 className={`font-serif text-lg font-bold pb-2 border-b mb-4 ${darkMode ? 'text-white border-charcoal-light' : 'text-charcoal-dark border-gray-200'}`}>
            Tissus & Mercerie Populaires
          </h4>
          
          <div className="space-y-4">
            {fabricStats.map((fab, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{fab.name}</span>
                  <span className="font-bold text-brass">{fab.count} cmd{fab.count > 1 ? 's' : ''} ({fab.percentage.toFixed(0)}%)</span>
                </div>
                <div className={`w-full h-2 rounded overflow-hidden ${darkMode ? 'bg-charcoal-light' : 'bg-gray-100'}`}>
                  <div 
                    style={{ width: `${fab.percentage}%` }}
                    className={`${fab.color} h-full rounded transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
