'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import CoryChat from '@/components/CoryChat';

type AnnouncementStatus = 'posted' | 'scheduled' | 'draft';

type Announcement = {
  id: string;
  title: string;
  body: string;
  status: AnnouncementStatus;
  date: string;
  viewers: string;
};

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Project Guidelines',
    body: 'The rubric for our end of unit coral reef project has been uploaded to the portal.',
    status: 'posted',
    date: '4/15/2026, 9:00 AM',
    viewers: '20/24',
  },
  {
    id: '2',
    title: 'Guest Speaker Tomorrow',
    body: 'A marine biologist will be joining our class tomorrow. Please prepare questions!',
    status: 'posted',
    date: '4/10/2026, 1:15 PM',
    viewers: '20/24',
  },
  {
    id: '3',
    title: 'Extra Credit Opportunity',
    body: 'Hello all, extra credit will be given to those who participate in my extra help...',
    status: 'posted',
    date: '4/6/2026, 3:05 PM',
    viewers: '20/24',
  },
  {
    id: '4',
    title: 'Don\'t forget!',
    body: 'Hello all. Please do not forget about our upcoming quiz this Friday',
    status: 'posted',
    date: '3/12/2026, 10:22 AM',
    viewers: '20/24',
  },
  {
    id: '5',
    title: 'Volunteer Opportunity',
    body: 'Hello students. I hope you had a fun weekend. This week, I am offering extra...',
    status: 'scheduled',
    date: '4/20/2026, 5:00 PM',
    viewers: '0/24',
  },
  {
    id: '6',
    title: 'Science Fair Info',
    body: 'Registration for the regional science fair opens next week. Stay tuned for the link.',
    status: 'scheduled',
    date: '4/25/2026, 8:00 AM',
    viewers: '0/24',
  },
  {
    id: '7',
    title: 'End of Quarter Grades',
    body: 'All grades will be finalized by Friday at 5pm. Please double check your missing work.',
    status: 'draft',
    date: '4/19/2026, 11:30 AM',
    viewers: '0/24',
  },
];

const statusOptions: Array<{ value: 'all' | AnnouncementStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'posted', label: 'Posted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'draft', label: 'Draft' },
];

const sharedStyles = `
  :root {
    --bg: #faf9f8;
    --text-dark: #2f3333;
    --text-muted: #5b605f;
    --blue: #0075de;
    --green: #2f9e44;
    --green-bg: #edf8f1;
    --blue-bg: #edf6ff;
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
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-dark);
    font-family: Inter, sans-serif;
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

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 20px;
  }

  .status-bar {
    display: flex;
    align-items: center;
    gap: 24px;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    margin: 0;
    flex-wrap: wrap;
  }

  .status-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .status-icon {
    width: 19px;
    height: 19px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: none;
  }

  .status-icon .outline {
    width: 19px;
    height: 19px;
    display: block;
  }

  .status-icon.posted .outline {
    display: none;
  }

  .status-icon .fill {
    position: absolute;
    width: 13px;
    height: 13px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: block;
  }

  .status-icon .hand {
    position: absolute;
    width: 5.5px;
    height: 11.18px;
    left: 8px;
    top: 3px;
    display: block;
  }

  .status-item .pencil {
    width: 18px;
    height: 18px;
    display: block;
  }

  .board-tools {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    position: relative;
  }

  .search-bar {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 20px;
    padding: 0 12px;
    height: 36px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  }

  .search-bar:focus-within {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(0, 117, 222, 0.12);
  }

  .search-icon {
    width: 14px;
    height: 14px;
    opacity: 0.6;
  }

  .search-input {
    border: none;
    background: transparent;
    height: 100%;
    padding: 0 8px;
    font-family: Inter, sans-serif;
    font-size: 13px;
    color: var(--text-dark);
    outline: none;
    width: 200px;
  }

  .search-input::placeholder {
    color: #6b7280;
  }

  .tool-btn {
    width: 36px;
    height: 36px;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .tool-btn:hover {
    background: #f8f9f7;
    border-color: rgba(0, 0, 0, 0.1);
  }

  .filter-icon {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }

  .filter-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 52px;
    min-width: 160px;
    background: #ffffff;
    border: 1px solid var(--card-border);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    z-index: 10;
    display: none;
    flex-direction: column;
  }

  .filter-menu.open {
    display: flex;
  }

  .filter-menu button {
    border: none;
    background: #ffffff;
    color: var(--text-dark);
    text-align: left;
    padding: 10px 14px;
    font: inherit;
    cursor: pointer;
  }

  .filter-menu button:hover,
  .filter-menu button.active {
    background: #f4faff;
    color: var(--blue);
  }

  .btn {
    height: 36px;
    padding: 0 14px;
    border-radius: 8px;
    border: 1px solid transparent;
    font-family: Inter, sans-serif;
    font-size: 13px;
    line-height: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .btn.primary {
    background: var(--blue);
    color: #fff;
  }

  .btn.pill {
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 16px;
  }

  .btn.pill .plus {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }

  .board {
    width: 100%;
    min-height: 963px;
    background: #ffffff;
    border: 1px solid var(--card-border);
    border-radius: 8px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .table-header,
  .announcement-row {
    display: grid;
    grid-template-columns: 19px minmax(0, 1fr) 173.69px 64px 40px;
    column-gap: 33px;
    align-items: start;
    padding-left: 24px;
    padding-right: 24px;
  }

  .table-header {
    min-height: 52px;
    padding-top: 24px;
    padding-bottom: 20px;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--text-muted);
    font-weight: 700;
  }

  .announcement-row {
    min-height: 74px;
    border-bottom: 1px solid var(--divider);
    padding-top: 8px;
    padding-bottom: 20px;
  }

  .announcement-row.hidden {
    display: none;
  }

  .announcement-row .status-icon {
    align-self: center;
  }

  .row-title {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: var(--text-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-copy {
    margin: 4px 0 0;
    font-size: 12px;
    line-height: 16px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-col {
    padding-top: 0;
  }

  .status-label {
    display: block;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .status-date {
    display: block;
    margin-top: 4px;
    color: var(--text-dark);
    line-height: 20px;
    font-weight: 400;
    font-size: 14px;
    white-space: nowrap;
  }

  .viewer-col {
    padding-top: 18px;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-dark);
    white-space: nowrap;
  }

  .edit-col {
    padding-top: 18px;
    text-align: right;
  }

  .edit-col a {
    color: var(--blue);
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }

  .compose-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(47, 51, 51, 0.4);
    backdrop-filter: blur(1px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 60;
    padding: 20px;
  }

  .compose-backdrop[aria-hidden="false"] {
    display: flex;
  }

  .compose-modal {
    width: min(620px, calc(100vw - 40px));
    border-radius: 12px;
    background: #ffffff;
    border: 1px solid var(--card-border);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .compose-head {
    padding: 18px 24px;
    border-bottom: 1px solid var(--divider);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .compose-title {
    margin: 0;
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    color: var(--text-dark);
  }

  .compose-close {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid var(--divider);
    background: #fff;
    font-size: 18px;
    line-height: 24px;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0;
  }

  .compose-body {
    padding: 20px 24px 24px;
    display: grid;
    gap: 14px;
  }

  .field-label {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 700;
  }

  .input,
  .textarea,
  .select {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    background: #fff;
    color: var(--text-dark);
    font-family: Inter, sans-serif;
    font-size: 14px;
    line-height: 20px;
    padding: 10px 12px;
    outline: none;
  }

  .select {
    appearance: none;
    -webkit-appearance: none;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235b605f' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center;
    background-size: 10px;
    padding-right: 40px;
  }

  .input:focus,
  .textarea:focus,
  .select:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(0, 117, 222, 0.12);
  }

  .textarea {
    min-height: 110px;
    resize: vertical;
  }

  .compose-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .compose-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 2px;
  }

  .btn.secondary {
    background: #fff;
    color: var(--text-muted);
    border-color: rgba(0, 0, 0, 0.15);
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
      padding-left: 12px;
      padding-right: 12px;
    }

    .table-header,
    .announcement-row {
      grid-template-columns: 19px minmax(0, 1fr) 130px 56px 36px;
      column-gap: 14px;
    }

    .compose-grid {
      grid-template-columns: 1fr;
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

function StatusIcon({ status }: { status: AnnouncementStatus }) {
  if (status === 'draft') {
    return <img className="pencil" src="/assets/teacher-ann-draft-pencil.svg" alt="" aria-hidden="true" />;
  }

  return (
    <span className={`status-icon${status === 'posted' ? ' posted' : ''}`} aria-hidden="true">
      <img className="outline" src="/assets/teacher-ann-circle-outline.svg" alt="" />
      {status === 'posted' ? (
        <img className="fill" src="/assets/teacher-ann-circle-fill.svg" alt="" />
      ) : (
        <img className="hand" src="/assets/teacher-ann-clock-hand-b.svg" alt="" />
      )}
    </span>
  );
}

function formatCounts(announcements: Announcement[]) {
  return announcements.reduce(
    (accumulator, announcement) => {
      accumulator[announcement.status] += 1;
      return accumulator;
    },
    { posted: 0, scheduled: 0, draft: 0 },
  );
}

function formatStatusLabel(status: AnnouncementStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AnnouncementStatus>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const counts = useMemo(() => formatCounts(announcements), [announcements]);

  const visibleAnnouncements = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return announcements.filter((announcement) => {
      const matchesStatus = statusFilter === 'all' || announcement.status === statusFilter;
      const matchesSearch = !query || announcement.title.toLowerCase().includes(query) || announcement.body.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [announcements, searchTerm, statusFilter]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFilterOpen(false);
        setComposerOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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
            <a className="nav-link" href="/teacher/course">Courses</a>
            <a className="nav-link active" href="/teacher/announcements">Announcements</a>
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
        <div className="top-row">
          <div className="status-bar" aria-label="Announcement Status Summary">
            <span className="status-item">
              <StatusIcon status="posted" />
              <span>
                <span>{counts.posted}</span> Posted
              </span>
            </span>
            <span className="status-item">
              <StatusIcon status="scheduled" />
              <span>
                <span>{counts.scheduled}</span> Scheduled
              </span>
            </span>
            <span className="status-item">
              <StatusIcon status="draft" />
              <span>
                <span>{counts.draft}</span> Drafts
              </span>
            </span>
          </div>

          <div className="board-tools" ref={filterRef}>
            <div className="search-bar">
              <img className="search-icon" src="/assets/Search.svg" alt="" />
              <input
                className="search-input"
                type="search"
                placeholder="Search announcements..."
                aria-label="Search announcements"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <button
              className="tool-btn filter-btn"
              type="button"
              aria-label="Filter announcements"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((current) => !current)}
            >
              <svg className="filter-icon" viewBox="0 0 3200 3200" fill="#2f3333" xmlns="http://www.w3.org/2000/svg">
                <path d="M1000,300c-186.3,0 -342.889,127.503 -387.305,300l-312.695,0c-55.2,0 -100,44.8 -100,100c0,55.2 44.8,100 100,100l312.695,0c44.416,172.497 201.005,300 387.305,300c186.3,0 342.889,-127.503 387.305,-300l1512.69,0c55.2,0 100,-44.8 100,-100c0,-55.2 -44.8,-100 -100,-100l-1512.69,0c-44.416,-172.497 -201.005,-300 -387.305,-300Zm0,200c110.4,0 200,89.6 200,200c0,110.4 -89.6,200 -200,200c-110.4,0 -200,-89.6 -200,-200c0,-110.4 89.6,-200 200,-200Zm1200,700c-186.3,0 -342.889,127.503 -387.305,300l-1512.69,0c-55.2,0 -100,44.8 -100,100c0,55.2 44.8,100 100,100l1512.69,0c44.416,172.497 201.005,300 387.305,300c186.3,0 342.889,-127.503 387.305,-300l312.695,0c55.2,0 100,-44.8 100,-100c0,-55.2 -44.8,-100 -100,-100l-312.695,0c-44.416,-172.497 -201.005,-300 -387.305,-300Zm0,200c110.4,0 200,89.6 200,200c0,110.4 -89.6,200 -200,200c-110.4,0 -200,-89.6 -200,-200c0,-110.4 89.6,-200 200,-200Zm-1200,700c-186.3,0 -342.889,127.503 -387.305,300l-312.695,0c-55.2,0 -100,44.8 -100,100c0,55.2 44.8,100 100,100l312.695,0c44.416,172.497 201.005,300 387.305,300c186.3,0 342.889,-127.503 387.305,-300l1512.69,0c55.2,0 100,-44.8 100,-100c0,-55.2 -44.8,-100 -100,-100l-1512.69,0c-44.416,-172.497 -201.005,-300 -387.305,-300Zm0,200c110.4,0 200,89.6 200,200c0,110.4 -89.6,200 -200,200c-110.4,0 -200,-89.6 -200,-200c0,-110.4 89.6,-200 200,-200Z" />
              </svg>
            </button>
            <button className="btn primary pill" type="button" aria-label="Add new announcement" onClick={() => setComposerOpen(true)}>
              <svg className="plus" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1.5V12.5M1.5 7H12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className={`filter-menu${filterOpen ? ' open' : ''}`} role="menu" aria-label="Announcement filters">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={statusFilter === option.value ? 'active' : ''}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setFilterOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="board">
          <div className="table-header">
            <div />
            <div>Announcements</div>
            <div>Status</div>
            <div>Viewers</div>
            <div />
          </div>

          <div id="announcementList">
            {visibleAnnouncements.map((announcement) => (
              <div key={announcement.id} className="announcement-row">
                <StatusIcon status={announcement.status} />
                <div>
                  <p className="row-title">{announcement.title}</p>
                  <p className="row-copy">{announcement.body}</p>
                </div>
                <div className="status-col">
                  <span className="status-label">{formatStatusLabel(announcement.status)}</span>
                  <span className="status-date">{announcement.date}</span>
                </div>
                <div className="viewer-col">{announcement.viewers}</div>
                <div className="edit-col">
                  <a href="#">Edit</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="compose-backdrop" aria-hidden={composerOpen ? 'false' : 'true'}>
        <div className="compose-modal" role="dialog" aria-modal="true" aria-labelledby="composeTitle">
          <div className="compose-head">
            <h2 className="compose-title" id="composeTitle">New Announcement</h2>
            <button className="compose-close" type="button" aria-label="Close composer" onClick={() => setComposerOpen(false)}>
              ×
            </button>
          </div>
          <form
            className="compose-body"
            ref={formRef}
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const title = String(formData.get('title') || '').trim();
              const body = String(formData.get('body') || '').trim();
              const date = String(formData.get('date') || '').trim();
              const status = String(formData.get('status') || 'posted') as AnnouncementStatus;

              if (!title || !body || !date) {
                return;
              }

              const formattedDate = new Date(date);
              const resolvedDate = Number.isNaN(formattedDate.getTime())
                ? date
                : formattedDate.toLocaleString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  });

              const nextAnnouncement: Announcement = {
                id: `${Date.now()}`,
                title,
                body,
                status,
                date: resolvedDate,
                viewers: status === 'posted' ? '20/24' : '0/24',
              };

              setAnnouncements((current) => [nextAnnouncement, ...current]);
              setComposerOpen(false);
              event.currentTarget.reset();
            }}
          >
            <div>
              <label className="field-label" htmlFor="announcementTitle">Title</label>
              <input className="input" id="announcementTitle" name="title" type="text" maxLength={80} required placeholder="Enter announcement title" />
            </div>

            <div>
              <label className="field-label" htmlFor="announcementBody">Announcement</label>
              <textarea className="textarea" id="announcementBody" name="body" maxLength={280} required placeholder="Type your announcement message" />
            </div>

            <div className="compose-grid">
              <div>
                <label className="field-label" htmlFor="announcementDate">Date</label>
                <input className="input" id="announcementDate" name="date" type="datetime-local" required />
              </div>
              <div>
                <label className="field-label" htmlFor="announcementStatus">Status</label>
                <select className="select" id="announcementStatus" name="status" required defaultValue="posted">
                  <option value="posted">Posted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="compose-actions">
              <button className="btn secondary" type="button" onClick={() => setComposerOpen(false)}>
                Cancel
              </button>
              <button className="btn primary" type="submit">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      <CoryChat />
    </>
  );
}
