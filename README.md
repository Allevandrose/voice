# Voice — Real-Time Speech-to-Text Transcription

A real-time speech-to-text web application that transcribes spoken audio using Deepgram's Nova-2 API. Built with Node.js, Express, WebSockets, and vanilla JavaScript.

🔗 **Live Demo:** [https://voice-gohc.onrender.com](https://voice-gohc.onrender.com)

---

## Overview

This tool captures audio from your microphone and streams it to Deepgram's API for real-time transcription. The backend acts as a secure WebSocket proxy between your browser and Deepgram.

**Why I built this:** I think better when I speak. This tool lets me dictate messages, ideas, and code documentation — and I'm using it right now to talk to you.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Real-Time Transcription** | Converts speech to text as you speak |
| **Deepgram Nova-2 Model** | State-of-the-art accuracy for English |
| **WebSocket Proxy** | Secure backend relay (no frontend API keys exposed) |
| **Microphone Support** | Uses browser's `getUserMedia` API |
| **Simple UI** | Clean, distraction-free interface |
| **Copy to Clipboard** | One-click copy of transcribed text |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Backend | Node.js + Express |
| Real-Time | WebSocket (`ws` library) |
| Speech Recognition | Deepgram API (Nova-2 model) |
| Frontend | Vanilla HTML/CSS/JS |
| Deployment | Render |
| Environment | dotenv |

---

## How It Works
[Your Microphone]
↓
[Browser / Public UI]
↓ (WebSocket)
[Node.js Backend Proxy]
↓ (WebSocket + API Key)
[Deepgram API (Nova-2)]
↓
[Transcription Streamed Back]
↓
[Displayed on Screen]

text

**Why a proxy?** Deepgram API keys must be kept secret. The backend handles authentication, not the frontend.

---

## Audio Configuration

| Parameter | Value |
|-----------|-------|
| Model | `nova-2` |
| Language | `en-US` |
| Encoding | `linear16` |
| Sample Rate | 16,000 Hz |
| Channels | 1 (mono) |
| Interim Results | `false` (only final transcripts) |
| Smart Format | `true` (punctuation, capitalization) |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DEEPGRAM_API_KEY=your_deepgram_api_key_here
PORT=10000
⚠️ Never commit .env to GitHub.

Local Setup
bash
# Clone the repository
git clone https://github.com/Allevandrose/voice.git
cd voice

# Install dependencies
npm install

# Create .env file and add your Deepgram API key

# Start the server
npm start

# Or for development with auto-restart
npm run dev
Then open http://localhost:10000 in your browser.

Project Structure
text
voice/
├── public/                 # Static frontend files
│   ├── index.html          # Main UI
│   ├── style.css           # Styling
│   └── client.js           # Frontend WebSocket + microphone logic
├── server.js               # Node.js backend with WebSocket proxy
├── package.json
├── .env.example            # Environment template
└── README.md
API Endpoints
Endpoint	Method	Description
/	GET	Serves the frontend UI
/ws	WebSocket	WebSocket connection for audio streaming
Deepgram API Details
This project uses Deepgram's Nova-2 model, their most accurate general-purpose model.

Feature	Benefit
Nova-2	State-of-the-art accuracy
Smart Format	Automatic punctuation and capitalization
Real-time	Stream audio incrementally
Get a Deepgram API key: Deepgram Console

Deployment on Render
This app is configured for deployment on Render:

Push code to GitHub

Create a new Web Service on Render

Connect your repository

Set DEEPGRAM_API_KEY as an environment variable

Render automatically builds and deploys using npm start

Note: Render free tier spins down after 15 minutes of inactivity. First request may take 20-30 seconds to wake up.

What I Learned
Building this tool taught me:

Working with WebSockets for real-time bidirectional communication

Integrating third-party speech recognition APIs (Deepgram)

Creating a secure proxy to hide API keys from the frontend

Handling audio streaming from browser microphone

Deploying a Node.js app with WebSocket support to Render

Building a tool I actually use daily (dogfooding)

Why This Tool Matters to Me
I built this because I think better when I speak. This tool lets me:

Dictate long messages without typing

Transcribe voice notes into text

Capture ideas while walking or thinking out loud

I'm using it right now to communicate with you. That's the best testimonial.

Future Improvements
Add support for multiple languages (Swahili, etc.)

Save transcriptions to local storage or cloud

Export transcripts as .txt or .md files

Add pause/resume and recording controls

Implement speaker diarization (identify different speakers)

Add confidence scoring for transcribed words

Troubleshooting
Issue	Solution
Microphone not working	Check browser permissions for microphone access
No transcription appears	Check console for errors; verify Deepgram API key is valid
WebSocket connection fails	Ensure backend is running and port is correct
"Deepgram connection error"	API key invalid or expired. Regenerate in Deepgram console.
Render deployment fails	Verify DEEPGRAM_API_KEY is set in Render environment variables
Testing Locally with Frontend
bash
# Start the backend
npm start

# Open browser to:
http://localhost:10000

# Grant microphone permission
# Speak into your microphone
# Watch the transcription appear in real-time
License
This project is open source for portfolio purposes.

Contact
Built by Ibrahim Mulei — ibrahimmulei@gmail.com

GitHub: @Allevandrose

📌 Live Demo: https://voice-gohc.onrender.com
🔗 Portfolio: ibrahimmulei.netlify.app

Fun Fact
This README was partially dictated using this tool. That's not a demo — that's real dogfooding.
