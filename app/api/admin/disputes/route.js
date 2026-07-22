import { query } from '../../../../lib/db';
import { getUserSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// Helper admin authorization check
async function authorizeAdmin(request) {
  const userId = getUserSession(request);
  if (!userId) {
    return { error: "Non authentifié", status: 401 };
  }
  const adminCheck = await query('SELECT is_admin FROM users WHERE id = $1', [userId]);
  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return { error: "Accès refusé", status: 403 };
  }
  return { currentUserId: userId };
}

export async function GET(request) {
  try {
    const auth = await authorizeAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const disputesRes = await query(`
      SELECT d.id, d.user_id as "userId", d.title, d.description, d.client_name as "clientName",
             d.order_id as "orderId", d.status, d.admin_notes as "adminNotes",
             d.created_at as "createdAt", d.updated_at as "updatedAt",
             u.email as "userEmail", u.atelier_name as "atelierName"
      FROM disputes d
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `);

    return Response.json({ success: true, disputes: disputesRes.rows });
  } catch (error) {
    console.error("GET admin disputes error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await authorizeAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { userId, title, description, clientName, orderId, status } = body;

    if (!title || !description) {
      return Response.json({ error: "Le titre et la description sont requis" }, { status: 400 });
    }

    // Default to the first user if userId is not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const usersRes = await query('SELECT id FROM users LIMIT 1');
      if (usersRes.rows.length > 0) {
        targetUserId = usersRes.rows[0].id;
      } else {
        return Response.json({ error: "Aucun utilisateur trouvé pour y associer le litige" }, { status: 400 });
      }
    }

    const result = await query(
      `INSERT INTO disputes (user_id, title, description, client_name, order_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, status`,
      [targetUserId, title, description, clientName || null, orderId || null, status || 'pending']
    );

    return Response.json({ success: true, dispute: result.rows[0] });
  } catch (error) {
    console.error("POST admin disputes error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await authorizeAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return Response.json({ error: "Identifiant du litige requis" }, { status: 400 });
    }

    const updates = [];
    const values = [];
    let placeholderIdx = 1;

    if (status !== undefined) {
      updates.push(`status = $${placeholderIdx++}`);
      values.push(status);
    }
    if (adminNotes !== undefined) {
      updates.push(`admin_notes = $${placeholderIdx++}`);
      values.push(adminNotes);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);
    const queryText = `
      UPDATE disputes 
      SET ${updates.join(', ')} 
      WHERE id = $${placeholderIdx}
      RETURNING id, title, status
    `;

    const result = await query(queryText, values);
    if (result.rows.length === 0) {
      return Response.json({ error: "Litige introuvable" }, { status: 404 });
    }

    return Response.json({ success: true, dispute: result.rows[0] });
  } catch (error) {
    console.error("PUT admin disputes error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await authorizeAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: "Identifiant du litige requis" }, { status: 400 });
    }

    const result = await query('DELETE FROM disputes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return Response.json({ error: "Litige introuvable" }, { status: 404 });
    }

    return Response.json({ success: true, id: id });
  } catch (error) {
    console.error("DELETE admin disputes error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
