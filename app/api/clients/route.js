import { query } from '../../../lib/db';
import { getUserSession } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const res = await query('SELECT * FROM clients WHERE user_id = $1 ORDER BY name', [userId]);
    return Response.json(res.rows);
  } catch (error) {
    console.error("GET clients error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id, name, phone, notes, measurements } = await request.json();
    await query(
      'INSERT INTO clients (id, name, phone, notes, measurements, user_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, name, phone, notes, JSON.stringify(measurements), userId]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST clients error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id, name, phone, notes, measurements } = await request.json();
    await query(
      'UPDATE clients SET name = $1, phone = $2, notes = $3, measurements = $4 WHERE id = $5 AND user_id = $6',
      [name, phone, notes, JSON.stringify(measurements), id, userId]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT clients error:", error);
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

    await query('DELETE FROM clients WHERE id = $1 AND user_id = $2', [id, userId]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE clients error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
