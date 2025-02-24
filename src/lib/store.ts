import { create } from 'zustand'

type Story = {
  id: string
  title: string
  content: string
  audioUrl?: string
  createdAt: Date
}

type StoreState = {
  stories: Story[]
  currentStory: Story | null
  isPlaying: boolean
  isGenerating: boolean
  isConverting: boolean
  addStory: (story: Story) => void
  setCurrentStory: (story: Story | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setIsGenerating: (isGenerating: boolean) => void
  setIsConverting: (isConverting: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  stories: [],
  currentStory: null,
  isPlaying: false,
  isGenerating: false,
  isConverting: false,
  addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),
  setCurrentStory: (story) => set({ currentStory: story }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsConverting: (isConverting) => set({ isConverting }),
}))