import { query } from '../../../lib/db';
import { getUserSession } from '../../../lib/auth';

export async function POST(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const parsed = await request.json();
    if (!parsed.clients || !parsed.orders || !parsed.stock || !parsed.employees || !parsed.config) {
      return Response.json({ error: "Missing required tables" }, { status: 400 });
    }

    // Begin transaction
    await query('BEGIN');
    
    // Clear all existing rows for this user only!
    await query('DELETE FROM orders WHERE user_id = $1', [userId]);
    await query('DELETE FROM clients WHERE user_id = $1', [userId]);
    await query('DELETE FROM stock WHERE user_id = $1', [userId]);
    await query('DELETE FROM employees WHERE user_id = $1', [userId]);
    await query('DELETE FROM workshop_config WHERE user_id = $1', [userId]);

    // Insert imported data associated with the user_id
    await query(
      'INSERT INTO workshop_config (nom_atelier, devise, user_id) VALUES ($1, $2, $3)',
      [parsed.config.nomAtelier || 'Atelier Baobab', parsed.config.devise || 'FCFA', userId]
    );

    for (const emp of parsed.employees) {
      await query('INSERT INTO employees (id, name, role, user_id) VALUES ($1, $2, $3, $4)', [emp.id, emp.name, emp.role, userId]);
    }

    for (const cli of parsed.clients) {
      await query(
        'INSERT INTO clients (id, name, phone, notes, measurements, user_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [cli.id, cli.name, cli.phone, cli.notes, JSON.stringify(cli.measurements), userId]
      );
    }

    for (const ord of parsed.orders) {
      await query(
        `INSERT INTO orders 
         (id, client_id, description, status, date_ordered, date_delivery, price, advance, assigned_to, notes, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          ord.id, ord.clientId, ord.description, ord.status,
          ord.dateOrdered, ord.dateDelivery, ord.price, ord.advance,
          ord.assignedTo || null, ord.notes, userId
        ]
      );
    }

    for (const stk of parsed.stock) {
      const alertThreshold = 'alertThreshold' in stk ? stk.alertThreshold : stk.alert_threshold;
      await query(
        'INSERT INTO stock (id, name, type, quantity, unit, alert_threshold, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [stk.id, stk.name, stk.type, stk.quantity, stk.unit, alertThreshold, userId]
      );
    }

    await query('COMMIT');
    return Response.json({ success: true });
  } catch (error) {
    await query('ROLLBACK');
    console.error("POST import error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
