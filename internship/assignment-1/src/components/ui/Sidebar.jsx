"use client"
import { useState } from "react"

export default function Sidebar({ isOpen, onClose }) {
  const quoteTopics = [
    "Motivation", "Success", "Inspiration", "Life",
    "Love", "Wisdom", "Leadership", "Creativity"
  ]

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-purple-950/95 text-white z-50 p-6 md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Quote Topics</h2>
            <button
              onClick={onClose}
              className="text-sm underline"
            >
              Close ✕
            </button>
          </div>
          <ul className="space-y-3">
            {quoteTopics.map((topic) => (
              <li key={topic}>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-purple-800">
                  {topic}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <aside className="hidden md:block w-64 bg-purple-900/90 text-purple-50 p-6 h-full fixed left-0 top-16 bottom-0">
        <h2 className="text-xl font-bold mb-4 text-pink-300 border-b border-purple-700 pb-2">
          Quote Topics
        </h2>
        <ul className="space-y-2">
          {quoteTopics.map(topic => (
            <li key={topic}>
              <button className="w-full text-left px-4 py-2 rounded-md hover:bg-purple-800/70 flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3" />
                {topic}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}