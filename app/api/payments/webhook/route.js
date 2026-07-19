import { query } from '../../../../lib/db';
import { verifyWebhookSignature } from '../../../../lib/unitechpay';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-unitechpay-signature');

    if (!signature) {
      console.warn("Webhook signature header missing");
      return Response.json({ error: "Signature manquante" }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Webhook signature verification failed");
      return Response.json({ error: "Signature invalide" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log("Parsed webhook payload:", payload);

    const { event, reference, status, amount } = payload;

    if (event === 'payment_completed' && status === 'completed') {
      // Find the corresponding payment transaction in our DB
      const paymentRes = await query(
        'SELECT order_id, user_id, amount, status FROM unitechpay_payments WHERE reference = $1',
        [reference]
      );

      if (paymentRes.rows.length === 0) {
        console.warn(`Payment transaction reference ${reference} not found in DB`);
        return Response.json({ error: "Transaction introuvable" }, { status: 404 });
      }

      const dbPayment = paymentRes.rows[0];

      if (dbPayment.status === 'pending') {
        // Run transaction to update status
        await query('BEGIN');
        try {
          // 1. Update payment status to completed
          await query(
            'UPDATE unitechpay_payments SET status = $1 WHERE reference = $2',
            ['completed', reference]
          );

          if (dbPayment.order_id) {
            // Client order payment: Add payment amount to order's advance
            const paymentAmount = parseFloat(dbPayment.amount) || parseFloat(amount) || 0;
            await query(
              'UPDATE orders SET advance = advance + $1 WHERE id = $2',
              [paymentAmount, dbPayment.order_id]
            );
            console.log(`Order payment processed. Reference: ${reference}`);
          } else if (dbPayment.user_id) {
            // SaaS subscription payment: Activate user and set subscription end date
            const userRes = await query('SELECT plan FROM users WHERE id = $1', [dbPayment.user_id]);
            if (userRes.rows.length > 0) {
              const userPlan = userRes.rows[0].plan;
              const intervalStr = userPlan === 'QUARTERLY' ? '90 days' : '30 days';
              
              await query(
                `UPDATE users 
                 SET status = 'active', 
                     subscription_end = CURRENT_TIMESTAMP + CAST($1 AS INTERVAL) 
                 WHERE id = $2`,
                [intervalStr, dbPayment.user_id]
              );
              console.log(`SaaS user ${dbPayment.user_id} activated with plan ${userPlan}.`);
            }
          }

          await query('COMMIT');
        } catch (txError) {
          await query('ROLLBACK');
          throw txError;
        }
      } else {
        console.log(`Payment reference ${reference} is already processed (status: ${dbPayment.status})`);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("POST webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
