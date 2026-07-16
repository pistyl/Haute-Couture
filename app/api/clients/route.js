import { query } from '../../../lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM clients ORDER BY name');
    return Response.json(res.rows);
  } catch (error) {
    console.error("GET clients error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, name, phone, notes, measurements } = await request.json();
    await query(
      'INSERT INTO clients (id, name, phone, notes, measurements) VALUES ($1, $2, $3, $4, $5)',
      [id, name, phone, notes, JSON.stringify(measurements)]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST clients error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, phone, notes, measurements } = await request.json();
    await query(
      'UPDATE clients SET name = $1, phone = $2, notes = $3, measurements = $4 WHERE id = $5',
      [name, phone, notes, JSON.stringify(measurements), id]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT clients error:", error);
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

    await query('DELETE FROM clients WHERE id = $1', [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE clients error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
