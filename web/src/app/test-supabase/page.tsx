'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()

        // Test 1: Check if client is created
        if (!supabase) {
          throw new Error('Supabase client not created')
        }

        // Test 2: Try to query profiles table
        const { error: queryError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)

        if (queryError) {
          throw queryError
        }

        // Test 3: List all tables (try to query each one)
        const tableTests = ['profiles', 'pro_profiles', 'chat_rooms', 'messages']
        const foundTables: string[] = []

        for (const table of tableTests) {
          const { error } = await supabase
            .from(table)
            .select('count')
            .limit(1)

          if (!error) {
            foundTables.push(table)
          }
        }

        setTables(foundTables)
        setConnected(true)
      } catch (err) {
        console.error('Connection test failed:', err)
        const errorMessage = err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null
          ? JSON.stringify(err, null, 2)
          : String(err)
        setError(errorMessage)
        setConnected(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-tee-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-tee-ink-strong">
          Supabase Connection Test
        </h1>

        <div className="rounded-2xl border border-tee-stone bg-white p-6">
          {/* Connection Status */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-tee-ink-strong">
              Connection Status
            </h2>
            {connected === null && (
              <p className="text-tee-ink-muted">Testing connection...</p>
            )}
            {connected === true && (
              <p className="text-tee-success">✅ Connected successfully!</p>
            )}
            {connected === false && (
              <p className="text-tee-error">❌ Connection failed</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-tee-error bg-tee-error/10 p-4">
              <h3 className="mb-2 font-semibold text-tee-error">Error:</h3>
              <p className="font-mono text-sm text-tee-ink-light">{error}</p>
            </div>
          )}

          {/* Tables Found */}
          {tables.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold text-tee-ink-strong">
                Tables Found ({tables.length}/4)
              </h2>
              <ul className="space-y-2">
                {tables.map((table) => (
                  <li
                    key={table}
                    className="flex items-center gap-2 text-tee-ink-light"
                  >
                    <span className="text-tee-success">✓</span>
                    <code className="rounded bg-tee-surface px-2 py-1 text-sm">
                      {table}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Environment Info */}
          <div className="border-t border-tee-stone pt-6">
            <h2 className="mb-2 text-lg font-semibold text-tee-ink-strong">
              Configuration
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-tee-ink-light">Supabase URL:</dt>
                <dd className="font-mono text-tee-ink-muted">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-tee-ink-light">API Key:</dt>
                <dd className="font-mono text-tee-ink-muted">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 20)}...`
                    : 'Not set'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-tee-accent-primary hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
