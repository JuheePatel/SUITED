import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { createThread, sendMessage } from "./services/openai";

function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser ? "bg-accent text-primary" : "bg-primary text-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}

export default function ChatWithAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initializeChat = async () => {
      const newThreadId = await createThread();
      setThreadId(newThreadId);
      setMessages([
        {
          content:
            "Hello! I'm Suited, your AI resume assistant. I can help you create, improve, or tailor your resume. What would you like help with today?",
          isUser: false,
        },
      ]);
    };

    initializeChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !threadId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);

    try {
      const response = await sendMessage(threadId, userMessage);
      setMessages((prev) => [...prev, { content: response, isUser: false }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "I apologize, but I encountered an error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-secondary shadow-custom">
      <CardHeader>
        <CardTitle className="text-xl text-accent flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Chat with Suited
        </CardTitle>
        <p className="text-sm text-foreground/80">
          Get AI assistance for your resume - ask questions, get feedback, or
          get help creating a new resume
        </p>
      </CardHeader>

      <CardContent className="h-[500px] flex flex-col">
        <div className="flex-1 bg-card/50 rounded-lg p-4 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isUser={message.isUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-lg bg-primary text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            placeholder="Type your message..."
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
