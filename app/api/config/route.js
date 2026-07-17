import { query } from '../../../lib/db';
import { getUserSession } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const res = await query('SELECT * FROM workshop_config WHERE user_id = $1 ORDER BY id LIMIT 1', [userId]);
    if (res.rows.length > 0) {
      const c = res.rows[0];
      return Response.json({ nomAtelier: c.nom_atelier, devise: c.devise });
    }
    return Response.json({ nomAtelier: "Atelier Baobab - Couture Sénégalaise", devise: "FCFA" });
  } catch (error) {
    console.error("GET config error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { nomAtelier, devise } = await request.json();
    
    // Check if configuration exists for this user
    const checkRes = await query('SELECT id FROM workshop_config WHERE user_id = $1 ORDER BY id LIMIT 1', [userId]);
    if (checkRes.rows.length > 0) {
      await query(
        'UPDATE workshop_config SET nom_atelier = $1, devise = $2 WHERE id = $3 AND user_id = $4',
        [nomAtelier, devise, checkRes.rows[0].id, userId]
      );
    } else {
      await query(
        'INSERT INTO workshop_config (nom_atelier, devise, user_id) VALUES ($1, $2, $3)',
        [nomAtelier, devise, userId]
      );
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT config error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
