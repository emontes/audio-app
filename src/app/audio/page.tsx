'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const { currentStory, isConverting, setIsConverting } = useStore()

  useEffect(() => {
    if (!currentStory) return

    const generateAudio = async () => {
      if (currentStory.audioUrl) return

      setIsConverting(true)
      try {
        const response = await fetch('/api/audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: currentStory.content }),
        })

        const data = await response.json()
        if (data.error) throw new Error(data.error)

        const audioUrl = `data:audio/mpeg;base64,${data.audioData}`
        currentStory.audioUrl = audioUrl

        if (audioRef.current) {
          audioRef.current.src = audioUrl
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to generate audio. Please try again.')
      } finally {
        setIsConverting(false)
      }
    }

    generateAudio()
  }, [currentStory, setIsConverting])

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return

    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
    setProgress(progress)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return

    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const progressBarWidth = progressBar.offsetWidth
    const percentage = (clickPosition / progressBarWidth) * 100
    const newTime = (percentage / 100) * audioRef.current.duration

    audioRef.current.currentTime = newTime
    setProgress(percentage)
  }

  if (!currentStory) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-gray-500">Select a story to listen</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">{currentStory.title}</h1>
        
        {isConverting ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600">Converting text to speech...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div
              className="h-2 w-full cursor-pointer rounded-full bg-gray-200"
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handlePlayPause}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isPlaying ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 whitespace-pre-wrap text-gray-700">
          {currentStory.content}
        </div>
      </div>
    </main>
  )
}