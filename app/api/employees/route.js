import { query } from '../../../lib/db';
import { getUserSession } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const res = await query('SELECT * FROM employees WHERE user_id = $1 ORDER BY id', [userId]);
    return Response.json(res.rows);
  } catch (error) {
    console.error("GET employees error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id, name, role } = await request.json();
    await query(
      'INSERT INTO employees (id, name, role, user_id) VALUES ($1, $2, $3, $4)',
      [id, name, role, userId]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST employees error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id, name, role } = await request.json();
    await query(
      'UPDATE employees SET name = $1, role = $2 WHERE id = $3 AND user_id = $4',
      [name, role, id, userId]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT employees error:", error);
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

    await query('DELETE FROM employees WHERE id = $1 AND user_id = $2', [id, userId]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE employees error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
