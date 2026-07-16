import { query } from '../../../lib/db';

export async function POST(request) {
  try {
    const parsed = await request.json();
    if (!parsed.clients || !parsed.orders || !parsed.stock || !parsed.employees || !parsed.config) {
      return Response.json({ error: "Missing required tables" }, { status: 400 });
    }

    // Begin transaction
    await query('BEGIN');
    
    // Clear all existing rows
    await query('DELETE FROM orders');
    await query('DELETE FROM clients');
    await query('DELETE FROM stock');
    await query('DELETE FROM employees');
    await query('DELETE FROM workshop_config');

    // Insert new data
    await query(
      'INSERT INTO workshop_config (nom_atelier, devise) VALUES ($1, $2)',
      [parsed.config.nomAtelier, parsed.config.devise]
    );

    for (const emp of parsed.employees) {
      await query('INSERT INTO employees (id, name, role) VALUES ($1, $2, $3)', [emp.id, emp.name, emp.role]);
    }

    for (const cli of parsed.clients) {
      await query(
        'INSERT INTO clients (id, name, phone, notes, measurements) VALUES ($1, $2, $3, $4, $5)',
        [cli.id, cli.name, cli.phone, cli.notes, JSON.stringify(cli.measurements)]
      );
    }

    for (const ord of parsed.orders) {
      await query(
        `INSERT INTO orders 
         (id, client_id, description, status, date_ordered, date_delivery, price, advance, assigned_to, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          ord.id, ord.clientId, ord.description, ord.status,
          ord.dateOrdered, ord.dateDelivery, ord.price, ord.advance,
          ord.assignedTo || null, ord.notes
        ]
      );
    }

    for (const stk of parsed.stock) {
      const alertThreshold = 'alertThreshold' in stk ? stk.alertThreshold : stk.alert_threshold;
      await query(
        'INSERT INTO stock (id, name, type, quantity, unit, alert_threshold) VALUES ($1, $2, $3, $4, $5, $6)',
        [stk.id, stk.name, stk.type, stk.quantity, stk.unit, alertThreshold]
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
