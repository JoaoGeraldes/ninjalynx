import { SETTINGS } from '@/configurations/settings';

export async function GET(request: Request) {
  try {
    const requestHeaders = new Headers(request.headers);
    const token = requestHeaders.get('Authorization');

    const receivedToken = token?.slice(7); // Token substring without the "Bearer " prefix.
    const expectedToken = SETTINGS.API_KEY;

    if (receivedToken === expectedToken) {
      return Response.json({ authenticated: true });
    } else {
      return Response.json({ authenticated: false });
    }
  } catch (e) {
    return Response.json({ authenticated: false });
  }
}
