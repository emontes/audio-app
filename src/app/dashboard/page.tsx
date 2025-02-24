'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { createClient } from '@/lib/supabase'

interface Story {
  id: string
  title: string
  content: string
  audioUrl?: string
  createdAt: Date
}

export default function Dashboard() {
  const router = useRouter()
  const { stories, addStory, setCurrentStory } = useStore()
  const supabase = createClient()

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching stories:', error)
        return
      }

      if (data) {
        data.forEach(story => {
          addStory({
            id: story.id,
            title: story.title,
            content: story.content,
            audioUrl: story.audio_url,
            createdAt: new Date(story.created_at)
          })
        })
      }
    }

    fetchStories()
  }, [addStory, supabase])

  const handleStoryClick = (story: Story) => {
    setCurrentStory(story)
    router.push('/audio')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Your Stories</h1>
        
        {stories.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <p className="text-gray-500">No stories yet. Generate your first story!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div
                key={story.id}
                className="cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
                onClick={() => handleStoryClick(story)}
              >
                <h2 className="mb-2 text-xl font-semibold text-gray-900">{story.title}</h2>
                <p className="mb-4 line-clamp-3 text-gray-600">{story.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  {story.audioUrl && (
                    <span className="flex items-center text-blue-500">
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      Audio available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}