import { query } from '../../../lib/db';
import { getUserSession } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const res = await query(`
      SELECT 
        id, 
        client_id as "clientId", 
        description, 
        status, 
        to_char(date_ordered, 'YYYY-MM-DD') as "dateOrdered", 
        to_char(date_delivery, 'YYYY-MM-DD') as "dateDelivery", 
        price, 
        advance, 
        assigned_to as "assignedTo", 
        notes 
      FROM orders 
      WHERE user_id = $1
      ORDER BY date_ordered DESC
    `, [userId]);
    
    const orders = res.rows.map(o => ({
      ...o,
      price: parseFloat(o.price) || 0,
      advance: parseFloat(o.advance) || 0
    }));

    return Response.json(orders);
  } catch (error) {
    console.error("GET orders error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id, clientId, description, status, dateOrdered, dateDelivery, price, advance, assignedTo, notes } = await request.json();
    await query(
      `INSERT INTO orders 
       (id, client_id, description, status, date_ordered, date_delivery, price, advance, assigned_to, notes, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, clientId, description, status, dateOrdered, dateDelivery, price, advance, assignedTo || null, notes, userId]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST orders error:", error);
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
    
    if ('status' in body && Object.keys(body).length === 2 && 'id' in body) {
      // Small status update
      await query('UPDATE orders SET status = $1 WHERE id = $2 AND user_id = $3', [body.status, body.id, userId]);
    } else if ('advance' in body && Object.keys(body).length === 2 && 'id' in body) {
      // Small advance/payment update
      await query('UPDATE orders SET advance = $1 WHERE id = $2 AND user_id = $3', [body.advance, body.id, userId]);
    } else {
      // Full update
      const { id, clientId, description, status, dateOrdered, dateDelivery, price, advance, assignedTo, notes } = body;
      await query(
        `UPDATE orders SET 
          client_id = $1, 
          description = $2, 
          status = $3, 
          date_ordered = $4, 
          date_delivery = $5, 
          price = $6, 
          advance = $7, 
          assigned_to = $8, 
          notes = $9 
        WHERE id = $10 AND user_id = $11`,
        [clientId, description, status, dateOrdered, dateDelivery, price, advance, assignedTo || null, notes, id, userId]
      );
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT orders error:", error);
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

    await query('DELETE FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE orders error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
