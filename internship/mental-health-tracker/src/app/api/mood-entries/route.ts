import { NextRequest, NextResponse } from "next/server";
import dbConnect, { MoodEntry } from "@/lib/mongodb";

// GET handler (already exists)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const entries = await MoodEntry.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST handler (already exists)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, userEmail, mood, moodScore } = await request.json();

    if (!userId || !userEmail || !mood) {
      return NextResponse.json({ error: "User ID, email, and mood are required" }, { status: 400 });
    }

    if (mood.length > 2000) {
      return NextResponse.json({ error: "Mood text is too long (max 2000 characters)" }, { status: 400 });
    }

    let aiMessage = "Thanks for sharing how you feel.";
    let aiTip = "Remember to take care of yourself today.";

    try {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
      "HTTP-Referer": "https://your-site-url.com", // ✅ Replace with your actual deployed domain
      "X-Title": "Mental Health Tracker", // ✅ Replace with your site name
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content: "You are a kind and supportive mental health assistant.",
        },
        {
          role: "user",
          content: `User said: "${mood}". Generate a kind, supportive message and a short tip for self-care.`,
        },
      ],
    }),
  });

      const data = await res.json();
      const aiContent = data?.choices?.[0]?.message?.content?.trim() || "";

      if (aiContent.toLowerCase().includes("tip:")) {
        const [msg, tip] = aiContent.split(/tip:/i);
        aiMessage = msg.trim() || aiMessage;
        aiTip = tip.trim() || aiTip;
      } else {
        aiMessage = aiContent || aiMessage;
      }
    } catch (err) {
      console.error("AI call failed:", err);
    }

    const newEntry = new MoodEntry({
      userId,
      userEmail,
      mood: mood.trim(),
      moodScore: moodScore || null,
      aiMessage,
      aiTip,
      date: new Date(),
    });

    await newEntry.save();

    return NextResponse.json({
      success: true,
      entry: newEntry.toObject(),
      message: "Mood entry saved successfully",
    });
  } catch (error) {
    console.error("Error creating mood entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ NEW: DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json({ error: "ID and User ID are required" }, { status: 400 });
    }

    const result = await MoodEntry.findOneAndDelete({ _id: id, userId });

    if (!result) {
      return NextResponse.json({ error: "Mood entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Mood entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting mood entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
