/**
 * Migration script to import static profile data into Supabase
 *
 * This script:
 * 1. Creates user accounts in auth.users (or references existing)
 * 2. Creates profiles entries
 * 3. Creates pro_profiles with all the data from profile-data.ts
 *
 * Run with: npx ts-node src/scripts/migrate-profiles.ts
 */

import { createClient } from '@supabase/supabase-js'
import { profileLibrary } from '../app/profile/profile-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for auth operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function migrateProfiles() {
  console.log('🚀 Starting profile migration...\n')

  const slugs = Object.keys(profileLibrary)

  for (const slug of slugs) {
    const profileData = profileLibrary[slug]
    const { profile } = profileData

    console.log(`📝 Migrating: ${profile.name} (${slug})`)

    try {
      // Step 1: Create or get user in auth.users
      const email = `${slug}@teeup.com` // Generate email from slug
      const password = 'TempPassword123!' // Temporary password (should be changed)

      let userId: string

      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u) => u.email === email)

      if (existingUser) {
        console.log(`  ✓ User already exists: ${email}`)
        userId = existingUser.id
      } else {
        // Create new user
        const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            role: 'pro',
            full_name: profile.name,
          },
        })

        if (authError) {
          console.error(`  ❌ Error creating user: ${authError.message}`)
          continue
        }

        userId = newUser.user.id
        console.log(`  ✓ Created user: ${email}`)
      }

      // Step 2: Create or update profile
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: userId,
          role: 'pro',
          full_name: profile.name,
          phone: null, // Can be added later
          avatar_url: profile.heroImage, // Use hero image as avatar
        },
        { onConflict: 'id' }
      )

      if (profileError) {
        console.error(`  ❌ Error creating profile: ${profileError.message}`)
        continue
      }

      console.log(`  ✓ Created/updated profile`)

      // Step 3: Create pro_profile
      const specialties = profileData.highlights.map((h) => h.label)

      const { error: proProfileError } = await supabase.from('pro_profiles').upsert(
        {
          user_id: userId,
          slug,
          title: profile.title,
          bio: profile.summary,
          specialties,
          hero_image_url: profile.heroImage,
          profile_image_url: profile.heroImage, // Can be different if we have separate profile images
          profile_views: 0,
          monthly_chat_count: 0,
          total_leads: 0,
          matched_lessons: 0,
          rating: 0,
          subscription_tier: 'basic',
          is_approved: true, // Pre-approve migrated pros
          is_featured: slug === 'elliot-kim', // Feature Elliot Kim
        },
        { onConflict: 'slug' }
      )

      if (proProfileError) {
        console.error(`  ❌ Error creating pro_profile: ${proProfileError.message}`)
        continue
      }

      console.log(`  ✓ Created/updated pro_profile`)
      console.log(`  ✅ Migration complete for ${profile.name}\n`)
    } catch (error) {
      console.error(`  ❌ Unexpected error: ${error}`)
    }
  }

  console.log('🎉 Profile migration complete!')
  console.log('\n📋 Summary:')
  console.log(`   Total profiles migrated: ${slugs.length}`)
  console.log(`   - elliot-kim (featured)`)
  console.log(`   - hannah-park`)
  console.log(`   - mina-jang`)
  console.log('\n⚠️  Note: Default passwords are set to "TempPassword123!" - please change them!')
}

// Run migration
migrateProfiles().catch(console.error)
