'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Heart, Brain, Sparkles, Sun, Moon, Lock } from 'lucide-react'

type ThemeName = 'clay' | 'stone' | 'forest'

interface ThemeColors {
  light: {
    primary: string
    secondary: string
    accent: string
    text: string
    border: string
    bgImage: string
    bgColor: string
  }
  dark: {
    primary: string
    secondary: string
    accent: string
    text: string
    border: string
    bgImage: string
    bgColor: string
  }
}

const themes: Record<ThemeName, ThemeColors> = {
  clay: {
    light: {
      primary: 'bg-rose-100',
      secondary: 'bg-rose-200',
      accent: 'bg-rose-600',
      text: 'text-rose-900',
      border: 'border-rose-300',
      bgImage: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      bgColor: 'bg-rose-50'
    },
    dark: {
      primary: 'bg-rose-900',
      secondary: 'bg-rose-800',
      accent: 'bg-rose-500',
      text: 'text-rose-100',
      border: 'border-rose-700',
      bgImage: "bg-[url('https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')]",
      bgColor: 'bg-rose-950'
    }
  },
  stone: {
    light: {
      primary: 'bg-slate-100',
      secondary: 'bg-slate-200',
      accent: 'bg-slate-600',
      text: 'text-slate-900',
      border: 'border-slate-300',
      bgImage: "bg-[url('https://images.unsplash.com/photo-1516731415730-0c607149933a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center bg-no-repeat",
    bgColor: 'bg-slate-50'
    },
    dark: {
      primary: 'bg-slate-900',
      secondary: 'bg-slate-800',
      accent: 'bg-slate-500',
      text: 'text-slate-100',
      border: 'border-slate-700',
      bgImage: "bg-[url('https://images.unsplash.com/photo-1519752441410-d3ca70ecb937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')]",
      bgColor: 'bg-slate-950'
    }
  },
  forest: {
    light: {
      primary: 'bg-green-100',
      secondary: 'bg-green-200',
      accent: 'bg-green-600',
      text: 'text-green-900',
      border: 'border-green-300',
      bgImage: "bg-[url('https://images.unsplash.com/photo-1519752441410-d3ca70ecb937?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')] bg-cover bg-center bg-no-repeat",
    bgColor: 'bg-slate-950'
    },
    dark: {
      primary: 'bg-green-900',
      secondary: 'bg-green-800',
      accent: 'bg-green-500',
      text: 'text-green-100',
      border: 'border-green-700',
      bgImage: "bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')]",
      bgColor: 'bg-green-950'
    }
  }
}
const DEFAULT_THEME: ThemeName = 'clay'

function getThemeColors(themeName: ThemeName, darkMode: boolean): ThemeColors['light'] | ThemeColors['dark'] {
  const theme = themes[themeName] || themes[DEFAULT_THEME]
  return darkMode ? theme.dark : theme.light
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(DEFAULT_THEME)
  const router = useRouter()

  const currentColors = getThemeColors(currentTheme, darkMode)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        router.push('/dashboard')
      }
      setLoading(false)
    }
    checkUser()

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

  const handleThemeChange = (theme: 'clay' | 'stone' | 'forest') => {
    setCurrentTheme(theme)
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark bg-gray-900' : currentColors.primary}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'dark bg-gray-900' : currentColors.primary}`}>
      {/* Background Image Overlay */}
      <div className={`fixed inset-0 ${currentColors.bgImage} bg-cover bg-center opacity-20 dark:opacity-10 -z-10`}></div>

      <div className="max-w-md w-full space-y-8 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl shadow-2xl border dark:border-gray-700">
        {/* Theme Selector */}
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full p-2"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <div className="flex space-x-1">
            <button 
              onClick={() => handleThemeChange('clay')} 
              className={`h-6 w-6 rounded-full ${currentTheme === 'clay' ? 'ring-2 ring-offset-2 ring-amber-500' : ''} bg-rose-500`}
              aria-label="Clay theme"
            />
            <button 
              onClick={() => handleThemeChange('stone')} 
              className={`h-6 w-6 rounded-full ${currentTheme === 'stone' ? 'ring-2 ring-offset-2 ring-orange-500' : ''} bg-slate-500`}
              aria-label="Stone theme"
            />
            <button 
              onClick={() => handleThemeChange('forest')} 
              className={`h-6 w-6 rounded-full ${currentTheme === 'forest' ? 'ring-2 ring-offset-2 ring-emerald-500' : ''} bg-emerald-500`}
              aria-label="Forest theme"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-3 ${currentColors.secondary} rounded-full`}>
              <Heart className={`h-8 w-8 ${currentColors.accent}`} />
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${currentColors.text}`}>
            MindGarden
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Cultivate your mental wellbeing
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
            <Brain className={`h-5 w-5 ${currentColors.accent}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">Daily mood tracking</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
            <Sparkles className={`h-5 w-5 ${currentColors.accent}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">AI-powered insights</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
            <Heart className={`h-5 w-5 ${currentColors.accent}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">Personalized support</span>
          </div>
        </div>

        {/* Sign In Form */}
        <Card className={`${currentColors.border} dark:bg-gray-800`}>
          <CardHeader>
            <CardTitle className={`${currentColors.text}`}>Begin Your Journey</CardTitle>
            <CardDescription>
              Enter your email to receive a secure magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <Button 
                type="submit" 
                className={`w-full ${currentColors.accent} hover:${currentColors.accent}/90 text-white py-3 rounded-lg shadow-md transition-all hover:shadow-lg`}
                disabled={sending}
              >
                {sending ? 'Sending Magic Link...' : 'Continue with Email'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>No password required • Secure authentication</p>
        </div>
      </div>
    </div>
  )
}