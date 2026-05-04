'use client';

import React, { useEffect, useState } from 'react';
import CoryChat from '@/components/CoryChat';

const courseTitles: Record<string, string> = {
  '101': 'Introduction to Marine Biology',
  '201': 'Exploring Marine Ecosystems',
  '348': 'Coral Science',
};

const sharedStyles = `
  :root {
    --bg: #faf9f8;
    --text-dark: #2f3333;
    --text-muted: #5b605f;
    --blue: #0075de;
    --card-border: rgba(0, 0, 0, 0.1);
    --divider: rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    --radius-card: 8px;
  }

  * { box-sizing: border-box; }
  html { overflow-y: scroll; scrollbar-gutter: stable; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text-dark);
    font-family: Inter, sans-serif;
  }

  .top-nav {
    position: fixed;
    z-index: 30;
    inset: 0 0 auto 0;
    height: 64px;
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.95);
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

  .brand { width: 239px; height: 36.716px; object-fit: contain; display: block; }
  .nav-links { display: flex; gap: 4px; align-items: stretch; height: 48px; }
  .nav-link {
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
    line-height: 16px;
    border-bottom: 2px solid transparent;
    text-decoration: none;
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
  .switch-icon { width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; flex: none; }
  .page { width: 100%; padding-top: 65px; padding-bottom: 24px; }
  .hero { height: 200px; position: relative; overflow: visible; }
  .hero img.banner { position: absolute; inset: 0; width: 100%; height: 200px; object-fit: cover; object-position: center; display: block; }
  .hero img.banner.overlay { z-index: 1; pointer-events: none; }
  .course-title {
    text-align: center;
    margin: 32px 0 28px;
    font-size: 24px;
    line-height: 20.106px;
    font-weight: 500;
    color: #000;
  }
  .content { width: min(1210px, calc(100% - 68px)); margin: 0 auto; }
  .grid-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 55px 27px; }
  .card {
    height: 416px;
    background: #fff;
    border: 1px solid var(--card-border);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow);
    padding: 25px;
    display: flex;
    flex-direction: column;
  }
  .section-title {
    margin: 0;
    padding-bottom: 32px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--text-muted);
  }
  .lesson-list { flex: 1; display: grid; gap: 12px; }
  .lesson-item {
    display: grid;
    grid-template-columns: 40.67px 1fr;
    gap: 16px;
    align-items: center;
    padding-bottom: 13px;
    border-bottom: 1px solid var(--divider);
  }
  .lesson-icon { width: 40.67px; height: 40.67px; display: block; object-fit: contain; }
  .lesson-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
  .lesson-name {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: var(--text-dark);
    white-space: nowrap;
  }
  .lesson-copy {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 280px;
  }
  .lesson-due {
    font-size: 11px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.53);
    white-space: nowrap;
    margin-left: auto;
  }
  .card-btn {
    margin-top: 24px;
    height: 44px;
    border: none;
    border-radius: 4px;
    color: #f6f7ff;
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
    width: 100%;
  }
  .card-btn:hover,
  .card-btn:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.35);
    filter: brightness(1.05);
  }
  .card-btn:active { transform: translateY(0); }
  .btn-blue { background: #0075de; }
  .btn-orange { background: #ff904c; }
  .btn-purple { background: #a65fff; }
  .btn-green { background: #2ecc71; }
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
    z-index: 40;
    cursor: pointer;
    padding: 0;
  }
  .floating-ai img { width: 100%; height: 100%; display: block; }
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
  .cory-popup[aria-hidden="true"] { display: none; }
  .cory-header { height: 65px; background: #005eb4; position: relative; }
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
  .cory-avatar img { width: 16.807px; height: 25.068px; display: block; }
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
  .cory-bubble.typing { opacity: 0.85; }
  .cory-bubble p {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
    color: #000000;
    font-weight: 400;
    white-space: normal;
  }
  .cory-bubble.user p { color: #ffffff; }
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
  .cory-input::placeholder { color: #6b7280; opacity: 1; }
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
  .cory-send img { width: 14.25px; height: 12px; display: block; }
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
    .top-nav-inner { width: 100%; padding: 0 12px; }
    .content { width: 100%; padding: 0 12px; }
    .grid-two { grid-template-columns: 1fr; gap: 24px; }
    .course-title { font-size: 28px; }
  }
  @media (max-width: 1000px) {
    .menu-toggle { display: flex; }
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
      box-shadow: -10px 0 20px rgba(0,0,0,0.05);
      border-left: 1px solid rgba(0,0,0,0.08);
      gap: 0;
      z-index: 100;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    .nav-links.open { transform: translateX(0); }
    .nav-link { width: 100%; padding: 16px 0; border-bottom: 1px solid var(--divider); height: auto; }
    .nav-link.active { border-bottom-color: var(--blue); }
    .nav-link.switch {
      margin-left: 0;
      width: 100%;
      justify-content: flex-start;
      padding-right: 0;
      margin-top: auto;
      padding-bottom: 32px;
    }
    .menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .menu-toggle.open span:nth-child(2) { opacity: 0; }
    .menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  }
`;

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [courseId, setCourseId] = useState('101');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCourseId(params.get('id') || '101');
  }, []);

  const courseTitle = courseTitles[courseId] || courseTitles['101'];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: sharedStyles }} />
      <header className="top-nav">
        <div className="top-nav-inner">
          <a className="brand-link" href="/teacher" aria-label="Go to teacher home">
            <img className="brand" src="/assets/252d1942-dc4e-47ac-a946-f47357213f7a.svg" alt="Coral Keepers" />
          </a>
          <button className={`menu-toggle${menuOpen ? ' open' : ''}`} aria-label="Toggle menu" onClick={() => setMenuOpen((current) => !current)}>
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
        <section className="hero">
          <img className="banner" src="/assets/teacher-course-hero-base.webp" alt="Coral reef" />
          <img className="banner overlay" src="/assets/teacher-course-hero-overlay.webp" alt="" />
        </section>

        <h1 className="course-title" id="courseTitle">{courseTitle}</h1>

        <section className="content">
          <div className="grid-two">
            <article className="card">
              <h2 className="section-title">Reading</h2>
              <div className="lesson-list">
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-reading.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">Coral 101</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">A basic guide for taking care of coral</p>
                  </div>
                </div>
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-reading.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">How to Identify Coral</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">Tips and tricks to help you identify different...</p>
                  </div>
                </div>
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-reading.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">Coral Anatomy</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">Learn the ins and outs of coral</p>
                  </div>
                </div>
              </div>
              <a className="card-btn btn-blue" href="/teacher/post-reading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                Post New Reading
              </a>
            </article>

            <article className="card">
              <h2 className="section-title">Videos</h2>
              <div className="lesson-list">
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-video-main.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">Is Coral an Animal?</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">Learn the truth about what coral really is</p>
                  </div>
                </div>
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-video-alt.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">What is Coral Bleaching?</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">A basic guide for taking care of coral</p>
                  </div>
                </div>
              </div>
              <button className="card-btn btn-orange">Post New Video</button>
            </article>

            <article className="card">
              <h2 className="section-title">Quizzes</h2>
              <div className="lesson-list">
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-quiz-main.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">Coral 101 QUIZ</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">A quiz on the Coral 101 reading assignment</p>
                  </div>
                </div>
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-quiz-alt.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">How to Identify Coral QUIZ</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">A quiz on the Coral Identification reading...</p>
                  </div>
                </div>
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-quiz-alt.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">What is Coral Bleaching QUIZ</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">A quiz on the Coral Bleaching video</p>
                  </div>
                </div>
              </div>
              <button className="card-btn btn-purple">Post New Quiz</button>
            </article>

            <article className="card">
              <h2 className="section-title">Submissions</h2>
              <div className="lesson-list">
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-submission.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">Why I Care About Coral Essay</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">Write a 5 page essay about why you care about...</p>
                  </div>
                </div>
                <div className="lesson-item">
                  <img className="lesson-icon" src="/assets/teacher-course-icon-submission.svg" alt="" />
                  <div>
                    <div className="lesson-row"><h3 className="lesson-name">Class Participation Submission</h3><span className="lesson-due">Due April 14, 2026 at 9:00 AM</span></div>
                    <p className="lesson-copy">Please submit a reflection about what you...</p>
                  </div>
                </div>
              </div>
              <button className="card-btn btn-green">Post New Assignment</button>
            </article>
          </div>
        </section>
      </main>

      <CoryChat />
    </>
  );
}
