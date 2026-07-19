const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


// 1. Manually parse .env.local to avoid adding dotenv package
const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^DATABASE_URL=(.+)$/m);
  if (match) {
    databaseUrl = match[1].trim();
  }
}

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is missing!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Default dataset
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
        poitrine: 98, taille: 76, hanches: 108, epaules: 42, manches: 60,
        longueurPantalon: 106, entrejambe: 82, cou: 38, hauteurBuste: 44, poignet: 16
      }
    },
    {
      id: "cli_2",
      name: "Amadou Fall",
      phone: "+221 78 987 65 43",
      notes: "Demande un grand boubou classique 3 pièces très ample. Sensible aux finitions intérieures de l'encolure. Teinture indigo thioup artisanal uniquement.",
      measurements: {
        poitrine: 110, taille: 96, hanches: 112, epaules: 50, manches: 65,
        longueurPantalon: 104, entrejambe: 80, cou: 44, hauteurBuste: 46, poignet: 19
      }
    },
    {
      id: "cli_3",
      name: "Rokhaya Diallo",
      phone: "+221 76 555 44 33",
      notes: "Préfère les coupes près du corps pour ses jupes et vestes en Wax hollandais. Demande des poches latérales invisibles sur la robe.",
      measurements: {
        poitrine: 90, taille: 66, hanches: 94, epaules: 39, manches: 58,
        longueurPantalon: 102, entrejambe: 78, cou: 35, hauteurBuste: 41, poignet: 14
      }
    }
  ],
  orders: [
    {
      id: "ord_1", clientId: "cli_1",
      description: "Grand Boubou 3 pièces en Basin riche blanc avec broderies d'or complexes",
      status: "En couture", dateOrdered: "2026-07-02", dateDelivery: "2026-07-28",
      price: 150000, advance: 50000, assignedTo: "emp_1",
      notes: "Broderie d'or fin. Encolure ronde traditionnelle."
    },
    {
      id: "ord_2", clientId: "cli_2",
      description: "Boubou traditionnel en Basin riche teinté bleu Indigo thioup",
      status: "En coupe", dateOrdered: "2026-06-25", dateDelivery: "2026-07-20",
      price: 120000, advance: 60000, assignedTo: "emp_2",
      notes: "Teinture thioup artisanale de Dakar. Assemblage fils noirs."
    },
    {
      id: "ord_3", clientId: "cli_3",
      description: "Robe et veste cintrée en Wax hollandais véritable motif Hirondelle",
      status: "Livrée", dateOrdered: "2026-06-10", dateDelivery: "2026-07-05",
      price: 85000, advance: 85000, assignedTo: "emp_3",
      notes: "Doublure jupe légère. Livré à la cliente."
    },
    {
      id: "ord_4", clientId: "cli_1",
      description: "Boubou traditionnel brodé en Basin Getzner bleu ciel",
      status: "Livrée", dateOrdered: "2026-05-12", dateDelivery: "2026-06-05",
      price: 180000, advance: 180000, assignedTo: "emp_1",
      notes: "Livré complet."
    },
    {
      id: "ord_5", clientId: "cli_2",
      description: "Veste saharienne et pantalon en Thioup Indigo",
      status: "Livrée", dateOrdered: "2026-04-18", dateDelivery: "2026-05-10",
      price: 110000, advance: 110000, assignedTo: "emp_2",
      notes: "Finition boutons d'or."
    },
    {
      id: "ord_6", clientId: "cli_3",
      description: "Robe longue évasée en Wax hollandais rouge",
      status: "Livrée", dateOrdered: "2026-05-04", dateDelivery: "2026-05-25",
      price: 95000, advance: 95000, assignedTo: "emp_3",
      notes: "Broderie fine noire."
    },
    {
      id: "ord_7", clientId: "cli_1",
      description: "Ensemble veste courte et jupe longue Basin brodé",
      status: "Livrée", dateOrdered: "2026-03-20", dateDelivery: "2026-04-15",
      price: 210000, advance: 210000, assignedTo: "emp_1",
      notes: "Bespoke haut de gamme."
    },
    {
      id: "ord_8", clientId: "cli_2",
      description: "Tunique cintrée et pantalon Thioup bleu indigo",
      status: "Livrée", dateOrdered: "2026-02-02", dateDelivery: "2026-02-25",
      price: 75000, advance: 75000, assignedTo: "emp_2",
      notes: "Teinture naturelle."
    }
  ],
  stock: [
    { id: "stk_1", name: "Basin Riche blanc (Getzner)", type: "Tissu", quantity: 18, unit: "mètres", alertThreshold: 6 },
    { id: "stk_2", name: "Wax Hollandais Véritable (Motif Hirondelle)", type: "Tissu", quantity: 4, unit: "yards", alertThreshold: 12 },
    { id: "stk_3", name: "Tissu Thioup Indigo artisanal (Dakar)", type: "Tissu", quantity: 12, unit: "mètres", alertThreshold: 5 },
    { id: "stk_4", name: "Fils d'or pour broderie de fête", type: "Fourniture", quantity: 8, unit: "bobines", alertThreshold: 10 },
    { id: "stk_5", name: "Boutons recouverts assortis 15mm", type: "Fourniture", quantity: 150, unit: "pièces", alertThreshold: 50 }
  ]
};

async function initDb() {
  const client = await pool.connect();
  try {
    console.log("Creating database tables...");

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS workshop_config (
        id SERIAL PRIMARY KEY,
        nom_atelier TEXT NOT NULL,
        devise TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        notes TEXT,
        measurements JSONB NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        date_ordered DATE NOT NULL,
        date_delivery DATE NOT NULL,
        price NUMERIC NOT NULL,
        advance NUMERIC NOT NULL,
        assigned_to TEXT REFERENCES employees(id) ON DELETE SET NULL,
        notes TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS stock (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity NUMERIC NOT NULL,
        unit TEXT NOT NULL,
        alert_threshold NUMERIC NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS unitechpay_payments (
        reference TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        status TEXT NOT NULL,
        method TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables created successfully.");

    // Seed Config
    const configRes = await client.query("SELECT COUNT(*) FROM workshop_config");
    if (parseInt(configRes.rows[0].count) === 0) {
      console.log("Seeding config...");
      await client.query(
        "INSERT INTO workshop_config (nom_atelier, devise) VALUES ($1, $2)",
        [defaultData.config.nomAtelier, defaultData.config.devise]
      );
    }

    // Seed Employees
    const empRes = await client.query("SELECT COUNT(*) FROM employees");
    if (parseInt(empRes.rows[0].count) === 0) {
      console.log("Seeding employees...");
      for (const emp of defaultData.employees) {
        await client.query(
          "INSERT INTO employees (id, name, role) VALUES ($1, $2, $3)",
          [emp.id, emp.name, emp.role]
        );
      }
    }

    // Seed Clients
    const clientRes = await client.query("SELECT COUNT(*) FROM clients");
    if (parseInt(clientRes.rows[0].count) === 0) {
      console.log("Seeding clients...");
      for (const cli of defaultData.clients) {
        await client.query(
          "INSERT INTO clients (id, name, phone, notes, measurements) VALUES ($1, $2, $3, $4, $5)",
          [cli.id, cli.name, cli.phone, cli.notes, JSON.stringify(cli.measurements)]
        );
      }
    }

    // Seed Orders
    const orderRes = await client.query("SELECT COUNT(*) FROM orders");
    if (parseInt(orderRes.rows[0].count) === 0) {
      console.log("Seeding orders...");
      for (const ord of defaultData.orders) {
        await client.query(
          `INSERT INTO orders 
           (id, client_id, description, status, date_ordered, date_delivery, price, advance, assigned_to, notes) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            ord.id, ord.clientId, ord.description, ord.status,
            ord.dateOrdered, ord.dateDelivery, ord.price, ord.advance,
            ord.assignedTo, ord.notes
          ]
        );
      }
    }

    // Seed Stock
    const stockRes = await client.query("SELECT COUNT(*) FROM stock");
    if (parseInt(stockRes.rows[0].count) === 0) {
      console.log("Seeding stock items...");
      for (const stk of defaultData.stock) {
        await client.query(
          "INSERT INTO stock (id, name, type, quantity, unit, alert_threshold) VALUES ($1, $2, $3, $4, $5, $6)",
          [stk.id, stk.name, stk.type, stk.quantity, stk.unit, stk.alertThreshold]
        );
      }
    }

    console.log("Database initialized and seeded successfully!");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
