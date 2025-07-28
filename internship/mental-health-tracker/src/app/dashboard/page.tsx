'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { Heart, LogOut, Calendar, MessageCircle, TrendingUp, Trash2, Sun, Moon, Sparkles, History, X, Menu } from 'lucide-react'

// Simplified theme system with 3 themes
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
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const currentColors = getThemeColors(currentTheme, darkMode)

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

      const today = new Date().toDateString()
      const todayEntries = data.entries?.filter((entry: MoodEntry) =>
        new Date(entry.date).toDateString() === today
      ) || []
      setTodayEntries(todayEntries)

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
    setMobileMenuOpen(false) // Close mobile menu after theme selection
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark bg-gray-900' : currentColors.bgColor}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Background Image Overlay */}
      <div className={`fixed inset-0 ${currentColors.bgImage} bg-cover bg-center opacity-20 dark:opacity-10 -z-10 transition-all duration-500`}></div>

      {/* Responsive Header */}
      <header className={`py-4 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-sm backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${currentColors.accent} transition-colors duration-300`}>
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className={currentColors.text}>MindGarden</span>
                <span className={`hidden sm:inline ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}> Dashboard</span>
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-2">
                {Object.entries(themes).map(([themeName]) => (
                  <button 
                    key={themeName}
                    onClick={() => handleThemeChange(themeName as ThemeName)} 
                    className={`h-6 w-6 rounded-full transition-all duration-300 ${
                      currentTheme === themeName ? 'ring-2 ring-offset-2' : ''
                    } ${darkMode ? 
                      `bg-${themes[themeName as ThemeName].dark.accent.split('-')[1]}-500` : 
                      `bg-${themes[themeName as ThemeName].light.accent.split('-')[1]}-500`
                    }`}
                    aria-label={`${themeName} theme`}
                  />
                ))}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDarkMode(!darkMode)}
                className={darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistoryModal(true)}
                className={`flex items-center ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <History className="h-4 w-4 mr-2" />
                <span>History</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className={`border ${currentColors.border} ${currentColors.text} hover:${currentColors.secondary} transition-colors duration-300`}
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700/90' : 'bg-white/90'} backdrop-blur-sm shadow-lg transition-all duration-300`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium ${currentColors.text}`}>Theme Options</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(themes).map(([themeName]) => (
                    <button
                      key={themeName}
                      onClick={() => handleThemeChange(themeName as ThemeName)}
                      className={`p-2 rounded-md flex flex-col items-center ${
                        currentTheme === themeName ? 
                          darkMode ? 'bg-gray-600' : 'bg-gray-200' : 
                          darkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-100'
                      } transition-colors duration-200`}
                    >
                      <div className={`h-5 w-5 rounded-full mb-1 ${
                        darkMode ? 
                          `bg-${themes[themeName as ThemeName].dark.accent.split('-')[1]}-500` : 
                          `bg-${themes[themeName as ThemeName].light.accent.split('-')[1]}-500`
                      }`} />
                      <span className={`text-xs capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {themeName}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {darkMode ? 'Dark' : 'Light'} Mode
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setDarkMode(!darkMode)}
                    className={darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'}
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowHistoryModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center justify-center ${
                      darkMode ? 
                        'border-red-600 text-red-400 hover:bg-red-900/30' : 
                        'border-red-400 text-red-600 hover:bg-red-50'
                    }`}
                    >
                    <History className="h-4 w-4 mr-2" />
                    <span>History</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSignOut}
                    className={`flex items-center justify-center ${
                      darkMode ? 
                        'border-red-600 text-red-400 hover:bg-red-900/30' : 
                        'border-red-400 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Mood Entry and Today's Entries */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mood Entry Form */}
              <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm transition-colors duration-300`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className={`h-5 w-5 ${currentColors.text}`} />
                      <span className={currentColors.text}>How are you feeling?</span>
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
                  <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Share your thoughts and get AI-powered support
                  </CardDescription>
                </CardHeader>
                {showForm && (
                  <CardContent>
                    <form onSubmit={handleSubmitMood} className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${currentColors.text}`}>
                          Mood Description
                        </label>
                        <Textarea
                          placeholder="Describe how you're feeling today..."
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className={`min-h-[120px] ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
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
                        className={`w-full ${currentColors.accent} hover:${currentColors.accent}/90 text-white transition-colors duration-300`}
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
                <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm transition-colors duration-300`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className={`h-5 w-5 ${currentColors.text}`} />
                      <span className={currentColors.text}>Today's Entries ({todayEntries.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todayEntries.map((entry) => {
                      const entryColors = getThemeColors(entry.themeData?.theme || DEFAULT_THEME, darkMode)
                      return (
                        <div 
                          key={entry._id} 
                          className={`border rounded-lg p-4 ${entryColors.border} ${darkMode ? 'bg-gray-700/50' : 'bg-white'} transition-colors duration-300`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                              <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Mood:</span>
                              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{entry.mood}</p>
                            </div>
                            {entry.moodScore && (
                              <div>
                                <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Score:</span>
                                <span className={`ml-2 ${entryColors.text}`}>{entry.moodScore}/10</span>
                              </div>
                            )}
                            <div>
                              <span className={`font-medium flex items-center space-x-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                <MessageCircle className="h-4 w-4" />
                                <span>AI Response:</span>
                              </span>
                              <p className={`${darkMode ? 'text-gray-300 bg-gray-600/50' : 'text-gray-700 bg-gray-50'} p-3 rounded-md mt-1`}>
                                {entry.aiMessage}
                              </p>
                            </div>
                            {entry.aiTip && (
                              <div>
                                <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Self-Care Tip:</span>
                                <p className={`${darkMode ? 'text-gray-300 bg-yellow-900/50' : 'text-gray-700 bg-yellow-50'} p-3 rounded-md mt-1`}>
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

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm transition-colors duration-300`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className={`h-5 w-5 ${currentColors.text}`} />
                    <span className={currentColors.text}>Your Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} transition-colors duration-300`}>
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {moodHistory.length}
                      </div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Entries</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} transition-colors duration-300`}>
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {todayEntries.length}
                      </div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Today's Entries</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} transition-colors duration-300`}>
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {moodHistory.length > 0 ? 
                          Math.round(moodHistory.reduce((sum, entry) => sum + (entry.moodScore || 5), 0) / moodHistory.length) : 0
                        }
                      </div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg. Mood Score</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white/50'} transition-colors duration-300`}>
                      <div className={`text-3xl font-bold ${currentColors.text}`}>
                        {new Set(moodHistory.map(entry => new Date(entry.date).toDateString())).size}
                      </div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Days Tracked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Therapist Contacts */}
              <Card className={`${currentColors.border} ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm transition-colors duration-300`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className={`h-5 w-5 ${currentColors.text}`} />
                    <span className={currentColors.text}>Need Help?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {therapists.map((therapist, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${currentColors.border} transition-colors duration-300`}
                    >
                      <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{therapist.name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{therapist.specialty}</p>
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm mt-8 border-t ${currentColors.border} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${currentColors.text}`}>About MindGarden</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                A mental wellness companion that helps you track your moods, understand your emotions, and cultivate better mental health habits.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${currentColors.text}`}>Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#" 
                    className={`text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setShowHistoryModal(true)
                    }}
                  >
                    Mood History
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.mentalhealth.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Mental Health Resources
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.nami.org/Home" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    NAMI Support
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact/Help Section */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${currentColors.text}`}>Need Help?</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="tel:988" 
                    className={`text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Suicide & Crisis Lifeline: 988
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.crisistextline.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Crisis Text Line
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:support@mindgarden.example.com" 
                    className={`text-sm hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              &copy; {new Date().getFullYear()} MindGarden. All rights reserved. This is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </footer>

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${darkMode ? 'dark bg-gray-800' : 'bg-white'} ${currentColors.border}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center justify-between ${currentColors.text}`}>
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Your Mood History</span>
              </div>
              
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {moodHistory.length === 0 ? (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No mood entries yet</p>
                <p className="text-sm">Start by adding your first mood entry!</p>
              </div>
            ) : (
              moodHistory.map((entry) => {
                const entryColors = getThemeColors(entry.themeData?.theme || DEFAULT_THEME, darkMode)
                return (
                  <div 
                    key={entry._id} 
                    className={`border rounded-lg p-4 ${entryColors.border} ${darkMode ? 'bg-gray-700/50' : 'bg-white'} transition-colors duration-300`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(entry.date).toLocaleString()}
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
                        <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Mood:</span>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{entry.mood}</p>
                      </div>
                      {entry.moodScore && (
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Score:</span>
                          <span className={`ml-2 ${entryColors.text}`}>{entry.moodScore}/10</span>
                        </div>
                      )}
                      <div>
                        <span className={`font-medium flex items-center space-x-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          <MessageCircle className="h-4 w-4" />
                          <span>AI Response:</span>
                        </span>
                        <p className={`${darkMode ? 'text-gray-300 bg-gray-600/50' : 'text-gray-700 bg-gray-50'} p-3 rounded-md mt-1`}>
                          {entry.aiMessage}
                        </p>
                      </div>
                      {entry.aiTip && (
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Self-Care Tip:</span>
                          <p className={`${darkMode ? 'text-gray-300 bg-yellow-900/50' : 'text-gray-700 bg-yellow-50'} p-3 rounded-md mt-1`}>
                            {entry.aiTip}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}