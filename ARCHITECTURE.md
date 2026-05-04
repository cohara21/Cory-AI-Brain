# Coral Keepers — Architecture & Migration Guide

> **Purpose:** This document explains how the Coral Keepers codebase is structured after
> migrating from vanilla HTML/JS to Next.js 16 (App Router). Any AI assistant or developer
> working on this project should read this first.

---

## 1. Overview

Coral Keepers is an educational marine biology platform with two views:
- **Student View** — Dashboard, coursework, messages, calendar, profile
- **Teacher View** — Dashboard, course management, announcements, calendar, messages

The app was originally built as **static HTML files** (`Teacher/*.html`, `Student/*.html`)
with inline CSS and vanilla JavaScript. It has been migrated to **Next.js 16 App Router**
to support server-side API routes (for AI chat) and modern React component architecture.

### Tech Stack

| Layer         | Technology                                    |
|---------------|-----------------------------------------------|
| Framework     | Next.js 16.2.4 (App Router, Turbopack)        |
| UI Library    | React 19.2.4                                  |
| Language      | TypeScript 5                                  |
| AI SDK        | Vercel AI SDK v6 (`ai@6.0.174`, `@ai-sdk/react@3.0.176`) |
| AI Model      | Google Gemini 2.5 Flash (`@ai-sdk/google`)    |
| Styling       | Inline CSS via `dangerouslySetInnerHTML`       |
| Dev Server    | `npm run dev` → `http://localhost:3000`        |

---

## 2. Directory Structure

```
Coral Keepers Teacher/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (html, body)
│   ├── page.tsx                  # Root redirect → /student
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI chat streaming endpoint
│   ├── student/
│   │   ├── page.tsx              # Student dashboard (home)
│   │   ├── learn/page.tsx        # Coursework listing
│   │   ├── announcements/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── profile/page.tsx
│   │   └── is-coral-animal/page.tsx  # Video lesson page
│   └── teacher/
│       ├── page.tsx              # Teacher dashboard (home)
│       ├── learn/page.tsx
│       ├── announcements/page.tsx
│       ├── calendar/page.tsx
│       ├── messages/page.tsx
│       ├── course/page.tsx
│       ├── course-details/page.tsx
│       └── post-reading/page.tsx
├── components/
│   └── CoryChat.tsx              # AI chatbot component (React)
├── public/
│   └── assets/                   # All images, SVGs, fonts
├── Teacher/                      # LEGACY — original static HTML files
├── Student/                      # LEGACY — original static HTML files
├── .env.local                    # GOOGLE_GENERATIVE_AI_API_KEY
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 3. The Hybrid Rendering Approach

### How Pages Work

Each `page.tsx` file is a **client component** (`'use client'`) that renders the original
HTML using two `dangerouslySetInnerHTML` blocks:

1. **`<style>`** — Contains all the page's CSS as an inline string
2. **`<div>`** — Contains all the page's HTML markup as an inline string

This was done to preserve pixel-perfect fidelity with the original Figma designs while
gaining Next.js routing and API capabilities.

```tsx
// Typical page structure
'use client';

import React from 'react';
import CoryChat from '@/components/CoryChat';

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "/* all CSS here */" }} />
      <div dangerouslySetInnerHTML={{ __html: "<!-- all HTML here -->" }}
           suppressHydrationWarning />
      <CoryChat />
    </>
  );
}
```

### Why `suppressHydrationWarning`?

The inline HTML contains `<script>` blocks with vanilla JS that manipulates the DOM
after render. This causes React hydration mismatches (server HTML ≠ client HTML).
The `suppressHydrationWarning` prop tells React to ignore these harmless differences.

### Inline `<script>` Blocks

Some pages have `<script>` tags inside the HTML string that handle:
- **Tank vitals ticker** (student & teacher home) — jitters temperature, pH, salinity, 
  redox every ~6 seconds
- **Modal open/close** (tank enlarge, vital history)
- **Announcements** (compose, filter, edit, delete)
- **Calendar** (event creation, navigation)
- **Messages** (send message, conversation switching)

These scripts use vanilla `document.querySelector` / `addEventListener` because they
operate on the `dangerouslySetInnerHTML` content, which React does not control.

---

## 4. CoryChat — AI Integration

### Component: `components/CoryChat.tsx`

CoryChat is the **only true React component** in the app. It renders a floating chat
bubble (Cory the coral mascot) that opens a popup chat window.

**Key implementation details:**

| Aspect            | Implementation |
|-------------------|----------------|
| Hook              | `useChat` from `@ai-sdk/react` (AI SDK v6) |
| Transport         | `DefaultChatTransport` from `ai` package |
| Send method       | `sendMessage({ text: '...' })` |
| Body data         | Passed via transport `body: () => ({ data: getLiveTankData() })` |
| Live vitals       | Read from `window.__tankMetrics` (set by inline script ticker) |
| Stream response   | `toUIMessageStreamResponse()` on server |
| Message display   | `m.parts?.map(p => p.type === 'text' ? p.text : '')` |

### API Route: `app/api/chat/route.ts`

- Receives `{ messages, data }` from the client
- Builds a system prompt with live tank vitals and ideal ranges
- Streams response from Gemini 2.5 Flash via `streamText()`
- Returns `result.toUIMessageStreamResponse()`

### Vitals Bridge: `window.__tankMetrics`

The inline `<script>` on the home pages writes `window.__tankMetrics = metrics` on
every tick (~6s). The CoryChat component reads this via `getLiveTankData()` before
each API call, so Cory always has the latest tank readings.

---

## 5. AI SDK v6 — Critical API Notes

The Vercel AI SDK v6 has **breaking changes** from v4/v5. These are the correct APIs:

| What                     | ❌ Old (v4/v5)                     | ✅ Current (v6)                         |
|--------------------------|------------------------------------|-----------------------------------------|
| Submit message           | `append({ role, content })`        | `sendMessage({ text: '...' })`          |
| Form helpers             | `input`, `handleSubmit`            | Not on `useChat` — use manual state     |
| Pass extra body data     | `useChat({ body: {...} })`         | `new DefaultChatTransport({ body })` passed as `transport` |
| Stream response (server) | `result.toDataStreamResponse()`    | `result.toUIMessageStreamResponse()`    |
| Read message text        | `m.content`                        | `m.parts?.map(p => p.text).join('')`    |
| Status values            | `isLoading` boolean                | `status: 'submitted' \| 'streaming' \| 'ready' \| 'error'` |

---

## 6. Legacy Files

The `Teacher/` and `Student/` directories contain the **original static HTML files**.
They are NOT served by Next.js but remain in the repo as reference. The canonical
source of truth is the `app/` directory.

### Route Mapping

| Legacy File                    | Next.js Route                  |
|-------------------------------|--------------------------------|
| `Student/index.html`          | `/student`                     |
| `Student/learn.html`          | `/student/learn`               |
| `Student/announcements.html`  | `/student/announcements`       |
| `Student/calendar.html`       | `/student/calendar`            |
| `Student/messages.html`       | `/student/messages`            |
| `Student/profile.html`        | `/student/profile`             |
| `Student/is-coral-animal.html`| `/student/is-coral-animal`     |
| `Teacher/index.html`          | `/teacher`                     |
| `Teacher/learn.html`          | `/teacher/learn`               |
| `Teacher/announcements.html`  | `/teacher/announcements`       |
| `Teacher/calendar.html`       | `/teacher/calendar`            |
| `Teacher/messages.html`       | `/teacher/messages`            |
| `Teacher/course.html`         | `/teacher/course`              |
| `Teacher/course-details.html` | `/teacher/course-details`      |
| `Teacher/post-reading.html`   | `/teacher/post-reading`        |

---

## 7. Known Issues & Technical Debt

### Script Blocks Were Partially Lost

During a cleanup pass that removed legacy `coryPopup` DOM manipulation code, some
pages lost their legitimate `<script>` blocks for interactive features:

- **Announcements** — compose, filter, search, edit, delete listeners (~326 lines)
- **Calendar** — event creation, month navigation (~349 lines)
- **Messages** — send message, conversation switching (~248 lines)

**To restore:** Compare the `<script>` blocks in the legacy `Teacher/*.html` /
`Student/*.html` files with what's currently in the corresponding `app/*/page.tsx`
files. The script content needs to be re-injected into the `dangerouslySetInnerHTML`
HTML string, but **without** any `coryPopup`, `coryToggle`, `coryBody`, `coryInput`,
`corySend`, or `floatingAi` references — those are handled by the React `CoryChat`
component now.

### CSS Is Inline

All CSS lives inside `dangerouslySetInnerHTML` `<style>` blocks. Ideally these would
be migrated to CSS Modules or a global stylesheet, but this is low priority since the
current approach works and preserves design fidelity.

### Hydration Warnings

A harmless hydration mismatch warning may appear in the console due to browser
extensions (e.g., Grammarly) injecting `data-gr-*` attributes into `<body>`. This
is not a code issue and has zero functional impact.

---

## 8. Golden Rules

> **These rules MUST be followed by any AI assistant or developer working on this codebase.**

### ✅ DO

- Use **React state and props** for the CoryChat component
- Use `sendMessage({ text: '...' })` to submit chat messages
- Use `DefaultChatTransport` to pass extra body data to the API
- Use `toUIMessageStreamResponse()` on the server
- Read message content via `m.parts?.map(p => p.type === 'text' ? p.text : '')`
- Keep inline `<script>` blocks for page-specific DOM interactions (modals, forms, etc.)
- Reference `window.__tankMetrics` for live vitals data

### ❌ DO NOT

- Use `append()` — it does not exist in AI SDK v6
- Use `useChat({ body: {...} })` — `body` is not a valid option on `useChat` in v6
- Use `toDataStreamResponse()` — it was removed in v6
- Add `document.querySelector('.cory-popup')` or similar selectors in inline scripts — the chat is React-managed
- Use `const coryPopup`, `const coryToggle`, `const coryBody`, etc. — these IDs/classes are owned by the React CoryChat component
- Add click listeners that target `.floating-ai` — this button is a React component

---

## 9. Environment Setup

### Prerequisites
- Node.js 18+
- npm

### Getting Started
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Environment Variables
Create `.env.local` in the project root:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

### Building for Production
```bash
npm run build
npm run start
```

---

## 10. File Quick Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout — `<html>`, `<body>` wrapper |
| `app/page.tsx` | Root route — redirects to `/student` |
| `app/api/chat/route.ts` | AI chat API — streams Gemini responses |
| `components/CoryChat.tsx` | Floating AI chat widget — the only React component |
| `public/assets/` | All static images, SVGs, and media |
| `.env.local` | Google AI API key (not committed to git) |
| `Teacher/*.html` | Legacy reference files (not served) |
| `Student/*.html` | Legacy reference files (not served) |
