'use client'

import Image from "next/image";
import { useState } from 'react'
import { useStore } from '@/lib/store'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const { isGenerating, setIsGenerating, addStory, setCurrentStory, currentStory, stories } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      const newStory = {
        id: Date.now().toString(),
        title: prompt.slice(0, 50) + '...',
        content: data.story,
        createdAt: new Date(),
      }

      addStory(newStory)
      setCurrentStory(newStory)
      setPrompt('')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate story. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">AI Story Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt here..."
            className="w-full h-32 p-4 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Story'}
          </button>
        </form>
      </div>
      {currentStory && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{currentStory.title}</h2>
          <p className="whitespace-pre-wrap">{currentStory.content}</p>
        </div>
      )}
    </main>
  )
}
