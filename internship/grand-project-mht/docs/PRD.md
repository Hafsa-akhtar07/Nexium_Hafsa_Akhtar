# 🧠 Mental Health Tracker – Product Requirements Document (PRD)

## ✨ Overview

The **Mental Health Tracker** is an AI-powered web app designed to help users track their moods, write daily journals, and receive supportive messages. The app will use **Supabase** for magic-link authentication, **MongoDB** for storing user data, and **n8n** for generating AI messages. The project is fully deployed using **Vercel CI/CD**.

---

## 👩‍⚕️ Target Users

- Individuals struggling with mental health who want a lightweight tool to track and reflect.
- Teens and young adults needing emotional support and journaling.
- Therapists recommending mood-tracking tools to patients.

---

## 🎯 Key Features

### 1. Magic Link Login (Supabase)
- Email-only login (no passwords).
- Secure and fast authentication.

### 2. Daily Mood Tracker
- Emoji-based mood selection.
- Notes or tags for the day.
- Mood history view (calendar/list).

### 3. Journaling
- Write and save daily reflections.
- Show journal history by date.

### 4. AI-Supportive Messages (via n8n)
- Users get personalized messages based on mood.
- Messages generated via an AI agent triggered through n8n workflows.

### 5. Dashboard
- Mood graph.
- Journaling summary.
- AI message highlights.

---

## 🧱 Tech Stack

| Layer           | Tool/Platform           |
|----------------|-------------------------|
| Frontend       | Next.js (TypeScript)    |
| Styling        | Tailwind CSS, ShadCN UI |
| Auth           | Supabase                |
| Database       | MongoDB (via Mongoose)  |
| AI Automation  | n8n (self-hosted/cloud) |
| Deployment     | Vercel (CI/CD)          |

---

## 📊 Data Models

### User
```ts
{
  id: string
  email: string
  createdAt: Date
}
