import { query } from '../../../../lib/db';
import { createPayment } from '../../../../lib/unitechpay';

export async function POST(request) {
  try {
    const { userId, phone, paymentMethod } = await request.json();

    if (!userId || !phone || !paymentMethod) {
      return Response.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const checkUser = await query('SELECT id, plan, atelier_name FROM users WHERE id = $1', [userId]);
    if (checkUser.rows.length === 0) {
      return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const user = checkUser.rows[0];
    const amount = user.plan === 'QUARTERLY' ? 25000 : 10000;
    const description = `Abonnement Plan ${user.plan === 'MONTHLY' ? 'Mensuel' : 'Trimestriel'} Haute Couture`;
    const orderId = `SUB_${userId}`;

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const appUrl = `${protocol}://${host}`;

    const paymentResult = await createPayment({
      amount,
      description,
      orderId,
      customerName: `Atelier ${user.atelier_name}`,
      customerPhone: phone,
      paymentMethod,
      appUrl
    });

    if (paymentResult.success === 1) {
      const dbRef = paymentResult.reference || `ref_${Date.now()}`;
      await query(
        `INSERT INTO unitechpay_payments (reference, user_id, amount, status, method) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (reference) DO UPDATE SET status = 'pending'`,
        [dbRef, userId, amount, 'pending', paymentMethod]
      );

      return Response.json({ success: true, redirectUrl: paymentResult.redirect_url });
    } else {
      return Response.json({ error: paymentResult.error || "Échec de l'initialisation du paiement" }, { status: 500 });
    }
  } catch (error) {
    console.error("POST subscribe pending error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
