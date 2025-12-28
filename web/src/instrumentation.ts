/**
 * Next.js Instrumentation
 *
 * This file initializes Sentry for server-side and edge runtime.
 * It's automatically loaded by Next.js when instrumentation is enabled.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}
