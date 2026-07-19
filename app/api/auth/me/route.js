import { query } from '../../../../lib/db';
import { getUserSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const checkUser = await query('SELECT id, email, status, plan, atelier_name as "atelierName" FROM users WHERE id = $1', [userId]);
    if (checkUser.rows.length === 0) {
      return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return Response.json({ success: true, user: checkUser.rows[0] });
  } catch (error) {
    console.error("Auth me check error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
