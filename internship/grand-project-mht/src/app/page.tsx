'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Heart, Brain, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        router.push('/dashboard')
      }
      setLoading(false)
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          router.push('/dashboard')
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSending(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        alert(error.message)
      } else {
        alert('Check your email for the magic link!')
      }
    } catch (error) {
      console.error('Error sending magic link:', error)
      alert('Error sending magic link')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mental Health Tracker
          </h1>
          <p className="text-gray-600">
            Track your mood and get AI-powered support
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">Daily mood tracking</span>
          </div>
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">AI-powered insights</span>
          </div>
          <div className="flex items-center space-x-3">
            <Heart className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">Personalized support</span>
          </div>
        </div>

        {/* Sign In Form */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>No password required • Secure magic link authentication</p>
        </div>
      </div>
    </div>
  )
} 