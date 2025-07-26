'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { Heart, LogOut, Calendar, MessageCircle, TrendingUp, Trash2, Plus, Sun, Moon, Brain } from 'lucide-react'

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
    theme: 'cool' | 'warm'
    colorScheme: {
      primary: string
      secondary: string
      accent: string
      text: string
    }
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
  const [currentTheme, setCurrentTheme] = useState<'cool' | 'warm'>('cool')
  const router = useRouter()

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

      // Filter today's entries and set current theme based on latest entry
      const today = new Date().toDateString()
      const todayEntries = data.entries?.filter((entry: MoodEntry) =>
        new Date(entry.date).toDateString() === today
      ) || []
      setTodayEntries(todayEntries)

      // Set theme based on latest entry's emotion
      if (data.entries?.length > 0) {
        const latestEntry = data.entries[0]
        setCurrentTheme(latestEntry.themeData?.theme || 'cool')
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
        setCurrentTheme(result.theme || 'cool')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Theme colors based on emotion
  const themeColors = {
    cool: {
      primary: 'bg-blue-50',
      secondary: 'bg-blue-100',
      accent: 'bg-blue-500',
      text: 'text-blue-900',
      border: 'border-blue-200'
    },
    warm: {
      primary: 'bg-pink-50',
      secondary: 'bg-pink-100',
      accent: 'bg-pink-500',
      text: 'text-pink-900',
      border: 'border-pink-200'
    }
  }

  const currentColors = themeColors[currentTheme]

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : currentColors.primary}`}>
      {/* Header */}
      <header className={`py-4 ${currentColors.secondary} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${currentColors.accent}`}>
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className={currentColors.text}>MHT</span>
                <span className="text-gray-600 dark:text-gray-300"> - Mental Health Tracker</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className={currentColors.text}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Mood Entry */}
            <div className="space-y-6">
              {/* Today's Entries */}
              {todayEntries.length > 0 && (
                <Card className={`${currentColors.border} ${currentColors.secondary}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className={`h-5 w-5 ${currentColors.text}`} />
                      <span className={currentColors.text}>Today's Entries ({todayEntries.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todayEntries.map((entry) => {
                      const entryColors = entry.themeData 
                        ? themeColors[entry.themeData.theme] 
                        : currentColors
                      return (
                        <div 
                          key={entry._id} 
                          className={`border rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${entryColors.border}`}
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
                              <p className={`text-gray-700 dark:text-gray-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-md mt-1`}>
                                {entry.aiMessage}
                              </p>
                            </div>
                            {entry.aiTip && (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">Self-Care Tip:</span>
                                <p className={`text-gray-700 dark:text-gray-300 ${darkMode ? 'bg-yellow-900' : 'bg-yellow-50'} p-3 rounded-md mt-1`}>
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

              {/* Mood Entry Form */}
              <Card className={currentColors.border}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className={currentColors.text}>How are you feeling?</span>
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
                        className={`w-full ${currentColors.accent} hover:${currentColors.accent}/90`}
                        disabled={submitting}
                      >
                        {submitting ? 'Saving...' : 'Save Mood Entry'}
                      </Button>
                    </form>
                  </CardContent>
                )}
              </Card>

              {/* Quick Stats */}
              <Card className={currentColors.border}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className={`h-5 w-5 ${currentColors.text}`} />
                    <span className={currentColors.text}>Your Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${currentColors.text}`}>
                        {moodHistory.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${currentColors.text}`}>
                        {todayEntries.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Today's Entries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Mood History */}
            <div>
              <Card className={currentColors.border}>
                <CardHeader>
                  <CardTitle className={currentColors.text}>Mood History</CardTitle>
                  <CardDescription>
                    Your recent mood entries and AI responses
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
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {moodHistory.map((entry) => {
                        const entryColors = entry.themeData 
                          ? themeColors[entry.themeData.theme] 
                          : currentColors
                        return (
                          <div 
                            key={entry._id} 
                            className={`border rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${entryColors.border}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
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
                              {entry.aiTip && (
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">Self-Care Tip:</span>
                                  <p className={`text-gray-700 dark:text-gray-300 text-sm ${darkMode ? 'bg-yellow-900' : 'bg-yellow-50'} p-2 rounded`}>
                                    {entry.aiTip}
                                  </p>
                                </div>
                              )}
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
      <footer className={`py-6 ${currentColors.secondary} mt-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-lg font-semibold mb-4 ${currentColors.text}`}>Need Professional Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {therapists.map((therapist, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{therapist.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{therapist.specialty}</p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Contact: </span>
                  <a 
                    href={`tel:${therapist.phone.replace(/\D/g, '')}`} 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {therapist.phone}
                  </a>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Mental Health Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}