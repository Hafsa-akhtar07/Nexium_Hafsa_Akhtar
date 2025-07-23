import { NextRequest, NextResponse } from 'next/server'
import dbConnect, { MoodEntry } from '@/lib/mongodb'

// // GET /api/mood-entries - Get mood entries for a user
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Get entries with pagination
    const entries = await MoodEntry.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await MoodEntry.countDocuments({ userId })

    return NextResponse.json({ 
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


// POST /api/mood-entries - Create a new mood entry with real AI response
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, userEmail, mood, moodScore } = await request.json();

    if (!userId || !userEmail || !mood) {
      return NextResponse.json(
        { error: 'User ID, email, and mood are required' },
        { status: 400 }
      );
    }

    if (mood.length > 2000) {
      return NextResponse.json(
        { error: 'Mood text is too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    let aiMessage = "Thank you for sharing your mood. Remember, it's okay to feel this way.";
    let aiTip = "Take a moment to breathe deeply and be kind to yourself.";

    try {
      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
          'HTTP-Referer': 'https://your-site.com', // optional
          'X-Title': 'Mental Health Tracker', // optional
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'user',
              content: `User said: "${mood}". Generate a kind, supportive message and a short tip for self-care.`,
            }
          ]
        }),
      });

      const data = await openRouterRes.json();

      const aiContent = data?.choices?.[0]?.message?.content || '';
      const [message, tip] = aiContent.split('Tip:');

      aiMessage = message?.trim() || aiMessage;
      aiTip = tip?.trim() || aiTip;

      console.log('AI Message:', aiMessage);
      console.log('AI Tip:', aiTip);

    } catch (err) {
      console.error('OpenRouter AI call failed:', err);
    }

    const newEntry = new MoodEntry({
      userId,
      userEmail,
      mood: mood.trim(),
      aiMessage: aiMessage.trim(),
      aiTip: aiTip.trim(),
      moodScore: moodScore || null,
      date: new Date(),
    });

    await newEntry.save();

    return NextResponse.json({
      success: true,
      entry: {
        _id: newEntry._id,
        userId: newEntry.userId,
        userEmail: newEntry.userEmail,
        mood: newEntry.mood,
        aiMessage: newEntry.aiMessage,
        aiTip: newEntry.aiTip,
        moodScore: newEntry.moodScore,
        date: newEntry.date,
        createdAt: newEntry.createdAt,
      },
      message: 'Mood entry saved successfully',
    });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



// // POST /api/mood-entries - Create a new mood entry with real AI response
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect()
    
//     const { userId, userEmail, mood, moodScore } = await request.json()
    
//     if (!userId || !userEmail || !mood) {
//       return NextResponse.json(
//         { error: 'User ID, email, and mood are required' },
//         { status: 400 }
//       )
//     }

//     // Validate mood length
//     if (mood.length > 2000) {
//       return NextResponse.json(
//         { error: 'Mood text is too long (max 2000 characters)' },
//         { status: 400 }
//       )
//     }

//     // Get real AI response from n8n webhook
//     let aiMessage = "Thank you for sharing your mood. Remember, it's okay to feel this way."
//     let aiTip = "Take a moment to breathe deeply and be kind to yourself."
    
//     try {
//       // Call n8n webhook for AI processing
//       const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/mood-analysis', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${process.env.N8N_WEBHOOK_TOKEN || ''}` // Optional webhook token
//         },
//         body: JSON.stringify({
//           userId,
//           userEmail,
//           mood: mood.trim(),
//           moodScore: moodScore || null,
//           timestamp: new Date().toISOString(),
//           source: 'mental-health-tracker'
//         }),
//         // Add timeout to prevent hanging requests
//         signal: AbortSignal.timeout(30000) // 30 second timeout
//       })

//       if (n8nResponse.ok) {
//         const aiData = await n8nResponse.json()
        
//         // Extract AI response and tip from n8n response
//         aiMessage = aiData.aiMessage || aiData.message || aiMessage
//         aiTip = aiData.aiTip || aiData.tip || aiTip
        
//         console.log('AI Response received from n8n:', { aiMessage, aiTip })
//       } else {
//         console.error('n8n webhook failed:', n8nResponse.status, n8nResponse.statusText)
//         // Continue with default message if n8n fails
//       }
//     } catch (error) {
//       console.error('Error calling n8n webhook:', error)
//       // Continue with default message if n8n fails
//     }

//     // Create new mood entry with all data
//     const newEntry = new MoodEntry({
//       userId,
//       userEmail,
//       mood: mood.trim(),
//       aiMessage: aiMessage.trim(),
//       aiTip: aiTip.trim(),
//       moodScore: moodScore || null,
//       date: new Date()
//     })

//     await newEntry.save()

//     return NextResponse.json({ 
//       success: true, 
//       entry: {
//         _id: newEntry._id,
//         userId: newEntry.userId,
//         userEmail: newEntry.userEmail,
//         mood: newEntry.mood,
//         aiMessage: newEntry.aiMessage,
//         aiTip: newEntry.aiTip,
//         moodScore: newEntry.moodScore,
//         date: newEntry.date,
//         createdAt: newEntry.createdAt
//       },
//       message: 'Mood entry saved successfully' 
//     })
//   } catch (error) {
//     console.error('Error creating mood entry:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// // DELETE /api/mood-entries - Delete a mood entry
// export async function DELETE(request: NextRequest) {
//   try {
//     await dbConnect()
    
//     const { searchParams } = new URL(request.url)
//     const entryId = searchParams.get('id')
//     const userId = searchParams.get('userId')
    
//     if (!entryId || !userId) {
//       return NextResponse.json(
//         { error: 'Entry ID and User ID are required' },
//         { status: 400 }
//       )
//     }

//     // Delete entry and verify it belongs to the user
//     const deletedEntry = await MoodEntry.findOneAndDelete({
//       _id: entryId,
//       userId: userId
//     })

//     if (!deletedEntry) {
//       return NextResponse.json(
//         { error: 'Entry not found or unauthorized' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json({ 
//       success: true,
//       message: 'Mood entry deleted successfully' 
//     })
//   } catch (error) {
//     console.error('Error deleting mood entry:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// } 


