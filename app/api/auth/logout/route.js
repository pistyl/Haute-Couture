import { clearSessionCookie } from '../../../../lib/auth';

export async function POST() {
  clearSessionCookie();
  return Response.json({ success: true });
}

export async function GET() {
  clearSessionCookie();
  return Response.json({ success: true });
}
