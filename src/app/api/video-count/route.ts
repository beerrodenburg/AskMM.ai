import { NextResponse } from "next/server";

// Never statically generated — the count would freeze at build time.
export const dynamic = "force-dynamic";

// Supabase is hit at most once an hour; the edge cache absorbs the rest.
const CACHE_HEADER = "public, s-maxage=3600, stale-while-revalidate=86400";

// The page falls back to its own copy whenever the count is null, so every
// failure path here is a quiet null rather than an error the client handles.
const unknown = () => NextResponse.json({ count: null });

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return unknown();
  }

  try {
    // HEAD + count=exact returns the total in a header, transferring no rows.
    const response = await fetch(
      `${supabaseUrl}/rest/v1/videos?select=video_id&status=eq.done`,
      {
        method: "HEAD",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "count=exact",
        },
      }
    );

    if (!response.ok) {
      return unknown();
    }

    // PostgREST reports the total after the slash: "*/4231" or "0-24/4231".
    const total = Number(response.headers.get("content-range")?.split("/")[1]);

    if (!Number.isFinite(total)) {
      return unknown();
    }

    return NextResponse.json(
      { count: total },
      { headers: { "Cache-Control": CACHE_HEADER } }
    );
  } catch {
    return unknown();
  }
}
