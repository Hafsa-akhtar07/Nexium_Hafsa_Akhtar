// import { createSupabaseServerClient } from "../lib/supabaseServer";
import { createSupabaseServerClient } from "../../lib/supabaseServer";

import { redirect } from "next/navigation";

export default async function AuthCallback() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    redirect("/dashboard"); // 🎯 Go to dashboard if logged in
  }

  redirect("/login"); // ❌ fallback if something breaks
}
