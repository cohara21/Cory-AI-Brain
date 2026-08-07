'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Gemini writes its replies in Markdown, so emphasis arrives as `**78.5°F**`.
 * Printing that string straight into the bubble showed the asterisks to the
 * reader — the formatting instruction became visual noise on top of the number
 * it was meant to highlight.
 *
 * This renders **bold** and *italic* as real elements. It returns React nodes
 * rather than an HTML string, so nothing the model produces can inject markup.
 *
 * Mid-stream a delimiter may not have closed yet ("at **78.5"); that fragment
 * renders literally for a beat and resolves once the closing token arrives.
 */
/**
 * The model separates paragraphs with a blank line. HTML collapses whitespace,
 * so a three-paragraph answer was arriving as one unbroken block of text.
 * Split on blank lines so each block becomes its own <p>.
 */
function splitIntoParagraphs(text: string): string[] {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return blocks.length > 0 ? blocks : [''];
}

function renderMarkdownEmphasis(text: string): ReactNode[] {
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      nodes.push(<em key={key++}>{match[2]}</em>);
    }
    cursor = pattern.lastIndex;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}

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
          {messages.map((m) => {
            const text = m.parts?.map((p) => (p.type === 'text' ? p.text : '')).join('') || '';
            return (
              <div key={m.id} className={`cory-bubble ${m.role === 'user' ? 'user' : ''}`}>
                {splitIntoParagraphs(text).map((paragraph, i) => (
                  <p key={i}>{renderMarkdownEmphasis(paragraph)}</p>
                ))}
              </div>
            );
          })}
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
