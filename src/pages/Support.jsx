import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TopRightActions from '../components/TopRightActions'
import BottomNav from '../components/BottomNav'
import '../styles/login.css'
import '../styles/auth-subpages.css'

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const WELCOME_MESSAGE = {
  id: 'welcome',
  from: 'agent',
  text: 'Hello! Welcome to CoinSwitch 24/7 support. How can we help you today? You can send a message or attach a file.',
  time: new Date(),
  file: null,
}

export default function Support() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [text, setText] = useState('')
  const [pendingFile, setPendingFile] = useState(null)
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setPendingFile(file)
    e.target.value = ''
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed && !pendingFile) return

    const newMsg = {
      id: Date.now().toString(),
      from: 'user',
      text: trimmed || '(File attached)',
      time: new Date(),
      file: pendingFile
        ? { name: pendingFile.name, size: pendingFile.size, type: pendingFile.type }
        : null,
    }

    setMessages((prev) => [...prev, newMsg])
    setText('')
    setPendingFile(null)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-agent`,
          from: 'agent',
          text: 'Thank you for your message. A support agent will reply shortly.',
          time: new Date(),
          file: null,
        },
      ])
    }, 800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = text.trim().length > 0 || pendingFile

  return (
    <>
      <div className="dot-glow-bl" />
      <div className="dot-glow-tr" />

      <div className="support-page">
        <header className="support-header">
          <Link to="/login" className="btn-back" title="Go back" aria-label="Go back">
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div className="support-header-text">
            <h1>24/7 Online Support</h1>
            <p>
              <span className="live-dot" aria-hidden="true" />
              We are online — talk to us
            </p>
          </div>
        </header>

        <TopRightActions />

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.from}`}>
              {msg.text}
              {msg.file && (
                <div className="chat-file">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>
                    {msg.file.name}
                    {msg.file.size ? ` (${(msg.file.size / 1024).toFixed(1)} KB)` : ''}
                  </span>
                </div>
              )}
              <span className="chat-time">{formatTime(msg.time)}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-composer">
          {pendingFile && (
            <div className="chat-pending-file">
              <span>{pendingFile.name}</span>
              <button type="button" onClick={() => setPendingFile(null)}>
                Remove
              </button>
            </div>
          )}
          <div className="chat-input-row">
            <label className="chat-attach" title="Attach file">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </label>
            <textarea
              className="chat-textarea"
              rows={1}
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="chat-send"
              disabled={!canSend}
              onClick={handleSend}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <BottomNav activePage="/login" />
    </>
  )
}
