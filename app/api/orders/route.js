import { query } from '../../../lib/db';

export async function GET() {
  try {
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
      ORDER BY date_ordered DESC
    `);
    
    // Numeric values are returned as string from pg because decimal/numeric can exceed JS numbers.
    // Convert price and advance to numbers for JavaScript compatibility.
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
    const { id, clientId, description, status, dateOrdered, dateDelivery, price, advance, assignedTo, notes } = await request.json();
    await query(
      `INSERT INTO orders 
       (id, client_id, description, status, date_ordered, date_delivery, price, advance, assigned_to, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, clientId, description, status, dateOrdered, dateDelivery, price, advance, assignedTo || null, notes]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST orders error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    
    // The request can be a full update or just status/advance update.
    // We can conditionally check what fields are passed or write a clean update.
    if ('status' in body && Object.keys(body).length === 2 && 'id' in body) {
      // Small status update
      await query('UPDATE orders SET status = $1 WHERE id = $2', [body.status, body.id]);
    } else if ('advance' in body && Object.keys(body).length === 2 && 'id' in body) {
      // Small advance/payment update
      await query('UPDATE orders SET advance = $1 WHERE id = $2', [body.advance, body.id]);
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
        WHERE id = $10`,
        [clientId, description, status, dateOrdered, dateDelivery, price, advance, assignedTo || null, notes, id]
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
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    await query('DELETE FROM orders WHERE id = $1', [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE orders error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
