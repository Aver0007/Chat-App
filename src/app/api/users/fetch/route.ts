import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = session.user;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUser?.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map Supabase user data to the User type
  const mappedUsers = data.map((user: any) => ({
    uid: user.id, // Map id to uid
    name: user.name,
    image: user.avatar_url, // Map avatar_url to image
    phone: user.phone,
    email: user.email,
    tag: user.tag,
  }));

  return NextResponse.json(mappedUsers);
}
