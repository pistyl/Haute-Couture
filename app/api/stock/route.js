import { query } from '../../../lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        id, 
        name, 
        type, 
        quantity, 
        unit, 
        alert_threshold as "alertThreshold" 
      FROM stock 
      ORDER BY name
    `);

    // Parse numeric columns
    const stockItems = res.rows.map(item => ({
      ...item,
      quantity: parseFloat(item.quantity) || 0,
      alertThreshold: parseFloat(item.alertThreshold) || 0
    }));

    return Response.json(stockItems);
  } catch (error) {
    console.error("GET stock error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, name, type, quantity, unit, alertThreshold } = await request.json();
    await query(
      'INSERT INTO stock (id, name, type, quantity, unit, alert_threshold) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, name, type, quantity, unit, alertThreshold]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST stock error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    // Check if it is a simple quantity adjustment or full update
    if ('quantity' in body && Object.keys(body).length === 2 && 'id' in body) {
      await query('UPDATE stock SET quantity = $1 WHERE id = $2', [body.quantity, body.id]);
    } else {
      const { id, name, type, quantity, unit, alertThreshold } = body;
      await query(
        `UPDATE stock SET 
          name = $1, 
          type = $2, 
          quantity = $3, 
          unit = $4, 
          alert_threshold = $5 
        WHERE id = $6`,
        [name, type, quantity, unit, alertThreshold, id]
      );
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT stock error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    await query('DELETE FROM stock WHERE id = $1', [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE stock error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
