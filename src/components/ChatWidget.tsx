import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, RotateCcw } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getSessionId(): string {
  const key = 'stauf-chat-session';
  let id = localStorage.getItem(key);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function resetSession(): string {
  const key = 'stauf-chat-session';
  const id = generateUUID();
  localStorage.setItem(key, id);
  return id;
}

export function ChatWidget() {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [closing, setClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef<string>('');

  const handleNewConversation = useCallback(() => {
    sessionIdRef.current = resetSession();
    setMessages([{
      id: 'greeting',
      role: 'bot',
      text: 'Oi! Sou o Frederico, assistente virtual da Stauf. Como posso te ajudar?',
    }]);
    setHasGreeted(true);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleOpen = useCallback(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = getSessionId();
    }
    setClosing(false);
    setOpen(true);

    if (!hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          id: generateUUID(),
          role: 'bot',
          text: 'Oi! Sou o Frederico, assistente virtual da Stauf. Como posso te ajudar?',
        },
      ]);
    }
  }, [hasGreeted]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 250);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    const userMsg: Message = { id: generateUUID(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionIdRef.current,
        }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      const botText = data.response || data.reply || data.message || 'Desculpe, não consegui processar sua mensagem.';

      setMessages((prev) => [
        ...prev,
        { id: generateUUID(), role: 'bot', text: botText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateUUID(),
          role: 'bot',
          text: 'Desculpe, estou com dificuldades no momento. Tente novamente em instantes.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  }, [input, typing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  // --- Styles ---

  const fabStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: colors.brand,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 24px ${colors.shadow}, 0 0 0 0 ${colors.brand}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    animation: !open ? 'chatPulse 2.5s ease-in-out infinite' : 'none',
  };

  const windowStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 90,
    right: 24,
    zIndex: 9998,
    width: 380,
    maxWidth: 'calc(100vw - 32px)',
    height: 520,
    maxHeight: 'calc(100vh - 120px)',
    borderRadius: 16,
    background: colors.glass,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${colors.glassBorder}`,
    boxShadow: `0 8px 40px ${colors.shadow}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: closing ? 'chatSlideDown 0.25s ease-in forwards' : 'chatSlideUp 0.3s ease-out forwards',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: `1px solid ${colors.border}`,
    flexShrink: 0,
  };

  const messagesAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };

  const inputAreaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    padding: '10px 14px',
    borderTop: `1px solid ${colors.border}`,
    flexShrink: 0,
  };

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 4px 24px ${colors.shadow}, 0 0 0 0 ${colors.brand}40; }
          50% { box-shadow: 0 4px 24px ${colors.shadow}, 0 0 0 10px ${colors.brand}00; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatSlideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.96); }
        }
        @keyframes chatTypingDot {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
        .chat-messages-area::-webkit-scrollbar { width: 4px; }
        .chat-messages-area::-webkit-scrollbar-track { background: transparent; }
        .chat-messages-area::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 4px; }
        @media (max-width: 480px) {
          .chat-window-responsive {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: calc(100vh - 60px) !important;
            max-height: 100vh !important;
            border-radius: 16px 16px 0 0 !important;
          }
          .chat-fab-responsive {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>

      {/* Chat window */}
      {open && (
        <div style={windowStyle} className="chat-window-responsive">
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  flexShrink: 0,
                  boxShadow: '0 0 6px #22c55e80',
                }}
              />
              <span style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>
                Frederico
              </span>
              <span style={{ fontSize: 12, color: colors.textMuted }}>
                &mdash; Stauf.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={handleNewConversation}
                title="Nova conversa"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textMuted,
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}
                aria-label="Nova conversa"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textMuted,
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.textMuted)}
                aria-label="Fechar chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={messagesAreaStyle} className="chat-messages-area">
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    ...(msg.role === 'user'
                      ? {
                          background: colors.brand,
                          color: '#fff',
                        }
                      : {
                          background: colors.glassCard,
                          border: `1px solid ${colors.glassCardBorder}`,
                          color: colors.text,
                        }),
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '14px 14px 14px 4px',
                    background: colors.glassCard,
                    border: `1px solid ${colors.glassCardBorder}`,
                    color: colors.textMuted,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>Frederico est&aacute; digitando</span>
                  <span style={{ display: 'inline-flex', gap: 2, marginLeft: 2 }}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: colors.textMuted,
                          display: 'inline-block',
                          animation: `chatTypingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={inputAreaStyle}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 13.5,
                lineHeight: 1.5,
                background: colors.inputBg,
                color: colors.text,
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
                maxHeight: 120,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = colors.brandDark)}
              onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || typing}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: 'none',
                background: input.trim() && !typing ? colors.brand : colors.bgAlt,
                color: input.trim() && !typing ? '#fff' : colors.textDim,
                cursor: input.trim() && !typing ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s, color 0.2s',
              }}
              aria-label="Enviar mensagem"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={open ? handleClose : handleOpen}
        style={fabStyle}
        className="chat-fab-responsive"
        aria-label={open ? 'Fechar chat' : 'Abrir chat'}
      >
        {open ? <X size={24} color="#fff" /> : <MessageCircle size={24} color="#fff" />}
      </button>
    </>
  );
}
