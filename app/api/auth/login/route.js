import { query } from '../../../../lib/db';
import { verifyPassword, createSessionToken, setSessionCookie } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const checkUser = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (checkUser.rows.length === 0) {
      return Response.json({ error: "Identifiants invalides" }, { status: 400 });
    }

    const user = checkUser.rows[0];
    const isMatched = verifyPassword(password, user.password_hash);
    if (!isMatched) {
      return Response.json({ error: "Identifiants invalides" }, { status: 400 });
    }

    if (user.status === 'pending_payment') {
      return Response.json({ 
        error: "Veuillez finaliser le paiement de votre abonnement.", 
        code: "SUBSCRIPTION_PENDING", 
        userId: user.id, 
        email: user.email, 
        plan: user.plan 
      }, { status: 403 });
    }

    const token = createSessionToken(user.id);
    setSessionCookie(token);

    return Response.json(
      { success: true, user: { id: user.id, email: user.email, atelierName: user.atelier_name, plan: user.plan, status: user.status } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
