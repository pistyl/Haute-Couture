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

    const settingsRes = await query("SELECT value FROM platform_settings WHERE key = 'commission_rate'");
    const commissionRate = settingsRes.rows.length > 0 ? parseFloat(settingsRes.rows[0].value) : 5.0;

    return Response.json({ success: true, commissionRate });
  } catch (error) {
    console.error("GET admin settings error:", error);
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
    const { commissionRate } = body;

    if (commissionRate === undefined || isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      return Response.json({ error: "Taux de commission invalide (doit être un nombre entre 0 et 100)" }, { status: 400 });
    }

    // Insert or update
    await query(`
      INSERT INTO platform_settings (key, value) 
      VALUES ('commission_rate', $1) 
      ON CONFLICT (key) 
      DO UPDATE SET value = EXCLUDED.value
    `, [commissionRate.toString()]);

    return Response.json({ success: true, commissionRate });
  } catch (error) {
    console.error("PUT admin settings error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
