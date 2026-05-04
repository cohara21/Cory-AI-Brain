'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CoryChat from '@/components/CoryChat';

type ReadingRow = {
  title: string;
  icon: string;
  assigned?: boolean;
};

type ReadingSection = {
  title: string;
  rows: ReadingRow[];
};

const courseTitles: Record<string, string> = {
  '101': 'MAR BIO 101 READING',
  '201': 'MAR BIO 201 READING',
  '348': 'MAR BIO 348 READING',
};

const sidebarUnits = [
  { title: 'Unit 1', count: 'Marine Biology Foundations', active: true },
  { title: 'Unit 2', count: 'Coral Reef Systems' },
  { title: 'Unit 3', count: 'Ocean Ecosystems' },
  { title: 'Unit 4', count: 'Marine Species' },
  { title: 'Unit 5', count: 'Conservation' },
  { title: 'Unit 6', count: 'Climate Impact' },
];

const sections: ReadingSection[] = [
  {
    title: 'Overview and History of Marine Biology',
    rows: [
      { title: 'Marine Biology Foundations', icon: '/assets/teacher-course-icon-reading.svg', assigned: true },
      { title: 'Marine Biology Foundations', icon: '/assets/teacher-course-icon-reading.svg', assigned: true },
      { title: 'Ocean Ecosystems and Habitats', icon: '/assets/teacher-course-icon-reading.svg' },
      { title: 'Marine Species Identification', icon: '/assets/teacher-course-icon-reading.svg' },
      { title: 'Coral Reef Conservation', icon: '/assets/teacher-course-icon-reading.svg' },
      { title: 'Marine Food Web Dynamics', icon: '/assets/teacher-course-icon-reading.svg' },
      { title: 'Impact of Climate Change on Oceans', icon: '/assets/teacher-course-icon-reading.svg' },
    ],
  },
  {
    title: 'Introduction to Marine Life',
    rows: [
      { title: 'Marine Sciences', icon: '/assets/teacher-course-icon-reading.svg' },
      { title: 'Coral Reef Ecosystems', icon: '/assets/teacher-course-icon-reading.svg' },
      { title: 'Deep Sea Adaptations', icon: '/assets/teacher-course-icon-reading.svg' },
      { title: 'Marine Conservation Strategies', icon: '/assets/teacher-course-icon-reading.svg' },
    ],
  },
];

const sharedStyles = `
  :root {
    --bg: #faf9f8;
    --text-dark: #2f3333;
    --text-muted: #5b605f;
    --blue: #0075de;
    --green: #2f9e44;
    --blue-bg: #edf6ff;
    --green-bg: #edf8f1;
    --card-border: rgba(0, 0, 0, 0.1);
    --divider: rgba(0, 0, 0, 0.08);
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  * {
    box-sizing: border-box;
  }

  html {
    overflow-y: scroll;
    scrollbar-gutter: stable;
  }

  body {
    margin: 0;
    background: var(--bg);
    color: var(--text-dark);
    font-family: Inter, sans-serif;
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .top-nav {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 30;
    height: 64px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
  }

  .top-nav-inner {
    width: min(1328px, calc(100% - 48px));
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .brand {
    width: 239px;
    height: 36.716px;
    object-fit: contain;
    display: block;
  }

  .nav-links {
    display: flex;
    gap: 4px;
    align-items: stretch;
    height: 48px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
    line-height: 16px;
    border-bottom: 2px solid transparent;
  }

  .nav-link.active {
    color: var(--blue);
    font-weight: 700;
    border-bottom-color: var(--blue);
    padding-bottom: 2px;
  }

  .nav-link.switch {
    gap: 8px;
    margin-left: auto;
    width: 190px;
    justify-content: flex-end;
    padding-right: 16px;
  }

  .switch-icon {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }

  .page {
    width: min(1280px, 100%);
    margin: 0 auto;
    padding: 80px 48px 24px;
  }

  .content-wrap {
    display: grid;
    grid-template-columns: 286px 1fr;
    min-height: 887px;
    width: 100%;
    border: 1px solid var(--card-border);
    border-radius: 8px;
    background: #f4faff;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .sidebar {
    background: #ffffff;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    padding: 38px 16px 20px;
  }

  .sidebar-title {
    margin: 0 0 8px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 700;
  }

  .sidebar-subtitle {
    margin: 0 0 16px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: #000;
  }

  .unit-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 66px;
    padding: 11px 2px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .unit-card.active {
    background: rgba(0, 117, 222, 0.05);
    box-shadow: inset 0 2px 0 var(--blue);
    margin: 0 -2px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .unit-card strong {
    display: block;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: #000;
  }

  .unit-card span {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    line-height: 16px;
    color: var(--text-muted);
  }

  .main {
    padding: 38px 32px 32px;
  }

  .unit-label {
    margin: 0 0 16px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--text-muted);
  }

  .topic-card {
    background: #ffffff;
    border-radius: 6px;
    box-shadow: var(--shadow);
    padding: 16px 16px 6px;
    margin-bottom: 28px;
  }

  .topic-title {
    margin: 0 0 12px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: #393939;
  }

  .topic-row {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 9px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .topic-row:last-child {
    border-bottom: none;
  }

  .topic-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    display: block;
  }

  .topic-name {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .assign-container {
    position: relative;
    align-self: center;
  }

  .topic-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 104px;
    justify-content: center;
    background: var(--blue-bg);
    border: 1px solid #dbe7ff;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 10px;
    line-height: 14px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--blue);
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .topic-action-btn:hover {
    background: #e7f1ff;
    border-color: #b6d2ff;
  }

  .topic-action-btn.assigned {
    min-width: 108px;
    background: var(--green-bg);
    border-color: #b8e4c6;
    color: var(--green);
  }

  .assign-icon {
    width: 12px;
    height: 12px;
    flex: none;
  }

  .assign-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 224px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 12;
    display: none;
    flex-direction: column;
    padding: 4px 0;
  }

  .assign-container:hover .assign-dropdown,
  .assign-container:focus-within .assign-dropdown {
    display: flex;
  }

  .assign-dropdown button {
    background: none;
    border: none;
    text-align: left;
    padding: 10px 16px;
    font-size: 12px;
    color: var(--text-dark);
    cursor: pointer;
    font-family: inherit;
  }

  .assign-dropdown button:hover {
    background: #f4faff;
    color: var(--blue);
  }

  .floating-ai {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 85px;
    height: 85px;
    border-radius: 50%;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    z-index: 40;
    cursor: pointer;
    padding: 0;
  }

  .floating-ai img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .cory-popup {
    position: fixed;
    right: 20px;
    bottom: 108px;
    width: 331px;
    height: 310px;
    background: #ffffff;
    overflow: visible;
    z-index: 45;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  .cory-popup[aria-hidden="true"] {
    display: none;
  }

  .cory-header {
    height: 65px;
    background: #005eb4;
    position: relative;
  }

  .cory-avatar {
    position: absolute;
    left: 16px;
    top: 14px;
    width: 38px;
    height: 38px;
    border: 1.562px solid #0075de;
    border-radius: 23.978px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2.082px 2.082px rgba(0, 0, 0, 0.11);
    padding: 1.562px;
  }

  .cory-avatar img {
    width: 16.807px;
    height: 25.068px;
    display: block;
  }

  .cory-name {
    position: absolute;
    left: 66px;
    top: 25px;
    margin: 0;
    color: #ffffff;
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
  }

  .cory-close {
    position: absolute;
    right: 10px;
    top: 20px;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: #ffffff;
    font-family: Inter, sans-serif;
    font-size: 24px;
    line-height: 1;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    z-index: 2;
  }

  .cory-pointer {
    position: absolute;
    right: 30px;
    bottom: -7px;
    width: 14px;
    height: 14px;
    background: #ffffff;
    transform: rotate(45deg);
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 1;
    pointer-events: none;
  }

  .cory-body {
    position: relative;
    height: 192px;
    background: #ffffff;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }

  .cory-bubble {
    width: fit-content;
    max-width: 254px;
    min-height: auto;
    border-radius: 10px;
    background: #f3f6ff;
    border: 1px solid #dbe7ff;
    display: flex;
    align-items: flex-start;
    padding: 10px 14px;
    align-self: flex-start;
  }

  .cory-bubble.user {
    background: #0075de;
    border-color: #0075de;
    align-self: flex-end;
  }

  .cory-bubble.typing {
    opacity: 0.85;
  }

  .cory-bubble p {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
    color: #000;
    font-weight: 400;
    white-space: normal;
  }

  .cory-bubble.user p {
    color: #ffffff;
  }

  .cory-input-row {
    height: 53px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 13px 12px 12px;
    background: #ffffff;
  }

  .cory-input {
    flex: 1;
    height: 28px;
    border: none;
    border-radius: 2px;
    background: #f3f4f2;
    padding: 8px 12px 9px;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #111827;
    outline: none;
  }

  .cory-input::placeholder {
    color: #6b7280;
    opacity: 1;
  }

  .cory-send {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 2px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    cursor: pointer;
  }

  .cory-send img {
    width: 14.25px;
    height: 12px;
    display: block;
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 40;
  }

  .menu-toggle span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--text-dark);
    border-radius: 2px;
    transition: 0.3s;
  }

  @media (max-width: 1280px) {
    .top-nav-inner {
      width: 100%;
      padding: 0 12px;
    }

    .page {
      width: 100%;
      padding-left: 12px;
      padding-right: 12px;
    }

    .content-wrap {
      grid-template-columns: 1fr;
    }

    .sidebar {
      border-right: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }
  }

  @media (max-width: 1000px) {
    .menu-toggle {
      display: flex;
    }

    .nav-links {
      display: flex;
      position: fixed;
      top: 64px;
      right: 0;
      width: 280px;
      height: calc(100vh - 64px);
      background: #ffffff;
      flex-direction: column;
      padding: 16px 24px;
      box-shadow: -10px 0 20px rgba(0, 0, 0, 0.05);
      border-left: 1px solid rgba(0, 0, 0, 0.08);
      gap: 0;
      z-index: 100;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }

    .nav-links.open {
      transform: translateX(0);
    }

    .nav-link {
      width: 100%;
      padding: 16px 0;
      border-bottom: 1px solid var(--divider);
      height: auto;
    }

    .nav-link.active {
      border-bottom-color: var(--blue);
    }

    .nav-link.switch {
      margin-left: 0;
      width: 100%;
      justify-content: flex-start;
      padding-right: 0;
      margin-top: auto;
      padding-bottom: 32px;
    }

    .menu-toggle.open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .menu-toggle.open span:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle.open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
`;

function ChevronDownIcon() {
  return (
    <svg className="assign-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6.25L8 10.25L12 6.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="assign-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [courseId, setCourseId] = useState('101');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCourseId(params.get('id') || '101');
  }, []);

  const courseTitle = useMemo(() => courseTitles[courseId] || courseTitles['101'], [courseId]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: sharedStyles }} />

      <header className="top-nav">
        <div className="top-nav-inner">
          <a className="brand-link" href="/teacher" aria-label="Go to teacher home">
            <img className="brand" src="/assets/252d1942-dc4e-47ac-a946-f47357213f7a.svg" alt="Coral Keepers" />
          </a>

          <button
            className={`menu-toggle${menuOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((current) => !current);
            }}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav-links${menuOpen ? ' open' : ''}`} aria-label="Primary">
            <a className="nav-link" href="/teacher">Home</a>
            <a className="nav-link active" href="/teacher/course">Courses</a>
            <a className="nav-link" href="/teacher/announcements">Announcements</a>
            <a className="nav-link" href="/teacher/calendar">Calendar</a>
            <a className="nav-link" href="/teacher/messages">Messages</a>
            <a className="nav-link switch" href="/student/">
              <span>Student View</span>
              <span className="switch-icon" aria-hidden="true">
                <img src="/assets/teacher-switch.svg" alt="" width="16" height="16" />
              </span>
            </a>
          </nav>
        </div>
      </header>

      <main className="page">
        <section className="content-wrap">
          <aside className="sidebar">
            <div className="sidebar-title">{courseTitle}</div>
            <div className="sidebar-subtitle">Reading</div>
            {sidebarUnits.map((unit) => (
              <a key={unit.title} className={`unit-card${unit.active ? ' active' : ''}`} href="#">
                <strong>{unit.title}</strong>
                <span>{unit.count}</span>
              </a>
            ))}
          </aside>

          <section className="main">
            <div className="unit-label">UNIT 1: MARINE BIOLOGY FOUNDATIONS</div>

            {sections.map((section) => (
              <div key={section.title} className="topic-card">
                <h2 className="topic-title">{section.title}</h2>
                {section.rows.map((row, index) => (
                  <div key={`${section.title}-${row.title}-${index}`} className="topic-row">
                    <img className="topic-icon" src={row.icon} alt="" />
                    <div>
                      <p className="topic-name">{row.title}</p>
                    </div>
                    {row.assigned ? (
                      <button className="topic-action-btn assigned" type="button">
                        <CheckIcon />
                        Assigned
                      </button>
                    ) : (
                      <div className="assign-container">
                        <button className="topic-action-btn" type="button">
                          Assign
                          <ChevronDownIcon />
                        </button>
                        <div className="assign-dropdown" role="menu" aria-label={`Assign options for ${row.title}`}>
                          <button type="button">Quick Assign</button>
                          <button type="button">Add Due Date...</button>
                          <button type="button">Schedule Visibility...</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </section>
        </section>
      </main>

      <CoryChat />
    </>
  );
}
