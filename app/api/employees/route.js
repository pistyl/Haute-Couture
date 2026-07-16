import { query } from '../../../lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM employees ORDER BY id');
    return Response.json(res.rows);
  } catch (error) {
    console.error("GET employees error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, name, role } = await request.json();
    await query(
      'INSERT INTO employees (id, name, role) VALUES ($1, $2, $3)',
      [id, name, role]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("POST employees error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, role } = await request.json();
    await query(
      'UPDATE employees SET name = $1, role = $2 WHERE id = $3',
      [name, role, id]
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error("PUT employees error:", error);
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

    await query('DELETE FROM employees WHERE id = $1', [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE employees error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
