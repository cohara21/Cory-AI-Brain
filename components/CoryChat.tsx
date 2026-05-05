'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function CoryChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const [tankData, setTankData] = useState<unknown>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Iframe received raw event:', event.data);

      if (event.data && event.data.type === 'UPDATE_TANK_DATA') {
        console.log('MATCH FOUND! Setting tankData to:', event.data.data);
        setTankData(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === 'streaming' || status === 'submitted';

  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSubmitWithData = (e: any) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    const text = localInput.trim();
    if (!text || isLoading) {
      return;
    }
    void sendMessage({ text }, { body: { tankData } });
    setLocalInput('');
  };

  return (
    <>
      <button className="floating-ai" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Cory Chat">
        <img src="/assets/corychaticon.svg" alt="" />
      </button>

      <div className="cory-popup" aria-hidden={!isOpen} style={{ display: isOpen ? 'flex' : 'none' }}>
        <div className="cory-header">
          <div className="cory-avatar">
            <img src="/assets/coryforcard.svg" alt="" />
          </div>
          <p className="cory-name">Cory</p>
          <button className="cory-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
            ×
          </button>
        </div>

        <div className="cory-body" ref={bodyRef}>
          {messages.length === 0 && (
            <div className="cory-bubble">
              <p>Start a conversation with Cory about the reef!</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`cory-bubble ${m.role === 'user' ? 'user' : ''}`}>
              <p>{m.parts?.map((p) => (p.type === 'text' ? p.text : '')).join('') || ''}</p>
            </div>
          ))}
          {isLoading && (
            <div className="cory-bubble typing">
              <p>Thinking...</p>
            </div>
          )}
          {error && (
            <div className="cory-bubble">
              <p style={{ color: 'red' }}>Error: {error.message}</p>
            </div>
          )}
        </div>

        <form className="cory-input-row" onSubmit={handleSubmitWithData}>
          <input
            className="cory-input"
            type="text"
            placeholder="Ask Cory about the reef..."
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
          />
          <button type="submit" className="cory-send" disabled={isLoading || !localInput.trim()} aria-label="Send">
            <img src="/assets/bb543680-485a-4fa9-b5ed-481596dd53fd.svg" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </button>
        </form>

        <div className="cory-pointer"></div>
      </div>
    </>
  );
}
