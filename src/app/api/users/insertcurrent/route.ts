import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const { error } = await supabase.from('users').upsert(
    [
      {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        phone: user.user_metadata?.phone || 'N/A',
        tag: 'Personal',
      },
    ],
    { onConflict: 'id' }
  );

  if (error) {
    console.error('Error upserting current user:', error.message, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}