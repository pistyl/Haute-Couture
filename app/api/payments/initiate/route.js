import { query } from '../../../../lib/db';
import { createPayment } from '../../../../lib/unitechpay';
import { getUserSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const userId = getUserSession(request);
    if (!userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { orderId, amount, paymentMethod, phone } = await request.json();
    if (!orderId || !amount || !paymentMethod || !phone) {
      return Response.json({ error: "Informations incomplètes" }, { status: 400 });
    }

    // Get order details
    const orderRes = await query(
      `SELECT price, advance, description, client_id 
       FROM orders 
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderRes.rows.length === 0) {
      return Response.json({ error: "Commande introuvable" }, { status: 404 });
    }

    const order = orderRes.rows[0];
    const orderPrice = parseFloat(order.price) || 0;
    const orderAdvance = parseFloat(order.advance) || 0;
    const remaining = orderPrice - orderAdvance;

    if (amount > remaining) {
      return Response.json({ error: `Le montant (${amount} FCFA) dépasse le solde restant (${remaining} FCFA)` }, { status: 400 });
    }

    // Get client details
    const clientRes = await query(
      `SELECT name 
       FROM clients 
       WHERE id = $1 AND user_id = $2`,
      [order.client_id, userId]
    );

    const clientName = clientRes.rows.length > 0 ? clientRes.rows[0].name : "Client";

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const appUrl = `${protocol}://${host}`;

    // Initiate UnitechPay payment session
    const paymentResult = await createPayment({
      amount,
      description: `Facture commande #${orderId} - Atelier`,
      orderId,
      customerName: clientName,
      customerPhone: phone,
      paymentMethod,
      appUrl
    });

    if (paymentResult.success === 1) {
      // Store pending payment in database
      const dbRef = paymentResult.reference || `ref_${Date.now()}`;
      await query(
        `INSERT INTO unitechpay_payments (reference, order_id, amount, status, method) 
         VALUES ($1, $2, $3, $4, $5)`,
        [dbRef, orderId, amount, 'pending', paymentMethod]
      );

      return Response.json({ success: true, redirectUrl: paymentResult.redirect_url });
    } else {
      return Response.json({ error: paymentResult.error || "Échec de l'initialisation du paiement" }, { status: 500 });
    }
  } catch (error) {
    console.error("POST initiate payment error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
