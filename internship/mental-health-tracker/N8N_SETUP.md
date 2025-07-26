# n8n Setup Guide for Mental Health Tracker

This guide will help you set up n8n with OpenAI integration to provide real AI responses for your mental health tracker.

## Prerequisites

- Node.js 18+ installed
- OpenAI API key
- n8n installed globally or via Docker

## Installation Options

### Option 1: Global Installation
```bash
npm install -g n8n
```

### Option 2: Docker Installation
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option 3: Docker Compose (Recommended for Production)
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_secure_password
      - N8N_ENCRYPTION_KEY=your_32_character_encryption_key
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=UTC
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:
```

## Step-by-Step Setup

### 1. Start n8n
```bash
# If installed globally
n8n start

# If using Docker
docker-compose up -d
```

### 2. Access n8n Interface
Open your browser and go to: `http://localhost:5678`

### 3. Create New Workflow
1. Click "Create new workflow"
2. Name it "Mental Health Tracker - AI Mood Analysis"

### 4. Add Webhook Trigger
1. Click the "+" button to add a node
2. Search for "Webhook" and select it
3. Configure the webhook:
   - **HTTP Method**: POST
   - **Path**: `mood-analysis`
   - **Response Mode**: Respond to Webhook
   - **Options**: Enable "Raw Body"

### 5. Add OpenAI Node
1. Add another node and search for "OpenAI"
2. Configure OpenAI:
   - **Authentication**: API Key
   - **API Key**: Your OpenAI API key
   - **Resource**: Chat
   - **Model**: gpt-3.5-turbo
   - **Messages**:
     ```
     System: You are a compassionate mental health AI assistant. Analyze the user's mood and provide a supportive response with a self-care tip. Keep responses under 200 words and be warm and understanding.
     
     User: The user shared this mood: {{$json.mood}}. Please provide a supportive response and a self-care tip.
     ```
   - **Options**:
     - Temperature: 0.7
     - Max Tokens: 300
     - Response Format: JSON Object

### 6. Add Response Node
1. Add "Respond to Webhook" node
2. Configure response:
   - **Respond With**: JSON
   - **Response Body**:
     ```json
     {
       "aiMessage": "{{$json.choices[0].message.content}}",
       "aiTip": "{{$json.choices[0].message.content}}",
       "timestamp": "{{$now}}",
       "userId": "{{$('Webhook').item.json.userId}}"
     }
     ```

### 7. Connect Nodes
1. Connect Webhook → OpenAI → Respond to Webhook
2. Save the workflow

### 8. Test the Webhook
1. Copy the webhook URL from the webhook node
2. Test with curl:
```bash
curl -X POST http://localhost:5678/webhook/mood-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "userEmail": "test@example.com",
    "mood": "I am feeling anxious about my upcoming presentation",
    "moodScore": 3,
    "timestamp": "2024-01-01T12:00:00Z"
  }'
```

## Environment Variables

Add these to your `.env.local`:
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/mood-analysis
N8N_WEBHOOK_TOKEN=your_optional_token
```

## Production Deployment

### Using Docker Compose
1. Create production `docker-compose.yml`:
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - WEBHOOK_URL=${N8N_WEBHOOK_URL}
      - GENERIC_TIMEZONE=UTC
      - N8N_LOG_LEVEL=error
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped
    networks:
      - n8n_network

volumes:
  n8n_data:

networks:
  n8n_network:
    driver: bridge
```

2. Create `.env` file:
```env
N8N_PASSWORD=your_secure_password
N8N_ENCRYPTION_KEY=your_32_character_encryption_key
N8N_WEBHOOK_URL=https://your-domain.com
```

### Using Railway/Heroku
1. Deploy n8n to your preferred platform
2. Set environment variables in the platform dashboard
3. Update your Next.js app's `N8N_WEBHOOK_URL` to point to the deployed n8n instance

## Security Considerations

1. **Authentication**: Enable basic auth for n8n
2. **Webhook Tokens**: Use webhook tokens for additional security
3. **Rate Limiting**: Implement rate limiting in your Next.js API
4. **Input Validation**: Validate all inputs before sending to n8n
5. **Error Handling**: Handle n8n failures gracefully

## Troubleshooting

### Common Issues

1. **Webhook not receiving data**:
   - Check n8n is running on correct port
   - Verify webhook URL in Next.js environment
   - Check firewall settings

2. **OpenAI errors**:
   - Verify API key is correct
   - Check OpenAI account has credits
   - Verify model name is correct

3. **Response format issues**:
   - Check JSON structure in response node
   - Verify field names match what Next.js expects

### Debug Mode
Enable debug logging in n8n:
```bash
N8N_LOG_LEVEL=debug n8n start
```

## Monitoring

1. **n8n Dashboard**: Monitor workflow executions
2. **Logs**: Check n8n logs for errors
3. **OpenAI Usage**: Monitor API usage and costs
4. **Response Times**: Track webhook response times

## Cost Optimization

1. **Model Selection**: Use gpt-3.5-turbo for cost efficiency
2. **Token Limits**: Set appropriate max tokens
3. **Caching**: Consider caching similar responses
4. **Rate Limiting**: Implement rate limiting to control costs 