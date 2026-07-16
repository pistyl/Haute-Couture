import { query } from '../../../lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM workshop_config ORDER BY id LIMIT 1');
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
    const { nomAtelier, devise } = await request.json();
    
    // Check if configuration exists
    const checkRes = await query('SELECT id FROM workshop_config ORDER BY id LIMIT 1');
    if (checkRes.rows.length > 0) {
      await query(
        'UPDATE workshop_config SET nom_atelier = $1, devise = $2 WHERE id = $3',
        [nomAtelier, devise, checkRes.rows[0].id]
      );
    } else {
      await query(
        'INSERT INTO workshop_config (nom_atelier, devise) VALUES ($1, $2)',
        [nomAtelier, devise]
      );
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT config error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
