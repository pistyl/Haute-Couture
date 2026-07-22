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

    const usersRes = await query(`
      SELECT id, email, status, plan, is_admin as "isAdmin", atelier_name as "atelierName", created_at as "createdAt", subscription_end as "subscriptionEnd"
      FROM users
      ORDER BY created_at DESC
    `);

    return Response.json({ success: true, users: usersRes.rows });
  } catch (error) {
    console.error("GET admin users error:", error);
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
    const { id, status, plan, isAdmin } = body;

    if (!id) {
      return Response.json({ error: "Identifiant utilisateur requis" }, { status: 400 });
    }

    // Optional fields to update
    const updates = [];
    const values = [];
    let placeholderIdx = 1;

    if (status !== undefined) {
      updates.push(`status = $${placeholderIdx++}`);
      values.push(status);
    }
    if (plan !== undefined) {
      updates.push(`plan = $${placeholderIdx++}`);
      values.push(plan);
      // Adjust subscription_end if plan changed
      if (plan !== 'FREE') {
        const interval = plan === 'QUARTERLY' ? '90 days' : '30 days';
        updates.push(`subscription_end = CURRENT_TIMESTAMP + INTERVAL '${interval}'`);
      } else {
        updates.push(`subscription_end = CURRENT_TIMESTAMP`);
      }
    }
    if (isAdmin !== undefined) {
      // Prevent demoting yourself as admin
      if (id === auth.currentUserId && isAdmin === false) {
        return Response.json({ error: "Vous ne pouvez pas retirer vos propres droits administrateur" }, { status: 400 });
      }
      updates.push(`is_admin = $${placeholderIdx++}`);
      values.push(isAdmin);
    }

    if (updates.length === 0) {
      return Response.json({ error: "Aucun champ à modifier fourni" }, { status: 400 });
    }

    values.push(id);
    const queryText = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${placeholderIdx}
      RETURNING id, email, status, plan, is_admin as "isAdmin"
    `;

    const result = await query(queryText, values);
    if (result.rows.length === 0) {
      return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return Response.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("PUT admin users error:", error);
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
      return Response.json({ error: "Identifiant utilisateur requis" }, { status: 400 });
    }

    if (id === auth.currentUserId) {
      return Response.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING email', [id]);
    if (result.rows.length === 0) {
      return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return Response.json({ success: true, message: `Utilisateur ${result.rows[0].email} supprimé avec succès` });
  } catch (error) {
    console.error("DELETE admin users error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
