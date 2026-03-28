import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/chat.css";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");
const username = localStorage.getItem("username") || "User";

function Chats() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("join_room", groupId);

    socket.on("receive_message", (data) => {
      setChatHistory((list) => [...list, { ...data, type: "received" }]);
    });

    return () => socket.off("receive_message");
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

   const messageData = {
  room: groupId,
  text: message,
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  author: username,
};

    socket.emit("send_message", messageData);

    setChatHistory((list) => [...list, { ...messageData, type: "sent" }]);
    setMessage("");
  };

  return (
    <div className="chat-layout">
      {/* SIDEBAR */}
      <aside className="mini-sidebar">
        <div className="avatar-circle">💬</div>
        <button className="back-circle" onClick={() => navigate("/dashboard")}>
          ←
        </button>
      </aside>

      {/* MAIN */}
      <main className="chat-main">
        <header className="chat-top-bar">
          <div>
            <h3>Room {groupId}</h3>
            <span className="live-status">● Online</span>
          </div>

          <button
            className="btn-copy"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link Copied!");
            }}
          >
            Copy Link
          </button>
        </header>

        {/* MESSAGES */}
        <div className="messages-container">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`message ${msg.type}`}>
              <div className="bubble">
               <p className={`author ${msg.type === "sent" ? "me" : ""}`}>
                  {msg.type === "sent" ? "You" : msg.author}
              </p>
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form className="chat-input-wrapper" onSubmit={handleSend}>
          <input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">➤</button>
        </form>
      </main>
    </div>
  );
}

export default Chats;