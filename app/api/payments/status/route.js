import { query } from '../../../../lib/db';
import { getUserSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return Response.json({ error: "orderId manquant" }, { status: 400 });
    }

    // Security check: Make sure order belongs to the logged-in user
    const orderRes = await query(
      'SELECT id FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (orderRes.rows.length === 0) {
      return Response.json([]);
    }

    // Fetch UnitechPay transactions for this order
    const paymentsRes = await query(
      `SELECT 
        reference, 
        amount, 
        status, 
        method, 
        to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt"
       FROM unitechpay_payments 
       WHERE order_id = $1 
       ORDER BY created_at DESC`,
      [orderId]
    );

    const payments = paymentsRes.rows.map(p => ({
      ...p,
      amount: parseFloat(p.amount) || 0
    }));

    return Response.json(payments);
  } catch (error) {
    console.error("GET status error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
