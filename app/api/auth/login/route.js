import { query } from '../../../../lib/db';
import { verifyPassword, createSessionToken, getSessionCookieString } from '../../../../lib/auth';

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

    const token = createSessionToken(user.id);
    const cookie = getSessionCookieString(token);

    return Response.json(
      { success: true, user: { id: user.id, email: user.email, atelierName: user.atelier_name } },
      {
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
