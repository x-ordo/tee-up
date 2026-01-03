import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * OAuth Callback Handler
 * Handles the callback from OAuth providers (Kakao, Google)
 * Exchanges the auth code for a session
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Session exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('로그인에 실패했습니다. 다시 시도해주세요.')}`, requestUrl.origin)
      );
    }

    // Successful authentication - redirect to the intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
}
