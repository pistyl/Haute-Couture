import { query, pool } from '../../../../lib/db';
import { hashPassword, createSessionToken, setSessionCookie } from '../../../../lib/auth';
import { createPayment } from '../../../../lib/unitechpay';

export async function POST(request) {
  try {
    const { email, password, atelierName, plan = 'FREE', phone, paymentMethod } = await request.json();
    
    if (!email || !password || !atelierName) {
      return Response.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const cleanPlan = plan.toUpperCase();
    if (cleanPlan !== 'FREE' && cleanPlan !== 'MONTHLY' && cleanPlan !== 'QUARTERLY') {
      return Response.json({ error: "Plan invalide" }, { status: 400 });
    }

    if (cleanPlan !== 'FREE') {
      if (!phone || !paymentMethod) {
        return Response.json({ error: "Numéro de téléphone et opérateur requis pour le paiement" }, { status: 400 });
      }
    }

    // Check if user already exists
    const checkUser = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (checkUser.rows.length > 0) {
      return Response.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const userId = `usr_${Date.now()}`;
    const hashed = hashPassword(password);

    const userStatus = cleanPlan === 'FREE' ? 'active' : 'pending_payment';
    const subEndInterval = cleanPlan === 'FREE' ? '14 days' : '0 days';

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create user
      await client.query(
        `INSERT INTO users (id, email, password_hash, atelier_name, plan, status, subscription_end) 
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP + CAST($7 AS INTERVAL))`,
        [userId, email.toLowerCase().trim(), hashed, atelierName.trim(), cleanPlan, userStatus, subEndInterval]
      );

      // Seed default config for this user
      await client.query(
        'INSERT INTO workshop_config (nom_atelier, devise, user_id) VALUES ($1, $2, $3)',
        [atelierName.trim(), 'FCFA', userId]
      );



      // Seed default stock items for this user
      const defaultStock = [
        { id: `stk_1_${Date.now()}`, name: "Wax Hollandais Véritable (Motif Hirondelle)", type: "Tissu", quantity: 4, unit: "yards", alert_threshold: 12 },
        { id: `stk_2_${Date.now()}`, name: "Basin Riche Getzner Blanc", type: "Tissu", quantity: 35, unit: "mètres", alert_threshold: 10 },
        { id: `stk_3_${Date.now()}`, name: "Fils d'or pour broderie de fête", type: "Fourniture", quantity: 8, unit: "bobines", alert_threshold: 10 }
      ];

      for (const stk of defaultStock) {
        await client.query(
          'INSERT INTO stock (id, name, type, quantity, unit, alert_threshold, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [stk.id, stk.name, stk.type, stk.quantity, stk.unit, stk.alert_threshold, userId]
        );
      }

      if (cleanPlan !== 'FREE') {
        const amount = cleanPlan === 'MONTHLY' ? 10000 : 25000;
        const description = `Abonnement Plan ${cleanPlan === 'MONTHLY' ? 'Mensuel' : 'Trimestriel'} Haute Couture`;
        const orderId = `SUB_${userId}`;
        
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const appUrl = `${protocol}://${host}`;

        // Call UnitechPay
        const paymentResult = await createPayment({
          amount,
          description,
          orderId,
          customerName: `Atelier ${atelierName.trim()}`,
          customerPhone: phone,
          paymentMethod,
          appUrl
        });

        if (paymentResult.success === 1) {
          const dbRef = paymentResult.reference || `ref_${Date.now()}`;
          await client.query(
            `INSERT INTO unitechpay_payments (reference, user_id, amount, status, method) 
             VALUES ($1, $2, $3, $4, $5)`,
            [dbRef, userId, amount, 'pending', paymentMethod]
          );

          await client.query('COMMIT');
          return Response.json({ success: true, pendingPayment: true, redirectUrl: paymentResult.redirect_url });
        } else {
          throw new Error(paymentResult.error || "Échec de la création du paiement UnitechPay");
        }
      }

      await client.query('COMMIT');
      
      const token = createSessionToken(userId);
      setSessionCookie(token);

      return Response.json(
        { success: true, user: { id: userId, email, atelierName, plan: cleanPlan, status: userStatus } }
      );
    } catch (txError) {
      await client.query('ROLLBACK');
      throw txError;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
