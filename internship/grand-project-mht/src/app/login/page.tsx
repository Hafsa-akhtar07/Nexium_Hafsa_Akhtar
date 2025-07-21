// app/login/page.tsx
// 'use client'

// import { useState } from 'react'
// import { createSupabaseBrowserClient } from '../lib/supabaseClient'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [msg, setMsg] = useState('')

//   const handleLogin = async (e: any) => {
//     e.preventDefault()
//     const { error } = await createSupabaseBrowserClient.auth.signInWithOtp({ email })

//     if (error) {
//       setMsg('Failed to send link')
//     } else {
//       setMsg('Check your email for login link')
//     }
//   }

"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { error } = await createSupabaseBrowserClient.auth.signInWithOtp({
      email,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Magic Link Login</h2>

      {!sent ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full max-w-md"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send Magic Link
          </button>
        </>
      ) : (
        <p className="text-green-600">Check your email for the magic link!</p>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
