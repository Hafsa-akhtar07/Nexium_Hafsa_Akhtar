// app/page.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [urdu, setUrdu] = useState('');

  const handleSummarise = async () => {
  try {
    const res = await fetch("/api/summarise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      throw new Error("Failed to summarise");
    }

    const data = await res.json();
    setSummary(data.summary);
    setUrdu(data.urdu);
  } catch (error) {
    console.error("Error:", error);
    setSummary("Error: Unable to fetch summary.");
    setUrdu("");
  }
};


  return (
    <main className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">📝 Blog Summariser</h1>

      <Input
        placeholder="Enter blog URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Button onClick={handleSummarise}>Summarise</Button>

      {summary && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">English Summary</h3>
          <p>{summary}</p>
        </Card>
      )}

      {urdu && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Urdu Translation</h3>
          <p dir="rtl">{urdu}</p>
        </Card>
      )}
    </main>
  );
}
