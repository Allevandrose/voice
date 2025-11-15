// backend/server.js
require("dotenv").config();
const http = require("http");
const express = require("express");
const { WebSocketServer } = require("ws");
const WebSocket = require("ws");

const app = express();

// ⭐ Serve static frontend files from /public
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// Validate API key on startup
if (!DEEPGRAM_API_KEY) {
  console.error("❌ DEEPGRAM_API_KEY not found in .env file");
  process.exit(1);
}

wss.on("connection", (clientWs) => {
  console.log("✅ Browser connected to proxy");

  // Build Deepgram URL with query params
  const deepgramUrl = new URL("wss://api.deepgram.com/v1/listen");
  deepgramUrl.searchParams.set("model", "nova-2");
  deepgramUrl.searchParams.set("language", "en-US");
  deepgramUrl.searchParams.set("smart_format", "true");
  deepgramUrl.searchParams.set("interim_results", "false");
  deepgramUrl.searchParams.set("encoding", "linear16");
  deepgramUrl.searchParams.set("sample_rate", "16000");
  deepgramUrl.searchParams.set("channels", "1");

  console.log("🔌 Connecting to Deepgram...");

  // Connect to Deepgram with proper headers
  const deepgramWs = new WebSocket(deepgramUrl.toString(), {
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`,
    },
  });

  let isDeepgramConnected = false;

  deepgramWs.on("open", () => {
    console.log("✅ Connected to Deepgram");
    isDeepgramConnected = true;
  });

  deepgramWs.on("error", (err) => {
    console.error("❌ Deepgram error:", err.message);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(1011, "Deepgram connection error");
    }
  });

  deepgramWs.on("close", (code, reason) => {
    const reasonStr = reason?.toString() || "No reason provided";
    console.log(`Deepgram connection closed: ${code} - ${reasonStr}`);

    if (code === 1002) console.error("❌ Protocol error – check API key/params");
    if (code === 1005) console.error("❌ No status received – auth issue?");
    if (code === 1006) console.error("❌ Abnormal closure – network dropped");

    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(code, reasonStr);
    }
  });

  // Forward transcripts: Deepgram → browser
  deepgramWs.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === "Metadata") {
        console.log("📋 Deepgram metadata:", msg);
      } else if (msg.type === "Results") {
        const transcript = msg.channel?.alternatives?.[0]?.transcript;
        if (transcript) console.log("📝 Transcript:", transcript);
      }

      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(data.toString());
      }
    } catch (err) {
      console.error("Error processing Deepgram message:", err);
    }
  });

  // Browser → Deepgram (audio forwarding)
  clientWs.on("message", (data) => {
    if (!isDeepgramConnected) {
      console.warn("⚠️ Deepgram not connected yet, buffering...");
      return;
    }

    if (deepgramWs.readyState === WebSocket.OPEN) {
      deepgramWs.send(data);
    } else {
      console.warn(
        "⚠️ Deepgram connection not open, state:",
        deepgramWs.readyState
      );
    }
  });

  clientWs.on("close", () => {
    console.log("Browser disconnected");
    if (deepgramWs.readyState === WebSocket.OPEN) {
      deepgramWs.close();
    }
  });

  clientWs.on("error", (err) => {
    console.error("Client WebSocket error:", err.message);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`✅ Secure Deepgram proxy running on ws://localhost:${PORT}/ws`);
  console.log(`📁 Serving static files from /public`);
  console.log(`🔑 API Key loaded: ${DEEPGRAM_API_KEY.substring(0, 8)}...`);
});
