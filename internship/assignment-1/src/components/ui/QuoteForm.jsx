'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import quotesData from "@/data/quotes"

export default function QuoteForm() {
  const [topic, setTopic] = useState("")
  const [quotes, setQuotes] = useState([])

  const handleSubmit = () => {
    const found = quotesData.find(q => q.topic.toLowerCase() === topic.toLowerCase())
    setQuotes(found ? found.quotes.slice(0, 3) : ["No quotes found for this topic."])
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Inspirational Quotes Finder
      </h2>
      
      <div className="flex gap-2">
        <Input
          placeholder="Enter topic (e.g. self-love, motivation)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="flex-1 border-purple-300 focus:border-pink-400 focus:ring-1 focus:ring-pink-300"
        />
        
        <Button 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg transition-all"
        >
          Get Quotes
        </Button>
      </div>

      {quotes.length > 0 && (
        <div className="mt-8 space-y-4 animate-fade-in">
          {quotes.map((q, i) => (
            <Card key={i} className="border-0 bg-gradient-to-r from-purple-100 to-pink-50 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <p className="text-purple-800 italic text-lg">"{q}"</p>
                {!q.includes("No quotes") && (
                  <p className="mt-2 text-sm text-pink-600">— {topic.charAt(0).toUpperCase() + topic.slice(1)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}