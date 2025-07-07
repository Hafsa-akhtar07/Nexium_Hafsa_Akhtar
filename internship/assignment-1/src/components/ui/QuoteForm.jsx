'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import quotesData from "@/data/quotes"

export default function QuoteForm() {
  const [topic, setTopic] = useState("")
  const [quotes, setQuotes] = useState([]) // ✅ FIXED

  const handleSubmit = () => {
    const found = quotesData.find(q => q.topic.toLowerCase() === topic.toLowerCase())
    setQuotes(found ? found.quotes.slice(0, 3) : ["No quotes found for this topic."])
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <Input
        placeholder="Enter topic (e.g. self-love)"
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />
      {/* <Button className="mt-2" onClick={handleSubmit}>Get Quotes</Button> */}
      <button className="btn btn btn-soft btn-success mt-3" onClick={handleSubmit}>Get Quotes</button>

      {quotes.length > 0 && (
        <div className="mt-6 space-y-4">
          {quotes.map((q, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-sm">{q}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
