# Mental Health Tracker

A modern AI-powered mental health tracking web application built with Next.js 14, Supabase, MongoDB, and n8n for AI automation.

## Features

- 🔐 **Magic Link Authentication** - Secure passwordless login via Supabase
- 📝 **Daily Mood Tracking** - Record your daily mood and thoughts
- 🤖 **AI-Powered Support** - Get personalized AI responses and self-care tips
- 📊 **Mood History** - View your mood patterns over time
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS and ShadCN UI
- 📱 **Responsive Design** - Works perfectly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI, Radix UI
- **Authentication**: Supabase (Magic Link)
- **Database**: MongoDB with Mongoose
- **AI Processing**: n8n (self-hosted) with OpenAI integration
- **Styling**: Tailwind CSS with custom design system

## Project Structure

```
mental-health-tracker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── mood-entries/  # Mood entry CRUD operations
│   │   ├── dashboard/         # Protected dashboard page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   └── ui/               # ShadCN UI components
│   └── lib/                  # Utility functions and configurations
│       ├── mongodb.ts        # MongoDB connection and models
│       ├── supabase.ts       # Supabase client
│       └── utils.ts          # Utility functions
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── env.example              # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Supabase account
- n8n (optional, for AI processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MONGODB_URI=mongodb://localhost:27017/mental-health-tracker
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/mood-analysis
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Enable Email Auth with Magic Link
   - Copy your project URL and anon key to `.env.local`

5. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `mental-health-tracker`
   - Update `MONGODB_URI` in `.env.local`

6. **Set up n8n (Optional)**
   - Install n8n: `npm install -g n8n`
   - Create a webhook workflow for mood analysis
   - Configure OpenAI integration
   - Update `N8N_WEBHOOK_URL` in `.env.local`

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication
1. Enter your email on the landing page
2. Click "Send Magic Link"
3. Check your email and click the magic link
4. You'll be redirected to the dashboard

### Mood Tracking
1. On the dashboard, you'll see a mood entry form
2. Describe how you're feeling today
3. Submit the form to save your mood
4. Get an AI-powered response and self-care tip
5. View your mood history on the right side

### Features
- **Daily Limit**: Only one mood entry per day
- **AI Responses**: Personalized messages based on your mood
- **History View**: See your past entries and AI responses
- **Statistics**: Track your total entries and daily progress

## API Endpoints

### GET /api/mood-entries
Get mood entries for a user
```bash
GET /api/mood-entries?userId=user_id
```

### POST /api/mood-entries
Create a new mood entry
```bash
POST /api/mood-entries
Content-Type: application/json

{
  "userId": "user_id",
  "mood": "I'm feeling great today!"
}
```

## n8n Workflow Setup

For AI processing, create an n8n workflow:

1. **Webhook Trigger**: Receive mood data from Next.js
2. **OpenAI Node**: Generate AI response using mood text
3. **Respond to Webhook**: Return AI message to Next.js

Example workflow:
```
Webhook → OpenAI (GPT-3.5) → Respond to Webhook
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Railway**: Supports MongoDB and environment variables
- **DigitalOcean App Platform**: Full-stack deployment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `N8N_WEBHOOK_URL` | n8n webhook URL for AI processing | No |
| `OPENAI_API_KEY` | OpenAI API key (if not using n8n) | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainers.

## Roadmap

- [ ] Mood analytics and charts
- [ ] Export mood data
- [ ] Push notifications
- [ ] Mobile app
- [ ] Integration with health apps
- [ ] Group mood tracking
- [ ] Professional therapist integration 