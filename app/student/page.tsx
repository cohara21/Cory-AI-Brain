'use client';

import React from 'react';
import CoryChat from '@/components/CoryChat';

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Reset body so the iframe is transparent */
        html, body {
          margin: 0;
          padding: 0;
          background-color: transparent;
          font-family: "Inter", sans-serif;
        }

        /* Cory Chat Widget Styling */
        .floating-ai { position: fixed; right: 20px; bottom: 20px; width: 85px; height: 85px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 40; }
        .floating-ai img { width: 100%; height: 100%; display: block; object-fit: contain; }

        .cory-popup { position: fixed; right: 20px; bottom: 108px; width: 331px; height: 450px; background: #ffffff; z-index: 45; border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }

        .cory-header { height: 65px; background: #005eb4; position: relative; flex-shrink: 0; }
        .cory-avatar { position: absolute; left: 16px; top: 14px; width: 38px; height: 38px; border: 2px solid #0075de; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 2px; }
        .cory-avatar img { width: 25px; height: auto; display: block; }
        .cory-name { position: absolute; left: 66px; top: 25px; margin: 0; color: #ffffff; font-size: 14px; font-weight: 700; }
        .cory-close { position: absolute; right: 10px; top: 18px; width: 28px; height: 28px; border: none; background: transparent; color: #ffffff; font-size: 24px; cursor: pointer; z-index: 2; }

        .cory-body { flex: 1; background: #ffffff; padding: 16px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        
        /* This pushes the messages to the bottom like iMessage */
        .cory-bubble:first-child { margin-top: auto; }
        
        .cory-bubble { width: fit-content; max-width: 85%; border-radius: 12px; background: #f3f6ff; border: 1px solid #dbe7ff; padding: 10px 14px; align-self: flex-start; }
        .cory-bubble.user { background: #0075de; border-color: #0075de; align-self: flex-end; }
        .cory-bubble p { margin: 0; font-size: 13px; line-height: 1.4; color: #000000; }
        .cory-bubble.user p { color: #ffffff; }

        .cory-input-row { height: 60px; border-top: 1px solid rgba(0, 0, 0, 0.05); display: flex; align-items: center; gap: 8px; padding: 0 12px; background: #ffffff; flex-shrink: 0; }
        .cory-input { flex: 1; height: 36px; border: none; border-radius: 6px; background: #f3f4f2; padding: 0 12px; font-size: 13px; outline: none; color: #111827; }
        
        /* Flex-shrink prevents the button from warping, !important forces the image size */
        .cory-send { width: 36px; height: 36px; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; overflow: hidden;}
        .cory-send img { width: 16px !important; height: 16px !important; display: block; object-fit: contain; }
        .cory-send:disabled { opacity: 0.5; cursor: not-allowed; }
      `}} />
      <main style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
        <CoryChat />
      </main>
    </>
  );
}