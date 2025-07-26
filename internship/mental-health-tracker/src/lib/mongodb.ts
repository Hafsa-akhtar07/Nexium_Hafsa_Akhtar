import mongoose from 'mongoose'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Mood Entry Schema - Updated to allow multiple entries per day
const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Index for faster queries by user
  },
  userEmail: {
    type: String,
    required: true,
    index: true // Index for email-based queries
  },
  mood: {
    type: String,
    required: true,
    maxlength: 2000 // Limit mood text length
  },
  aiMessage: {
    type: String,
    required: true,
    maxlength: 1000 // Limit AI response length
  },
  aiTip: {
    type: String,
    required: false,
    maxlength: 500 // Optional self-care tip
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 10,
    required: false // Optional mood rating 1-10
  },
  tags: [{
    type: String,
    enum: ['happy', 'sad', 'anxious', 'excited', 'tired', 'stressed', 'calm', 'angry', 'grateful', 'lonely']
  }],
  date: {
    type: Date,
    default: Date.now,
    index: true // Index for date-based queries
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
})

// Compound index for efficient user + date queries
moodEntrySchema.index({ userId: 1, date: -1 })

// Prevent multiple model initialization
export const MoodEntry = mongoose.models.MoodEntry || mongoose.model('MoodEntry', moodEntrySchema)

export default dbConnect 