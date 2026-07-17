import { query } from '../../../../lib/db';
import { hashPassword, createSessionToken, getSessionCookieString } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password, atelierName } = await request.json();
    
    if (!email || !password || !atelierName) {
      return Response.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Check if user already exists
    const checkUser = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (checkUser.rows.length > 0) {
      return Response.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const userId = `usr_${Date.now()}`;
    const hashed = hashPassword(password);

    await query('BEGIN');

    // Create user
    await query(
      'INSERT INTO users (id, email, password_hash, atelier_name) VALUES ($1, $2, $3, $4)',
      [userId, email.toLowerCase().trim(), hashed, atelierName.trim()]
    );

    // Seed default config for this user
    await query(
      'INSERT INTO workshop_config (nom_atelier, devise, user_id) VALUES ($1, $2, $3)',
      [atelierName.trim(), 'FCFA', userId]
    );

    // Seed default employees for this user
    const defaultEmployees = [
      { id: `emp_1_${Date.now()}`, name: "Moustapha Ndiaye", role: "Maître Brodeur" },
      { id: `emp_2_${Date.now()}`, name: "Seydou Diop", role: "Coupeur Basin" },
      { id: `emp_3_${Date.now()}`, name: "Awa Sow", role: "Couturière Senior - Wax" }
    ];

    for (const emp of defaultEmployees) {
      await query(
        'INSERT INTO employees (id, name, role, user_id) VALUES ($1, $2, $3, $4)',
        [emp.id, emp.name, emp.role, userId]
      );
    }

    // Seed default stock items for this user
    const defaultStock = [
      { id: `stk_1_${Date.now()}`, name: "Wax Hollandais Véritable (Motif Hirondelle)", type: "Tissu", quantity: 4, unit: "yards", alert_threshold: 12 },
      { id: `stk_2_${Date.now()}`, name: "Basin Riche Getzner Blanc", type: "Tissu", quantity: 35, unit: "mètres", alert_threshold: 10 },
      { id: `stk_3_${Date.now()}`, name: "Fils d'or pour broderie de fête", type: "Fourniture", quantity: 8, unit: "bobines", alert_threshold: 10 }
    ];

    for (const stk of defaultStock) {
      await query(
        'INSERT INTO stock (id, name, type, quantity, unit, alert_threshold, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [stk.id, stk.name, stk.type, stk.quantity, stk.unit, stk.alert_threshold, userId]
      );
    }

    await query('COMMIT');

    const token = createSessionToken(userId);
    const cookie = getSessionCookieString(token);

    return Response.json(
      { success: true, user: { id: userId, email, atelierName } },
      {
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    await query('ROLLBACK');
    console.error("Registration error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
