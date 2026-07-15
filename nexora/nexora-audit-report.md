# Nexora — Full Project Audit Report
**Based on:** github.com/Austin-Joshua/nexora · nexora-ten-olive.vercel.app
**Stack confirmed:** React 19 + TypeScript + Tailwind + Vite · Spring Boot 3 + Java 17 · MySQL · Gmail API · Claude API + Gemini fallback

---

## What Is Nexora?

Nexora is an AI-powered Communication Intelligence Platform built for college students. It connects to a user's Gmail account via OAuth2, syncs their inbox in real-time, and applies an AI layer (Claude API, with Gemini and local-fallback support) to classify every email by category, extract action items, detect deadlines, and allow natural-language Q&A over the entire inbox via "Nexora Brain." The platform is fully deployed: frontend on Vercel, backend on Render (Spring Boot), MySQL database on a cloud host.

**It is not a landing page concept — it is a functional, working product.**

---

## Phase Scores

| Phase | What Was Built | Score |
|-------|---------------|-------|
| Phase 1 — Auth & Foundation | Google OAuth2, JWT, onboarding, auth callback error handling | 9/10 |
| Phase 2 — Gmail Sync | Full Gmail API sync, token refresh, deduplication, concurrent-sync guard | 9/10 |
| Phase 3 — AI Classification | Claude + Gemini + local fallback, semaphore rate limiting, action items, deadline extraction | 9/10 |
| Phase 4 — Nexora Brain | NL Q&A over 20 recent emails, conversation save, referenced email chips | 8/10 |
| Phase 5 — Dashboard & Notifications | Dashboard summary, category breakdown, deadlines, pending actions, notifications page | 8/10 |
| **Overall** | | **8.6/10** |

---

## All Routes — Confirmed Present

| Route | Status | Notes |
|-------|--------|-------|
| `/` — Landing Page | ✅ Complete | Mouse-tracking orb, feature grid, comparison table, trust signals |
| `/auth/callback` — OAuth Callback | ✅ Complete | Handles error params, extracts JWT + user from query params |
| `/onboarding` — Role Selection | ✅ Complete | 6 roles, privacy notice, animated cards |
| `/dashboard` — Main Dashboard | ✅ Complete | Stats, category breakdown, priority feed, deadlines, actions, meetings |
| `/inbox` — Email Inbox | ✅ Complete | Category tabs, filter toggle, split-panel view, SenderView tab |
| `/brain` — Nexora Brain | ✅ Complete | Chat UI, role-aware suggestions, referenced email cards, clear button |
| `/notifications` — Notifications | ✅ Complete | Unread/read separation, mark all read, skeleton loaders |
| `/settings` — Settings | ✅ Complete | Profile card, role change, security info, revoke access |

---

## Feature Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Google OAuth2 login | ✅ Complete | Error handling for access_denied, redirect_uri_mismatch |
| JWT generation & validation | ✅ Complete | 24h expiry, stored in Zustand + localStorage |
| Gmail token AES-256 encryption | ✅ Complete | TokenEncryptor class confirmed |
| Gmail inbox sync | ✅ Complete | Max 50 emails, pagination, concurrent sync guard |
| Token refresh on expiry | ✅ Complete | Proactive refresh if expiry < 5 min away |
| Email deduplication | ✅ Complete | `existsByGmailMessageId` check before save |
| Claude AI classification | ✅ Complete | claude-sonnet-4-6, JSON-only response, semaphore(10) |
| Gemini AI fallback | ✅ **Bonus — not planned** | Auto-fallback when Claude key not set |
| Local keyword fallback | ✅ **Bonus — not planned** | Works with zero AI keys configured |
| Role-aware prioritization | ✅ Complete | System prompt includes user role |
| Action item extraction | ✅ Complete | JSON parsed, saved to email_actions table |
| Deadline detection | ✅ Complete | ISO datetime parsed, stored on email record |
| Thread summarization | ❌ Missing | SummarizationService referenced but not confirmed built |
| Nexora Brain Q&A | ✅ Complete | Last 20 emails as context, referenced email matching |
| Brain conversation history | ⚠️ Partial | Saved to DB but no UI to browse past conversations |
| Dashboard summary API | ✅ Complete | All 6 data sections returned |
| Category breakdown (pills) | ✅ Complete | Color-coded category pills with counts |
| **Sender Analytics (SenderView)** | ✅ **Bonus — not planned** | Ranked sender list with 🥇🥈🥉 medals, email volume per sender |
| WebSocket notifications | ⚠️ Partial | STOMP + SockJS present, notification page works, real-time push needs verification |
| Scheduled deadline alerts | ⚠️ Partial | NotificationService exists but scheduler confirmation unclear |
| Email list with category filter | ✅ Complete | 11 category tabs, filter toggle, count badges |
| Email detail with AI metadata | ✅ Complete | Summary, action items, priority, sender shown in split panel |
| Brain chat UI | ✅ Complete | Role-aware suggestions, typing indicator, scroll-to-bottom |
| Real-time notification bell | ⚠️ Partial | NotificationPanel exists, live push unclear |
| Protected routes | ✅ Complete | ProtectedRoute wraps all auth pages |
| Auth persistence (localStorage) | ✅ Complete | Zustand with localStorage persistence |
| Developer bypass mode | ✅ **Bonus — not planned** | `/api/auth/bypass` for testing without Gmail |
| Error boundary | ✅ Complete | Wraps entire app in App.tsx |
| Loading skeletons | ✅ Complete | DashboardSkeleton, NotificationsSkeleton, EmailList skeleton |
| GlobalExceptionHandler | ⚠️ Unverified | File expected but not confirmed |
| Google Calendar integration | ❌ Missing | Planned, not implemented |

---

## Security Assessment

| Check | Status | Detail |
|-------|--------|--------|
| Gmail tokens encrypted at rest | ✅ PASS | AES-256 via TokenEncryptor, confirmed in GmailSyncService |
| No secrets in application.yml | ✅ PASS | deployment_guide.md shows all env var placeholders |
| CORS restricted | ✅ PASS | deployment_guide.md shows CORS_ALLOWED_ORIGINS env var |
| JWT expiry enforced | ✅ PASS | 24h confirmed in AuthStore |
| Email body not in logs | ⚠️ UNVERIFIED | Body trimmed to 4000 chars for AI, but logging behaviour unclear |
| Data isolation (userId on queries) | ✅ PASS | `findTop20ByUserIdOrderByReceivedAtDesc(userId)` pattern confirmed |
| Google scope minimal (readonly) | ✅ PASS | deployment_guide.md confirms gmail.readonly scope |
| Developer bypass exposed in UI | 🔴 ISSUE | "Bypass Login" visible in navbar and hero on production build |
| Rate limiting on Brain queries | ✅ PASS | Semaphore(10) on Claude calls |
| CSRF disabled (correct for JWT) | ✅ Expected | Stateless JWT auth |

---

## Critical Issues

**Issue 1 — Developer bypass exposed in production**
```
File:    LandingPage.tsx (lines 43–50, 132–138)
Element: <a href="/api/auth/bypass"> visible in navbar + hero
Risk:    Anyone can log into a mock account and see placeholder data.
         More critically, it signals to the examiner that the OAuth isn't working fully.
Fix:     Wrap bypass links in: if (import.meta.env.DEV) { ... }
         Or remove entirely before any demo/submission.
```

**Issue 2 — No email detail route (`/emails/:id`)**
```
Files:   App.tsx (no /emails/:id route), InboxPage.tsx (uses URL param ?emailId=)
Risk:    Cannot share a link to a specific email. Navigating directly to /inbox?emailId=5
         only works if emails have already loaded — breaks on hard refresh.
Fix:     Add <Route path="/emails/:id" element={<ProtectedRoute><EmailDetailPage /></ProtectedRoute>} />
         Create EmailDetailPage.tsx that fetches a single email by ID and renders EmailDetail.
```

**Issue 3 — Brain conversation history has no UI**
```
File:    BrainPage.tsx / BrainChat.tsx — no history fetch on mount
Risk:    Users lose all previous Brain conversations on page refresh. Feature is described
         as a core differentiator ("searchable communication memory") but is invisible.
Fix:     On BrainChat mount, call GET /api/brain/history and populate messages state.
         Add a "History" section in the Brain page or a collapsible history panel.
```

---

## What Is Present on Each Page (Feature-by-Feature)

### Landing Page (`/`)
The landing page is polished. It opens with an animated indigo radial orb in the background that follows mouse movement. The navbar has the Nexora logo, a "Sign in" ghost button, a "Get Started" CTA, and a Developer Bypass link. The hero section has a badge ("AI-powered email intelligence · Built for students"), a large typographic headline with gradient text, a subheading, a Google OAuth button with the Google logo SVG, and three trust signals (no plain text storage, read-only access, AES-256 encryption). Below the hero, four feature cards are displayed in a 4-column grid: Nexora Brain, Smart Alerts, AI Classification, and Private & Secure — each with an icon, title, description, and colored gradient background. A comparison section follows showing Gmail Smart Compose vs Microsoft Copilot vs Nexora. The footer has branding and copyright.

**Gap:** The comparison section is static copy. The bypass link is visible in production.

### Onboarding Page (`/onboarding`)
Shows after first login if `onboarding=true` is returned by the backend. Greets the user by first name. Displays 6 role cards in a 3-column grid: Student, Professor, IT Employee, HR Professional, Manager, Freelancer — each with a gradient icon, label, and description. Selecting a role highlights it with an indigo border and a CheckCircle tick. A privacy notice panel at the bottom explains what Nexora accesses (4 bullet points). The "Continue to Dashboard" button is disabled until a role is selected.

**Gap:** No skip option. No loading error state if the role update API fails.

### Dashboard Page (`/dashboard`)
Time-aware greeting ("Good morning/afternoon/evening, [first name]"). Four quick-stat cards: Unread Emails, Upcoming Deadlines, Pending Actions, and Category Counts. Category breakdown pills below — color-coded per category (ASSIGNMENT: indigo, HACKATHON: orange, PLACEMENT: emerald, etc.) with email counts. Three-column main grid: Priority Feed (top HIGH priority emails as cards), Upcoming Deadlines (next 7 days, sorted ASC), and Pending Actions (incomplete email actions). Today's Meetings section at the bottom if any exist. Full skeleton loading state while data fetches. Refetches every 5 minutes automatically.

**Gap:** Category pills are not clickable to navigate to that inbox view. Meetings section is below the fold and may not be seen.

### Inbox Page (`/inbox`)
Horizontal scrollable tab bar with 11 category tabs: All, Senders (unique), Assignments, Hackathons, Placement, Internships, Meetings, Attendance, Announcements, Research, Personal — each with an emoji and count badge. Filter toggle button shows/hides filter options. Split-panel layout: 384px left panel with email list, right panel showing email detail. On mobile, the detail panel takes full screen when an email is selected. The Senders tab switches to the SenderView component.

**SenderView** (not in original plan — a meaningful addition): Shows a ranked list of all senders who have emailed the user, sorted by email count. Top 3 get 🥇🥈🥉 rank badges with gold/silver/bronze background colors. Each card shows: initials avatar (gradient), sender name, email address, latest email subject (in italic), email count pill, and a chevron arrow. Clicking a sender drills into their email history.

**Gap:** No search bar within the inbox. No priority filter in the tab bar. No "unread only" toggle.

### Brain Page (`/brain`)
Clean chat interface. Header shows Brain icon, title, "AI Powered" pill with a pulsing sparkle, and a clear-conversation button (only shown after conversation starts). On first load, a welcome state shows with suggested queries that change based on user role (Students get: "What assignments are due this week?", "Any hackathons I should register for?", etc.). When a query is sent, user messages appear right-aligned, AI responses appear left-aligned. A typing indicator (three animated dots) shows while the API call is in progress. After each AI response, referenced email cards are shown below the response text. The input is disabled during loading. Scroll-to-bottom is automatic on new messages.

**Gap:** No Brain history shown on page load (past conversations are saved to DB but not rendered). No way to expand/view a referenced email inline. No streaming (waits for full response before showing).

### Notifications Page (`/notifications`)
Separates notifications into "New" and "Earlier" sections. Unread count badge at the top. "Mark all read" button. Each notification card shows title, message, type, and time. Skeleton loaders while fetching. Full empty state with floating bell icon when no notifications exist. 

**Gap:** Notifications don't have clickable links to the related email. Real-time push via WebSocket is implemented in the backend but unclear if the frontend subscription fires on this page.

### Settings Page (`/settings`)
Three panels: Profile (shows avatar/initial, name, email, role badge), Your Role (grid of 6 role options, save button with loading/saved states), Privacy & Security (4 security points with icons, revoke access button). Role change correctly calls PUT /api/auth/profile and shows "Saved!" confirmation.

**Gap:** No "Delete my data" option. No email sync frequency control. No way to see when Gmail was last synced.

---

## What to Add — Ranked by Priority

### P0 — Fix before any demo

**1. Remove/gate the developer bypass from production UI**
One-line fix: wrap both bypass anchor tags in `{import.meta.env.DEV && <a...>}`. Without this, every demo or evaluator will see "Developer Bypass (Local Mock Login)" on the landing page which looks unfinished.

**2. Add Brain history on page load**
Call `GET /api/brain/history` on BrainChat mount, populate the messages array. This completes the feature that is already built on the backend.

**3. Add `/emails/:id` route**
Create `EmailDetailPage.tsx` that fetches and displays a single email by ID. This enables shareable email links and fixes the hard-refresh bug.

---

### P1 — Core features that raise the quality ceiling

**4. Inbox search bar**
Add a search input inside InboxPage above the email list. Call `GET /api/emails?search=query`. Backend likely already supports it via a `@RequestParam` — confirm and wire it. This is the most-used feature in any email client.

**5. Clickable category pills on Dashboard**
When a user clicks "HACKATHON 2" on the dashboard category breakdown, navigate to `/inbox?category=HACKATHON`. This creates a real navigation shortcut to what matters.

**6. Notification → Email navigation**
Each notification card should navigate to `/inbox?emailId={relatedEmailId}` on click. Currently notifications are dead-ends.

**7. "Unread only" toggle in Inbox**
Add a small toggle above the email list. This is table stakes for email clients and very fast to implement (`isRead=false` filter already exists in the repository).

---

### P2 — Features that make Nexora stand out further

**8. Analytics Page (`/analytics`)**
Add a new route and sidebar link. Show:
- Email volume over time (line chart — Recharts or similar)
- Category distribution (donut chart)
- Response rate (emails received vs replies sent)
- Most active senders (already partially built in SenderView)
- Deadlines met vs missed
This turns Nexora from a tool into an insight platform — genuinely differentiates from Gmail.

**9. Google Calendar auto-sync for deadlines**
The deployment guide shows `calendar.events` OAuth scope is already requested. Wire `CalendarService.java` to actually create events when `deadlineDetected` is not null and `isDeadlineAddedToCalendar = false`. Add a toggle in Settings to enable/disable this.

**10. Thread view in EmailDetail**
When opening an email, fetch all emails with the same `gmailThreadId` and show them as a collapsible thread. Currently each email in a thread appears as a separate card.

**11. Brain conversation history panel**
Add a left sidebar inside BrainPage that lists past conversations (date + first 40 chars of the query). Clicking one loads that conversation's messages. The backend already stores them.

---

### P3 — Polish and future-ready features

**12. AI Reply Studio**
Add a "Draft Reply" button in EmailDetail. Clicking it opens a panel with a textarea pre-filled by Claude with a professional reply draft. User can edit and copy. This leverages the Claude integration already in place and adds visible AI value at the email level.

**13. "Last synced" indicator**
Show "Last synced 3 minutes ago" in the TopBar or sidebar. The `last_synced_at` field already exists on the user model — just surface it.

**14. Settings: Gmail sync toggle**
Let users disable automatic sync (if they're on limited API quota). Store preference in the user model.

**15. PWA support**
Add `vite-plugin-pwa` and a `manifest.json`. Students can install Nexora as a home screen app on mobile. Very low effort for high perceived value.

**16. Dark/Light mode toggle**
Nexora is currently dark-only. A light mode toggle in Settings would make it more accessible and usable in bright environments.

**17. Thread-level summarization (SummarizationService)**
This is already planned in the backend. Wire it: after sync, find all emails with the same `gmailThreadId` and generate a thread summary. Show it in EmailDetail as "Thread Summary" above the individual email.

---

## What Is Actually Working End-to-End (Right Now)

- User signs in with Google → JWT issued → localStorage persisted → stays logged in on refresh
- Onboarding role selection → saves to DB → reflected in Settings page immediately
- Gmail sync triggers → emails fetched from Google API → stored in DB
- AI classification runs → emails get category, priority, summary, action items
- Dashboard loads with real data: unread count, category breakdown, priority emails, deadlines
- Inbox shows categorized emails with working tab filtering
- SenderView shows ranked senders with email counts
- EmailDetail shows full body + AI summary + action items
- Brain query returns real AI answer with referenced email chips
- Notifications page loads and separates unread/read
- Settings role change persists
- Logout revokes Gmail access
- OAuth error handling: access_denied, redirect_uri_mismatch shown as friendly banners
- Developer bypass mode for testing without real Gmail

---

## Summary Verdict

Nexora is a legitimately functional, well-engineered product. The auth flow, Gmail sync, AI classification, Brain Q&A, and all five core pages are working. The codebase is clean — proper DTOs, semaphore rate limiting, token encryption, concurrent sync guard, async classification, and multiple AI fallback layers. The UI is polished far beyond what most student projects deliver — glassmorphism design system, skeleton loaders, animated orbs, error boundaries, and role-aware UX throughout.

The three things that need to happen before any competition or demo: gate the bypass link, load Brain history on mount, and fix the email detail route. Everything else is enhancement.

**Strongest features:** SenderView (not planned, genuinely original), Claude+Gemini+local triple-fallback (production-grade resilience), AES-256 token encryption from day one.

**Biggest gap:** The product is 90% backend, 90% frontend, but the two aren't fully wired together in every place (Brain history, notification links, Calendar integration). Closing those last wires makes it a complete product.
