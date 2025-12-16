import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check new tables and columns
    const checks = {
      // Check studios table
      studios: await supabase.from('studios').select('id').limit(1).then(r => !r.error),
      // Check leads table
      leads: await supabase.from('leads').select('id').limit(1).then(r => !r.error),
      // Check portfolio_sections table
      portfolio_sections: await supabase.from('portfolio_sections').select('id').limit(1).then(r => !r.error),
      // Check new columns on pro_profiles
      pro_profiles_new_columns: await supabase
        .from('pro_profiles')
        .select('theme_type, payment_link, open_chat_url, monthly_lead_count')
        .limit(1)
        .then(r => !r.error),
    };

    const allPassed = Object.values(checks).every(v => v === true);

    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'All migrations verified!' : 'Some migrations failed',
      checks,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
