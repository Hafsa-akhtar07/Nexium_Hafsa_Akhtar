// import { createSupabaseServerClient } from "../lib/supabaseServer";
// import { redirect } from "next/navigation";

// export default async function Dashboard() {
//   const supabase = createSupabaseServerClient();
//   const { data: { session } } = await supabase.auth.getSession();
// console.log("SESSION =>", session); // ⬅️ Add this line


//   if (!session?.user) redirect("/login");

//   const handleMood = async (formData: FormData) => {
//     "use server";
//     const supabase = createSupabaseServerClient();
//     const mood = formData.get("mood") as string;
//     const { data: { session } } = await supabase.auth.getSession();

//     if (!session) return;

//     await supabase.from("moods").insert({
//       user_id: session.user.id,
//       mood,
//     });
//   };

//   return (
//     <main className="p-4 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">Welcome to Your Dashboard</h1>

//       <form action={handleMood}>
//         <label className="block mb-2">How are you feeling today?</label>
//         <input
//           name="mood"
//           className="border p-2 w-full mb-4"
//           placeholder="Enter mood"
//           required
//         />
//         <button type="submit" className="bg-green-600 text-white px-4 py-2 w-full">
//           Submit Mood
//         </button>
//       </form>
//     </main>
//   );
// }


'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user && <p>Welcome, {user.email}!</p>}
    </div>
  )
}

