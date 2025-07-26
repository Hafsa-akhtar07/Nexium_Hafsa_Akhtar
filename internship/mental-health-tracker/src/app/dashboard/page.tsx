'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { Heart, LogOut, Calendar, MessageCircle, TrendingUp, Trash2, Sun, Moon, Sparkles } from 'lucide-react'

// 1. First define all theme types and constants
type ThemeName = 'sand' | 'clay' | 'stone'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  text: string
  border: string
  bgImage: string
  bgColor: string
}

const themes: Record<ThemeName, ThemeColors> = {
  sand: {
    primary: 'bg-amber-100',
    secondary: 'bg-amber-200',
    accent: 'bg-amber-600',
    text: 'text-amber-900',
    border: 'border-amber-300',
    bgImage: "bg-[url('https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=1374&auto=format&fit=crop')]",
    bgColor: 'bg-amber-50'
  },
  clay: {
    primary: 'bg-rose-100',
    secondary: 'bg-rose-200',
    accent: 'bg-rose-600',
    text: 'text-rose-900',
    border: 'border-rose-300',
    bgImage: "bg-[url('https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1473&auto=format&fit=crop')]",
    bgColor: 'bg-rose-50'
  },
  stone: {
    primary: 'bg-slate-100',
    secondary: 'bg-slate-200',
    accent: 'bg-slate-600',
    text: 'text-slate-900',
    border: 'border-slate-300',
    bgImage: "bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1470&auto=format&fit=crop')]",
    bgColor: 'bg-slate-50'
  }
}

const DEFAULT_THEME: ThemeName = 'sand'

// Helper function to safely get theme colors
function getThemeColors(themeName?: ThemeName): ThemeColors {
  return themeName ? themes[themeName] || themes[DEFAULT_THEME] : themes[DEFAULT_THEME]
}

interface MoodEntry {
  _id: string
  userId: string
  userEmail: string
  mood: string
  aiMessage: string
  aiTip?: string
  moodScore?: number
  date: string
  createdAt: string
  emotion?: string
  themeData?: {
    theme: ThemeName
    colorScheme: ThemeColors
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mood, setMood] = useState('')
  const [moodScore, setMoodScore] = useState<number>(5)
  const [submitting, setSubmitting] = useState(false)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [todayEntries, setTodayEntries] = useState<MoodEntry[]>([])
  const [showForm, setShowForm] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(DEFAULT_THEME)
  const router = useRouter()

  // Always get valid theme colors
  const currentColors = getThemeColors(currentTheme)

  // Therapist contact data
  const therapists = [
    { name: "Dr. Sarah Johnson", specialty: "Anxiety & Depression", phone: "+1 (555) 123-4567" },
    { name: "Dr. Michael Chen", specialty: "Cognitive Behavioral Therapy", phone: "+1 (555) 987-6543" },
    { name: "Crisis Hotline", specialty: "24/7 Support", phone: "988" }
  ]

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/')
        return
      }
      setUser(session.user)
      await loadMoodHistory(session.user.id)
      setLoading(false)
    }
    checkUser()
  }, [router])

  const loadMoodHistory = async (userId: string) => {
    try {
      const response = await fetch(`/api/mood-entries?userId=${userId}&limit=20`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response from API:', response.status, errorText)
        return
      }

      const text = await response.text()
      if (!text) {
        console.warn('Empty response from server')
        return
      }

      const data = JSON.parse(text)
      setMoodHistory(data.entries || [])

      // Filter today's entries
      const today = new Date().toDateString()
      const todayEntries = data.entries?.filter((entry: MoodEntry) =>
        new Date(entry.date).toDateString() === today
      ) || []
      setTodayEntries(todayEntries)

      // Set theme based on latest entry's theme or use default
      if (data.entries?.length > 0) {
        const latestEntry = data.entries[0]
        const theme = latestEntry.themeData?.theme || DEFAULT_THEME
        setCurrentTheme(theme)
      }
    } catch (error) {
      console.error('Error loading mood history:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSubmitMood = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood.trim() || !user) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/mood-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          mood: mood.trim(),
          moodScore: moodScore
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setMood('')
        setMoodScore(5)
        await loadMoodHistory(user.id)
        setCurrentTheme(result.theme || DEFAULT_THEME)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save mood entry')
      }
    } catch (error) {
      console.error('Error submitting mood:', error)
      alert(error instanceof Error ? error.message : 'Error saving mood entry')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this mood entry?')) return

    try {
      const response = await fetch(`/api/mood-entries?id=${entryId}&userId=${user.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadMoodHistory(user.id)
      } else {
        throw new Error('Failed to delete mood entry')
      }
    } catch (error) {
      console.error('Error deleting mood entry:', error)
      alert('Error deleting mood entry')
    }
  }

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme)
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark bg-gray-900' : currentColors.bgColor}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : currentColors.bgColor}`}>
      {/* Background Image Overlay */}
      <div className={`fixed inset-0 ${currentColors.bgImage} bg-cover bg-center opacity-20 dark:opacity-10 -z-10`}></div>

      {/* Header */}
      <header className={`py-4 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-sm backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${currentColors.accent}`}>
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className={currentColors.text}>MindGarden</span>
                <span className="text-gray-600 dark:text-gray-300"> Dashboard</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex space-x-1">
                <button 
                  onClick={() => handleThemeChange('sand')} 
                  className={`h-6 w-6 rounded-full ${currentTheme === 'sand' ? 'ring-2 ring-offset-2 ring-amber-500' : ''} bg-amber-500`}
                  aria-label="Sand theme"
                />
                <button 
                  onClick={() => handleThemeChange('clay')} 
                  className={`h-6 w-6 rounded-full ${currentTheme === 'clay' ? 'ring-2 ring-offset-2 ring-rose-500' : ''} bg-rose-500`}
                  aria-label="Clay theme"
                />
                <button 
                  onClick={() => handleThemeChange('stone')} 
                  className={`h-6 w-6 rounded-full ${currentTheme === 'stone' ? 'ring-2 ring-offset-2 ring-slate-500' : ''} bg-slate-500`}
                  aria-label="Stone theme"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className={`${currentColors.text} border ${currentColors.border}`}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Mood Entry and Today's Entries */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mood Entry Form */}
              <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className={`h-5 w-5 ${currentColors.text}`} />
                      <span className={currentColors.text}>How are you feeling today?</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(!showForm)}
                      className={currentColors.text}
                    >
                      {showForm ? 'Hide' : 'Show'} Form
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Share your thoughts and get AI-powered support
                  </CardDescription>
                </CardHeader>
                {showForm && (
                  <CardContent>
                    <form onSubmit={handleSubmitMood} className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium ${currentColors.text} mb-2`}>
                          Mood Description
                        </label>
                        <Textarea
                          placeholder="Describe how you're feeling today..."
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className="min-h-[120px]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${currentColors.text} mb-2`}>
                          Mood Score (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodScore}
                          onChange={(e) => setMoodScore(parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>1 (Very Low)</span>
                          <span className={`font-medium ${currentColors.text}`}>{moodScore}/10</span>
                          <span>10 (Very High)</span>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className={`w-full ${currentColors.accent} hover:${currentColors.accent}/90 text-white`}
                        disabled={submitting}
                      >
                        {submitting ? 'Saving...' : 'Save Mood Entry'}
                      </Button>
                    </form>
                  </CardContent>
                )}
              </Card>

              {/* Today's Entries */}
              {todayEntries.length > 0 && (
                <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className={`h-5 w-5 ${currentColors.text}`} />
                      <span className={currentColors.text}>Today's Entries ({todayEntries.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todayEntries.map((entry) => {
                      const entryColors = getThemeColors(entry.themeData?.theme)
                      return (
                        <div 
                          key={entry._id} 
                          className={`border rounded-lg p-4 ${entryColors.border} ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(entry.date).toLocaleTimeString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">Mood:</span>
                              <p className="text-gray-700 dark:text-gray-300">{entry.mood}</p>
                            </div>
                            {entry.moodScore && (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">Score:</span>
                                <span className={`ml-2 ${entryColors.text}`}>{entry.moodScore}/10</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                                <MessageCircle className="h-4 w-4" />
                                <span>AI Response:</span>
                              </span>
                              <p className={`text-gray-700 dark:text-gray-300 ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} p-3 rounded-md mt-1`}>
                                {entry.aiMessage}
                              </p>
                            </div>
                            {entry.aiTip && (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">Self-Care Tip:</span>
                                <p className={`text-gray-700 dark:text-gray-300 ${darkMode ? 'bg-yellow-900/50' : 'bg-yellow-50'} p-3 rounded-md mt-1`}>
                                  {entry.aiTip}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Stats and History */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className={`h-5 w-5 ${currentColors.text}`} />
                    <span className={currentColors.text}>Your Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {moodHistory.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {todayEntries.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Today's Entries</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {moodHistory.length > 0 ? 
                          Math.round(moodHistory.reduce((sum, entry) => sum + (entry.moodScore || 5), 0) / moodHistory.length) : 0
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Mood Score</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-700/50">
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {new Set(moodHistory.map(entry => new Date(entry.date).toDateString())).size}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Days Tracked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mood History */}
              <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm`}>
                <CardHeader>
                  <CardTitle className={currentColors.text}>Recent Entries</CardTitle>
                  <CardDescription>
                    Your mood history and AI responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {moodHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>No mood entries yet</p>
                      <p className="text-sm">Start by adding your first mood entry!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {moodHistory.map((entry) => {
                        const entryColors = getThemeColors(entry.themeData?.theme)
                        return (
                          <div 
                            key={entry._id} 
                            className={`border rounded-lg p-4 ${entryColors.border} ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEntry(entry._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">Mood:</span>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">{entry.mood}</p>
                              </div>
                              {entry.moodScore && (
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">Score:</span>
                                  <span className={`ml-2 text-sm ${entryColors.text}`}>{entry.moodScore}/10</span>
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">AI Response:</span>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">{entry.aiMessage}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Therapist Contacts */}
      <footer className={`py-6 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm mt-8 border-t ${currentColors.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-lg font-semibold mb-4 ${currentColors.text}`}>Need Professional Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {therapists.map((therapist, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${currentColors.border} shadow-sm`}
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{therapist.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{therapist.specialty}</p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Contact: </span>
                  <a 
                    href={`tel:${therapist.phone.replace(/\D/g, '')}`} 
                    className={`${currentColors.text} hover:underline`}
                  >
                    {therapist.phone}
                  </a>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} MindGarden. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}