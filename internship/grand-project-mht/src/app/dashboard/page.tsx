'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { Heart, LogOut, Calendar, MessageCircle, TrendingUp, Trash2, Plus } from 'lucide-react'

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
  const router = useRouter()

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

  // const loadMoodHistory = async (userId: string) => {
  //   try {
  //     const response = await fetch(`/api/mood-entries?userId=${userId}&limit=20`)
  //     const data = await response.json()
  //     setMoodHistory(data.entries || [])
      
  //     // Get today's entries
  //     const today = new Date().toDateString()
  //     const todayEntries = data.entries?.filter((entry: MoodEntry) => 
  //       new Date(entry.date).toDateString() === today
  //     ) || []
  //     setTodayEntries(todayEntries)
  //   } catch (error) {
  //     console.error('Error loading mood history:', error)
  //   }
  // }
const loadMoodHistory = async (userId: string) => {
  try {
    const response = await fetch(`/api/mood-entries?userId=${userId}&limit=20`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🚨 Error response from API:', response.status, errorText)
      return
    }

    const text = await response.text()
    if (!text) {
      console.warn('⚠️ Empty response from server')
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
        alert('Mood entry saved successfully!')
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
        alert('Mood entry deleted successfully!')
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

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Mental Health Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Mood Entry */}
          <div className="space-y-6">
            {/* Today's Entries */}
            {todayEntries.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>Today's Entries ({todayEntries.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayEntries.map((entry) => (
                    <div key={entry._id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">
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
                          <span className="font-medium text-gray-900">Mood:</span>
                          <p className="text-gray-700">{entry.mood}</p>
                        </div>
                        {entry.moodScore && (
                          <div>
                            <span className="font-medium text-gray-900">Score:</span>
                            <span className="ml-2 text-blue-600">{entry.moodScore}/10</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-900 flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>AI Response:</span>
                          </span>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
                            {entry.aiMessage}
                          </p>
                        </div>
                        {entry.aiTip && (
                          <div>
                            <span className="font-medium text-gray-900">Self-Care Tip:</span>
                            <p className="text-gray-700 bg-yellow-50 p-3 rounded-md mt-1">
                              {entry.aiTip}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Mood Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>How are you feeling?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 (Very Low)</span>
                        <span className="text-blue-600 font-medium">{moodScore}/10</span>
                        <span>10 (Very High)</span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save Mood Entry'}
                    </Button>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Your Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {moodHistory.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {todayEntries.length}
                    </div>
                    <div className="text-sm text-gray-600">Today's Entries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Mood History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Mood History</CardTitle>
                <CardDescription>
                  Your recent mood entries and AI responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moodHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No mood entries yet</p>
                    <p className="text-sm">Start by adding your first mood entry!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {moodHistory.map((entry) => (
                      <div key={entry._id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-500">
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
                            <span className="font-medium text-gray-900">Mood:</span>
                            <p className="text-gray-700 text-sm">{entry.mood}</p>
                          </div>
                          {entry.moodScore && (
                            <div>
                              <span className="font-medium text-gray-900">Score:</span>
                              <span className="ml-2 text-blue-600 text-sm">{entry.moodScore}/10</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-900">AI Response:</span>
                            <p className="text-gray-700 text-sm">{entry.aiMessage}</p>
                          </div>
                          {entry.aiTip && (
                            <div>
                              <span className="font-medium text-gray-900">Self-Care Tip:</span>
                              <p className="text-gray-700 text-sm bg-yellow-50 p-2 rounded">
                                {entry.aiTip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 