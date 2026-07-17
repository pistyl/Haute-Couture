import { getSessionCookieString } from '../../../../lib/auth';

export async function POST() {
  const cookie = getSessionCookieString(null, true);
  return Response.json(
    { success: true },
    {
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json'
      }
    }
  );
}

export async function GET() {
  const cookie = getSessionCookieString(null, true);
  return Response.json(
    { success: true },
    {
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json'
      }
    }
  );
}
