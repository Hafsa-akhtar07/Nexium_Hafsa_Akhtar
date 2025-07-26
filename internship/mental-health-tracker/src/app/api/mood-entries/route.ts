import { NextRequest, NextResponse } from "next/server";
import dbConnect, { MoodEntry } from "@/lib/mongodb";

// Emotion type definitions
type Emotion = 'happy' | 'calm' | 'neutral' | 'sad' | 'angry' | 'frustrated';
type EmotionResponse = {
  theme: 'cool' | 'warm';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  aiTone: string;
};

// Emotion detection and response mapping
const EMOTION_RESPONSES: Record<Emotion, EmotionResponse> = {
  happy: {
    theme: 'cool',
    colorScheme: {
      primary: 'bg-blue-100',
      secondary: 'bg-blue-200',
      accent: 'bg-blue-500',
      text: 'text-blue-900'
    },
    aiTone: 'celebratory'
  },
  calm: {
    theme: 'cool',
    colorScheme: {
      primary: 'bg-teal-100',
      secondary: 'bg-teal-200',
      accent: 'bg-teal-500',
      text: 'text-teal-900'
    },
    aiTone: 'peaceful'
  },
  neutral: {
    theme: 'cool',
    colorScheme: {
      primary: 'bg-gray-100',
      secondary: 'bg-gray-200',
      accent: 'bg-gray-500',
      text: 'text-gray-900'
    },
    aiTone: 'neutral'
  },
  sad: {
    theme: 'warm',
    colorScheme: {
      primary: 'bg-purple-100',
      secondary: 'bg-purple-200',
      accent: 'bg-purple-500',
      text: 'text-purple-900'
    },
    aiTone: 'compassionate'
  },
  angry: {
    theme: 'warm',
    colorScheme: {
      primary: 'bg-red-100',
      secondary: 'bg-red-200',
      accent: 'bg-red-500',
      text: 'text-red-900'
    },
    aiTone: 'calming'
  },
  frustrated: {
    theme: 'warm',
    colorScheme: {
      primary: 'bg-orange-100',
      secondary: 'bg-orange-200',
      accent: 'bg-orange-500',
      text: 'text-orange-900'
    },
    aiTone: 'reassuring'
  }
};

// Detect emotion from mood text and score
const detectEmotion = (mood: string, moodScore: number | null): Emotion => {
  const lowerMood = mood.toLowerCase();
  
  // Positive keywords
  const positiveWords = ['happy', 'joy', 'excited', 'good', 'great', 'wonderful'];
  if (positiveWords.some(word => lowerMood.includes(word))) {
    return 'happy';
  }
  
  // Calm keywords
  const calmWords = ['calm', 'peace', 'relax', 'chill', 'serene'];
  if (calmWords.some(word => lowerMood.includes(word))) {
    return 'calm';
  }
  
  // Negative keywords
  const angryWords = ['angry', 'mad', 'furious', 'rage', 'hate'];
  if (angryWords.some(word => lowerMood.includes(word))) {
    return 'angry';
  }
  
  const frustratedWords = ['frustrated', 'annoyed', 'irritated', 'upset'];
  if (frustratedWords.some(word => lowerMood.includes(word))) {
    return 'frustrated';
  }
  
  const sadWords = ['sad', 'depressed', 'lonely', 'hurt', 'cry'];
  if (sadWords.some(word => lowerMood.includes(word))) {
    return 'sad';
  }
  
  // Use mood score if available
  if (moodScore !== null) {
    if (moodScore > 7) return 'happy';
    if (moodScore > 5) return 'calm';
    if (moodScore < 3) return 'sad';
    if (moodScore < 2) return 'angry';
  }
  
  return 'neutral';
};

// GET /api/mood-entries - Get mood entries for a user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get entries with pagination and emotion data
    const entries = await MoodEntry.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .then(entries => entries.map(entry => ({
        ...entry,
        emotion: detectEmotion(entry.mood, entry.moodScore),
        themeData: EMOTION_RESPONSES[detectEmotion(entry.mood, entry.moodScore)]
      })));

    // Get total count for pagination
    const total = await MoodEntry.countDocuments({ userId });

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/mood-entries - Create a new mood entry with AI response
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, userEmail, mood, moodScore } = await request.json();

    if (!userId || !userEmail || !mood) {
      return NextResponse.json(
        { error: "User ID, email, and mood are required" },
        { status: 400 }
      );
    }

    if (mood.length > 2000) {
      return NextResponse.json(
        { error: "Mood text is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    // Detect emotion and get theme data
    const emotion = detectEmotion(mood, moodScore);
    const emotionData = EMOTION_RESPONSES[emotion];

    // Base AI messages with emotional tone
    let aiMessage = "";
    let aiTip = "";

    switch (emotion) {
      case 'happy':
        aiMessage = "I'm so glad you're feeling happy! ";
        aiTip = "Consider sharing your joy with someone else today.";
        break;
      case 'calm':
        aiMessage = "This peaceful feeling is wonderful. ";
        aiTip = "Mindfulness can help maintain this calm state.";
        break;
      case 'sad':
        aiMessage = "I'm sorry you're feeling this way. ";
        aiTip = "Be gentle with yourself - these feelings will pass.";
        break;
      case 'angry':
        aiMessage = "Anger can be challenging to sit with. ";
        aiTip = "Try some physical activity to release this energy.";
        break;
      case 'frustrated':
        aiMessage = "Frustration is completely understandable. ";
        aiTip = "Step away for a moment if you can - fresh perspective helps.";
        break;
      default:
        aiMessage = "Thank you for sharing how you're feeling. ";
        aiTip = "Checking in with yourself is an important practice.";
    }

    try {
      const openRouterRes = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
            "HTTP-Referer": "https://nexium-hafsa-akhtar.vercel.app",
            "X-Title": "Mental Health Tracker",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
              {
                role: "system",
                content: `Respond in a ${emotionData.aiTone} tone. The user is feeling ${emotion}.`
              },
              {
                role: "user",
                content: `User said: "${mood}". Generate a kind, supportive message and a short tip for self-care.`
              },
            ],
          }),
        }
      );

      const data = await openRouterRes.json();
      const aiContent = data?.choices?.[0]?.message?.content || "";

      if (aiContent.toLowerCase().includes("tip:")) {
        const [msg, tip] = aiContent.split(/Tip:/i);
        aiMessage = msg.trim() || aiMessage;
        aiTip = tip.trim() || aiTip;
      } else {
        aiMessage = aiContent.trim();
      }
    } catch (err) {
      console.error("OpenRouter AI call failed:", err);
    }

    const newEntry = new MoodEntry({
      userId,
      userEmail,
      mood: mood.trim(),
      aiMessage: aiMessage.trim(),
      aiTip: aiTip.trim(),
      moodScore: moodScore || null,
      emotion,
      themeData: emotionData,
      date: new Date(),
    });

    await newEntry.save();

    return NextResponse.json({
      success: true,
      entry: {
        ...newEntry.toObject(),
        themeData: emotionData // Include theme data in response
      },
      message: "Mood entry saved successfully",
      theme: emotionData.theme,
      colorScheme: emotionData.colorScheme
    });
  } catch (error) {
    console.error("Error creating mood entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}