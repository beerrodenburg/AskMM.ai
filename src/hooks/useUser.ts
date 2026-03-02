"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// undefined = not yet loaded, null = loaded & signed out, string = signed-in email
export function useUser(): string | null | undefined {
  const [userEmail, setUserEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  return userEmail;
}
