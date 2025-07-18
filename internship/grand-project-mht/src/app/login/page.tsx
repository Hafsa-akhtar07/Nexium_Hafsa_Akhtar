// app/login/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMsg('Failed to send link')
    } else {
      setMsg('Check your email for login link')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login with Magic Link</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8, margin: '10px 0', width: '100%' }}
        />
        <button type="submit">Send Magic Link</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
