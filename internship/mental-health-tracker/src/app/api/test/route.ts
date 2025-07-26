import { NextResponse } from 'next/server'

// GET /api/test - Test endpoint to verify API is working
export async function GET() {
  return NextResponse.json({ 
    message: 'Mental Health Tracker API is working!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  })
}

// POST /api/test - Test endpoint for POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      message: 'POST request received successfully',
      data: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid JSON in request body' 
    }, { status: 400 })
  }
} 