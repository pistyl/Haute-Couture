import { query } from '../../../lib/db';
import { getUserSession } from '../../../lib/auth';

export async function GET(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const res = await query(`
      SELECT 
        id, 
        name, 
        type, 
        quantity, 
        unit, 
        alert_threshold as "alertThreshold" 
      FROM stock 
      WHERE user_id = $1
      ORDER BY name
    `, [userId]);

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
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id, name, type, quantity, unit, alertThreshold } = await request.json();
    await query(
      'INSERT INTO stock (id, name, type, quantity, unit, alert_threshold, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, name, type, quantity, unit, alertThreshold, userId]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST stock error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();

    if ('quantity' in body && Object.keys(body).length === 2 && 'id' in body) {
      await query('UPDATE stock SET quantity = $1 WHERE id = $2 AND user_id = $3', [body.quantity, body.id, userId]);
    } else {
      const { id, name, type, quantity, unit, alertThreshold } = body;
      await query(
        `UPDATE stock SET 
          name = $1, 
          type = $2, 
          quantity = $3, 
          unit = $4, 
          alert_threshold = $5 
        WHERE id = $6 AND user_id = $7`,
        [name, type, quantity, unit, alertThreshold, id, userId]
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
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    await query('DELETE FROM stock WHERE id = $1 AND user_id = $2', [id, userId]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE stock error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
