import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import "../styles/App.css";

function Dashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState("chat");
  const [inputValue, setInputValue] = useState("");

  const handleCreate = () => {
    const id = uuid().substring(0, 8);
    const route = view === "chat" ? `/chats/${id}` : `/room/${id}`;
    navigate(route);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const prefix = view === "chat" ? "/chats/" : "/room/";
    const id = inputValue.includes(prefix)
      ? inputValue.split(prefix)[1]
      : inputValue;

    navigate(view === "chat" ? `/chats/${id}` : `/room/${id}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="dash-container">
      {/* 📱 MOBILE TOP BAR (Only visible on mobile) */}
      <div className="mobile-top-bar">
        <div className="mobile-logo">ZoomX</div>
        <button className="mobile-logout" onClick={logout}>Sign Out</button>
      </div>

      {/* SIDEBAR (Desktop) */}
      <aside className="sidebar">
        <h2 className="logo">ZoomX</h2>
        <nav className="nav-menu">
          <div
            className={`nav-item ${view === "chat" ? "active" : ""}`}
            onClick={() => {
              setView("chat");
              setInputValue("");
            }}
          >
            <span className="icon">💬</span> Team Messaging
          </div>

          <div
            className={`nav-item ${view === "video" ? "active" : ""}`}
            onClick={() => {
              setView("video");
              setInputValue("");
            }}
          >
            <span className="icon">📹</span> Live Meetings
          </div>
        </nav>
        <button className="logout-btn" onClick={logout}>
          Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="content-header">
          <h1>
            {view === "chat"
              ? "Team Collaboration Hub"
              : "Virtual Meeting Space"}
          </h1>
          <p>
            {view === "chat"
              ? "Communicate with your team in real-time, securely and efficiently."
              : "High-quality video conferencing for your team."}
          </p>
        </header>

        <section className="action-grid">
          {/* CREATE CARD */}
          <div className={`glass-card ${view === "chat" ? "chat-border" : "video-border"}`}>
            <div className="card-icon">
              {view === "chat" ? "🚀" : "🎥"}
            </div>
            <h3>{view === "chat" ? "Start New Conversation" : "Start New Meeting"}</h3>
            <p>
              {view === "chat"
                ? "Create a private chat room and invite your team instantly."
                : "Launch a secure video session and share the meeting link."}
            </p>
            <button className="btn-primary" onClick={handleCreate}>
              {view === "chat" ? "Create Chat Room" : "Start Meeting"}
            </button>
          </div>

          {/* JOIN CARD */}
          <div className={`glass-card ${view === "chat" ? "chat-border" : "video-border"}`}>
            <div className="card-icon">🔗</div>
            <h3>{view === "chat" ? "Join Existing Chat" : "Join Meeting"}</h3>
            <p>
              {view === "chat"
                ? "Enter a room ID or paste a shared link to join the conversation."
                : "Paste the meeting link or ID to join instantly."}
            </p>
            <form onSubmit={handleJoin} className="join-form">
              <input
                type="text"
                placeholder={view === "chat" ? "Enter chat room ID..." : "Enter meeting ID..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="btn-glow">Join Now</button>
            </form>
          </div>
        </section>

        {/* 📲 MOBILE BOTTOM NAV (Only visible on mobile) */}
        <div className="mobile-bottom-nav">
          <div className={`nav-item-mobile ${view === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>
            <span style={{fontSize: '20px'}}>💬</span>
            <span>Chat</span>
          </div>
          <div className={`nav-item-mobile ${view === 'video' ? 'active' : ''}`} onClick={() => setView('video')}>
            <span style={{fontSize: '20px'}}>📹</span>
            <span>Meetings</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;