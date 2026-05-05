'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { FormEvent, useEffect, useRef, useState } from 'react';

const defaultTankData = {
  temperature: 78.2,
  ph: 8.4,
  salinity: 35,
  redox: 380,
  healthScore: 94,
  activeAlerts: ['No current alerts']
};

function getLiveTankData() {
  const w = typeof window !== 'undefined' ? (window as any).__tankMetrics : null;
  if (w) {
    return {
      temperature: Number(w.temp?.toFixed(1) ?? defaultTankData.temperature),
      ph: Number(w.ph?.toFixed(2) ?? defaultTankData.ph),
      salinity: Math.round(w.salinity ?? defaultTankData.salinity),
      redox: Math.round(w.redox ?? defaultTankData.redox),
      healthScore: Math.round(w.health ?? defaultTankData.healthScore),
      activeAlerts: defaultTankData.activeAlerts
    };
  }
  return defaultTankData;
}

export default function CoryChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const [tankData, setTankData] = useState<any | null>(null);

  // Listen for postMessage updates from a parent window and store latest tank data
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event?.data?.type === 'UPDATE_TANK_DATA') {
          setTankData(event.data.data ?? null);
        }
      } catch (e) {
        // ignore malformed messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Use a ref-based transport so we can update the body dynamically (includes tankData)
  const transportRef = useRef(new DefaultChatTransport({
    api: '/api/chat',
    body: () => ({
      data: getLiveTankData(),
      tankData: tankData
    })
  }));

  const { messages, sendMessage, status, error } = useChat({
    transport: transportRef.current
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-scroll to bottom when messages change or streaming updates
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, status]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = localInput.trim();
    if (!trimmed) return;

    sendMessage({ text: trimmed });
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
          <button className="cory-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">×</button>
        </div>

        <div className="cory-body" ref={bodyRef}>
          {messages.length === 0 && (
            <div className="cory-bubble">
              <p>Start a conversation with Cory about the reef!</p>
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`cory-bubble ${m.role === 'user' ? 'user' : ''}`}>
              <p>{m.parts?.map(p => p.type === 'text' ? p.text : '').join('') || ''}</p>
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

        <form className="cory-input-row" onSubmit={onSubmit}>
          <input
            className="cory-input"
            type="text"
            placeholder="Ask Cory about the reef..."
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
          />
          <button type="submit" className="cory-send" disabled={isLoading || !localInput.trim()} aria-label="Send">
            <img src="/assets/bb543680-485a-4fa9-b5ed-481596dd53fd.svg" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
          </button>
        </form>

        <div className="cory-pointer"></div>
      </div>
    </>
  );
}
