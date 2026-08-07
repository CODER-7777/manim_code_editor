"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Copy, Check, Trash2, Bot, User, Cpu } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function CreatorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Manim AI assistant. Describe what you want to animate — a sine wave, a proof, a 3D surface — and I'll generate the Manim code for you.\n\nTry something like:\n• \"Create a circle that transforms into a square\"\n• \"Visualize the Fourier series of a sawtooth wave\"\n• \"Show the Pythagorean theorem with labeled triangles\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<"gemini" | "ollama">("gemini");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response (replace with real API call later)
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(userMsg.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared! Describe your next animation idea.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-glow flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-text text-sm">AI Creator</h1>
            <p className="text-xs text-text-muted">Generate Manim code with AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Provider Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-surface overflow-hidden">
            <button
              onClick={() => setAiProvider("gemini")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                aiProvider === "gemini"
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Gemini
            </button>
            <button
              onClick={() => setAiProvider("ollama")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                aiProvider === "ollama"
                  ? "bg-accent text-white"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Cpu className="w-3 h-3" />
              Ollama
            </button>
          </div>

          <button
            onClick={clearChat}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-accent-glow flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-accent" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "bg-surface border border-border text-text rounded-bl-md"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>

                {/* Copy button for assistant messages */}
                {msg.role === "assistant" && msg.id !== "welcome" && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy code
                      </>
                    )}
                  </button>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-accent" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-lg bg-accent-glow flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="py-4 border-t border-border shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your animation..."
              rows={1}
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-text-muted mt-2 text-center">
          Using {aiProvider === "gemini" ? "Gemini (Cloud)" : "Ollama (Local)"} · Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

// Mock response generator — replace with real Gemini/Ollama API later
function generateMockResponse(prompt: string): string {
  return `Here's the Manim code for your request:

from manim import *

class CustomScene(Scene):
    def construct(self):
        # Based on: "${prompt}"
        
        title = Text("${prompt.slice(0, 30)}...", font_size=36)
        title.set_color(BLUE)
        
        self.play(Write(title))
        self.wait()
        self.play(FadeOut(title))

You can paste this into the Editor and hit Render to see it in action!`;
}
