import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a creative story writer. Create engaging, family-friendly stories based on the given prompt.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'gpt-3.5-turbo',
    })

    const story = completion.choices[0].message.content

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 })
  }
}