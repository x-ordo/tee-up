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
        const { data, error: queryError } = await supabase
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
    <div className="min-h-screen bg-calm-white p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-calm-obsidian">
          Supabase Connection Test
        </h1>

        <div className="rounded-2xl border border-calm-stone bg-white p-6">
          {/* Connection Status */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-calm-obsidian">
              Connection Status
            </h2>
            {connected === null && (
              <p className="text-calm-ash">Testing connection...</p>
            )}
            {connected === true && (
              <p className="text-success">✅ Connected successfully!</p>
            )}
            {connected === false && (
              <p className="text-error">❌ Connection failed</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-error bg-error/10 p-4">
              <h3 className="mb-2 font-semibold text-error">Error:</h3>
              <p className="font-mono text-sm text-calm-charcoal">{error}</p>
            </div>
          )}

          {/* Tables Found */}
          {tables.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold text-calm-obsidian">
                Tables Found ({tables.length}/4)
              </h2>
              <ul className="space-y-2">
                {tables.map((table) => (
                  <li
                    key={table}
                    className="flex items-center gap-2 text-calm-charcoal"
                  >
                    <span className="text-success">✓</span>
                    <code className="rounded bg-calm-cloud px-2 py-1 text-sm">
                      {table}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Environment Info */}
          <div className="border-t border-calm-stone pt-6">
            <h2 className="mb-2 text-lg font-semibold text-calm-obsidian">
              Configuration
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-calm-charcoal">Supabase URL:</dt>
                <dd className="font-mono text-calm-ash">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-calm-charcoal">API Key:</dt>
                <dd className="font-mono text-calm-ash">
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
            className="text-accent hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
