// Learn more about middleware at official docs:
// https://nextjs.org/docs/app/building-your-application/routing/middleware
import { Ratelimit } from '@upstash/ratelimit';
import { ipAddress } from '@vercel/edge';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { SETTINGS } from './configurations/settings';
import { FEATURE_FLAG } from './configurations/featureFlags';

let failedAttempts = 0;

const ratelimit = new Ratelimit({
  redis: kv,

  limiter: Ratelimit.slidingWindow(
    SETTINGS.RATE_LIMIT_CONFIGURATION.maxRequests,
    SETTINGS.RATE_LIMIT_CONFIGURATION.duration
  ),
});

export async function middleware(request: NextRequest) {
  if (failedAttempts >= SETTINGS.MAX_ALLOWED_FAILED_ATTEMPTS) {
    return Response.json(
      {
        error:
          'Unauthorized: You have exceeded the maximum number of failed authentication attempts. You must restart the server!',
      },
      { status: 429 }
    );
  }

  const requestHeaders = new Headers(request.headers);
  const token = requestHeaders.get('Authorization');

  const receivedToken = token?.slice(7); // Token substring without the "Bearer " prefix.
  const expectedToken = SETTINGS.API_KEY;

  console.log({
    expectedToken,
    receivedToken,
  });

  if (!expectedToken || (expectedToken && expectedToken.length < 64)) {
    failedAttempts += 1;
    console.error('Failed attempts: ', failedAttempts);
    console.error('API Key: missing or invalid.');
    return;
  }

  // Handle unauthenticated user
  if (receivedToken !== expectedToken) {
    failedAttempts += 1;
    console.error('Failed attempts: ', failedAttempts);
    return Response.json(
      { error: 'Unauthorized: Invalid or missing API Key.' },
      { status: 401 }
    );
  }

  // Handle rate-limit
  if (FEATURE_FLAG.useRateLimit) {
    const ip = ipAddress(request) || '127.0.0.1';
    const {
      success,
      // pending,
      // limit,
      // reset,
      // remaining
    } = await ratelimit.limit(ip);

    if (!success) {
      console.error(`User with ip: ${ip} was rate limited.`);
      return Response.json(
        { error: 'You were rate-limited. ' },
        { status: 401 }
      );
    }
  }

  // Clean up failed attemps
  failedAttempts = 0;

  // Move on, if successfully authenticated...
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'], // This middleware will run on all /api routes
};
