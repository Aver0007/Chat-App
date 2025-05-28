// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import { dummyUsers } from '../../../../../Components/dummyusers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// export async function POST() {
//   const supabase = createServerComponentClient({ cookies });

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session?.user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { error } = await supabase.from('users').insert(dummyUsers);

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ success: true });
// }
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { uid, email, name, avatar_url, phone, tag } = await req.json();

    if (!uid || !email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ id: uid, email, name, avatar_url, phone, tag }]); // Use id to match the table schema

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}