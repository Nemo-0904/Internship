// frontend/src/components/Chatbot.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chatbot/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant specialized in robotics, electronics, 3D designing (CAD), and 3D printing. " +
                "Answer with structured, practical guidance, tools, and troubleshooting tips. " +
                "Keep responses clear, concise, and suitable for an engineering student.",
            },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let botMessage = { sender: "bot", text: "" };
      setMessages((prev) => [...prev, botMessage]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const data = line.replace("data: ", "").trim();

          if (data === "[DONE]") break;
          if (data === "[ERROR]") {
            botMessage.text = "⚠️ Streaming failed.";
            setMessages((prev) => [...prev.slice(0, -1), botMessage]);
            return;
          }

          try {
            const parsed = JSON.parse(data);
            botMessage.text += parsed.text || "";
          } catch (e) {
            botMessage.text += data;
          }

          setMessages((prev) => [
            ...prev.slice(0, -1),
            { ...botMessage },
          ]);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn't reach the AI agent." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? "open" : "closed"}`}>
      {isOpen ? (
        <div className="chatbot">
          <div className="chatbot-header">
            <span className="header-title">
              <i className="fa-solid fa-robot"></i> Robotic Co. Assistant
            </span>
            <button className="close-btn" onClick={toggleChat} aria-label="Close Chat">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="chat-window">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === "user" ? "user" : "bot"}>
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            ))}
            {loading && (
              <div className="bot thinking">
                <i className="fa-solid fa-circle-notch"></i> Gathering thoughts...
              </div>
            )}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about robotics, CAD, or 3D printing..."
              disabled={loading}
            />
            <button 
              className="input-btn" 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-toggle" onClick={toggleChat} aria-label="Open Chat">
          <i className="fa-solid fa-comment-dots"></i>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
