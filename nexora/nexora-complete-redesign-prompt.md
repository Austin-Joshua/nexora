# Nexora — Complete Redesign + All Fixes
### Single master Cursor prompt — paste this in full before starting

---

## What You Are Working On

You are continuing development on **Nexora**, a deployed full-stack AI email intelligence platform.

- **Repo:** github.com/Austin-Joshua/nexora
- **Live site:** nexora-ten-olive.vercel.app
- **Stack:** React 19 + TypeScript + Tailwind + Vite (frontend) · Spring Boot 3.2.5 + Java 17 (backend) · MySQL · Gmail API · Claude API (claude-sonnet-4-6) + Gemini fallback
- **Frontend:** `nexora/frontend/`
- **Backend:** `nexora/backend/`

The platform already has 10 working routes, Gmail sync, AI classification, Nexora Brain Q&A, SenderView, Analytics page with Recharts, WebSocket notifications, dark/light theme, and "last synced" indicator. This prompt covers three things: **a full UI redesign**, **all critical bug and security fixes**, and **new features to implement**.

Work through the phases in order. Do not mix phases. After each phase, verify before continuing.

---

## PHASE A — Full UI Redesign

### A.1 — New Design System

Replace the current glassmorphism / indigo-violet / floating orbs system entirely. Apply this design system across every page.

**Color tokens — replace all current color usages with these:**

```css
/* in index.css or a new tokens.css, define as CSS variables */
:root {
  --bg:       #080c12;   /* deepest background */
  --s1:       #0f1720;   /* card surface */
  --s2:       #162030;   /* elevated card / hover */
  --border:   #1d2d3f;   /* default border */
  --border-b: #253447;   /* bright / active border */
  --gold:     #f0c030;   /* PRIMARY accent — used sparingly */
  --gold-d:   rgba(240,192,48,0.10);  /* gold tinted background */
  --blue:     #4f9eff;   /* interactive / links */
  --blue-d:   rgba(79,158,255,0.10);
  --t1:       #e2ecf5;   /* primary text */
  --t2:       #7890a8;   /* secondary text */
  --t3:       #3d5570;   /* muted text */
  --high:     #f05050;   /* high priority */
  --med:      #f0c030;   /* medium priority (same as gold) */
  --low:      #40c070;   /* low priority */
}
```

**Category color system:**
```ts
export const CAT_COLORS: Record<string, { label: string; color: string }> = {
  ASSIGNMENT:   { label: 'ASGN',  color: '#818cf8' },
  HACKATHON:    { label: 'HACK',  color: '#f97316' },
  PLACEMENT:    { label: 'PLACE', color: '#22c55e' },
  MEETING:      { label: 'MTG',   color: '#c084fc' },
  ATTENDANCE:   { label: 'ATTN',  color: '#ef4444' },
  ANNOUNCEMENT: { label: 'ANN',   color: '#fbbf24' },
  PROMOTIONAL:  { label: 'PROMO', color: '#475569' },
  UNCATEGORIZED:{ label: 'MISC',  color: '#3d5570' },
};
```

**Typography rules:**
- All numbers and data values: `font-variant-numeric: tabular-nums`
- Section labels: `font-size: 9px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; font-family: monospace; color: var(--t3)`
- Category tags: `font-size: 9px; font-weight: 700; letter-spacing: 0.10em; font-family: monospace`
- No blur (`backdrop-filter`) anywhere — remove all occurrences

---

### A.2 — Shared Components to Create/Replace

**`PriorityBars.tsx`** — the signature component of this redesign:
```tsx
// 3 vertical bars like a cell signal indicator
// Heights: 4px, 7px, 10px
// HIGH: 3 bars filled red (#f05050)
// MEDIUM: 2 bars filled gold (#f0c030)
// LOW: 1 bar filled green (#40c070)
// Unfilled bars use var(--border)
export const PriorityBars = ({ priority }: { priority: 'HIGH' | 'MEDIUM' | 'LOW' }) => {
  const filled = priority === 'HIGH' ? 3 : priority === 'MEDIUM' ? 2 : 1;
  const color  = priority === 'HIGH' ? '#f05050' : priority === 'MEDIUM' ? '#f0c030' : '#40c070';
  return (
    <div className="flex items-end gap-[2px]">
      {[4, 7, 10].map((h, i) => (
        <div key={i} style={{ width: 3, height: h, background: i < filled ? color : 'var(--border)', borderRadius: 1 }} />
      ))}
    </div>
  );
};
```

**`CategoryTag.tsx`** — terminal-style monospace tag:
```tsx
export const CategoryTag = ({ category }: { category: string }) => {
  const cfg = CAT_COLORS[category] ?? { label: category.slice(0, 4), color: '#3d5570' };
  return (
    <span style={{
      background: cfg.color + '18',
      color: cfg.color,
      border: `1px solid ${cfg.color}28`,
      padding: '1px 5px',
      borderRadius: 3,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.10em',
      fontFamily: 'monospace',
    }}>
      {cfg.label}
    </span>
  );
};
```

**`StatCard.tsx`** — card with a colored top border:
```tsx
// Props: label, value, sub, accentColor, icon
// border-top: 2px solid accentColor (only the top border gets the accent)
// background: var(--s1), border: 1px solid var(--border), border-radius: 9px
// value: font-size 26px, font-weight 800, font-variant-numeric: tabular-nums
// label: section-label style (monospace, uppercase, 9px)
```

---

### A.3 — Sidebar Redesign

Replace the current sidebar with a **52px-wide icon-only sidebar**:

```tsx
// File: src/components/layout/Sidebar.tsx
// - Width: 52px (never expands)
// - Background: #060a0f (darker than main bg)
// - Border-right: 1px solid var(--border)
// - Logo: 34x34px gold square (#f0c030) with Zap icon in #080c12
// - Nav buttons: 38x38px, border-radius 8px
//   - Default: background transparent, icon color #3d5570
//   - Hover: background #1a2535
//   - Active: background rgba(240,192,48,0.13), border 1px solid rgba(240,192,48,0.22), icon color #f0c030
// - Tooltip: show page name on hover (use title attribute or a CSS tooltip)
// - Logout/back button pinned to bottom of sidebar
// Nav order: Dashboard, Inbox, Brain, Analytics, Notifications, Settings
```

---

### A.4 — TopBar Redesign

```tsx
// File: src/components/layout/TopBar.tsx
// Height: 48px, background: #060a0f, border-bottom: 1px solid var(--border)
// Left: page title (14px, 600 weight, --t1) + page subtitle (11px, --t3)
// Right cluster (gap 10px):
//   1. Expandable search bar (36px wide at rest, 160px on focus)
//      - background: #0f1720, border: 1px solid var(--border)
//      - border-radius: 7px, icon: magnifying glass in --t3
//   2. Sync status badge: green pill "✓ Synced Xm ago" in monospace
//      - background: rgba(64,192,112,0.10), border: rgba(64,192,112,0.20)
//      - color: #40c070, font-size: 9px
//      - Shows "Syncing..." with spinner when isSyncing
//   3. Theme toggle: Sun/Moon icon, toggles .light class on documentElement
//   4. Bell icon with red dot badge for unread count
//      - Opens NotificationPanel dropdown on click (absolute positioned, z-index 50)
```

---

### A.5 — Landing Page Redesign

```tsx
// File: src/pages/LandingPage.tsx
// Full redesign — remove: floating orbs, backdrop-filter blur, indigo gradients, developer bypass links (see Phase B.4)

// Layout: 2-column grid (50/50) centered vertically, min-height 100vh
// Background: #080c12 with subtle dot-grid pattern:
//   background-image: radial-gradient(circle, #1a2535 1px, transparent 1px);
//   background-size: 28px 28px;

// LEFT COLUMN:
//   - Eyebrow: "AI · EMAIL · INTELLIGENCE" — 9px monospace, gold, uppercase, letter-spacing 0.20em
//   - H1 (3 lines): "Stop reading" + "the noise." + gold-colored "Act on what matters."
//     - 36px, 800 weight, -0.03em letter-spacing, --t1
//     - The gold line uses color: #f0c030
//   - Body text: "Nexora reads every email in your Gmail inbox, classifies it with AI,
//     and surfaces only what needs your attention — deadlines, placements, hackathons, attendance."
//     - 13px, --t2, line-height 1.7, max-width 300px
//   - CTA button: "Connect Gmail" with Google SVG icon
//     - background: #f0c030, color: #080c12, 800 weight, border-radius 8px, padding 11px 22px
//     - No border. Hover: lighten to #f5d050
//   - Trust signals (3 rows, each with green checkCircle icon):
//     - "Read-only Gmail access"
//     - "AES-256 token encryption"  
//     - "Role-aware AI · Student-first"
//     - Text: 11px, --t3, icon: #40c070

// RIGHT COLUMN — Inbox preview card (the signature element):
//   - Card: background #0f1720, border: 1px solid var(--border), border-radius 10px
//   - Header: pulsing gold dot + "nexora.ai" + "73 emails · 4 need action" (gold "4")
//   - 4 email preview rows, each with:
//     - border-left: 3px solid (high priority color for first 3, gold for 4th)
//     - sender name (80px min-width, 11px, bold, --t1)
//     - subject (flex 1, 11px, --t2, truncated)
//     - CategoryTag
//     - PriorityBars
//   - Footer: "--filter--" line in --t3 monospace: "69 promotional & low-priority emails hidden"
```

---

### A.6 — Onboarding Page Redesign

```tsx
// File: src/pages/OnboardingPage.tsx
// Background: #080c12
// Same 2-column layout as landing but centered
// Greeting: "Welcome, [firstName]" — gold accent on first name
// Subtitle: "Choose your role — this shapes how Nexora prioritizes your emails"
// 6 role cards in 3x2 grid:
//   - Default: background #0f1720, border 1px solid var(--border), border-radius 9px
//   - Selected: border-color #f0c030, background rgba(240,192,48,0.05)
//   - Each card: small monospace icon label + role name (13px, 600) + 1-line description (10px, --t3)
// Privacy notice: background #0b1018, border-left 3px solid #4f9eff, 4 bullet points
// CTA: gold button "Continue to Dashboard →" — disabled until role selected
```

---

### A.7 — Dashboard Page Redesign

```tsx
// File: src/pages/DashboardPage.tsx
// No page-level padding on the outer wrapper — let content breathe with internal padding (14px)

// ROW 1 — 4 StatCards in a grid:
//   - Unread: accentColor #f05050, icon: Mail
//   - Deadlines: accentColor #f0c030, icon: Clock
//   - Pending Actions: accentColor #4f9eff, icon: ListCheck
//   - Categories: accentColor #40c070, icon: Tag

// ROW 2 — Category pill row (scrollable horizontally):
//   Each pill: background category.color + '10', border category.color + '20'
//   color: category.color, text: monospace, font-size 10px, font-weight 700
//   CLICKABLE: onClick navigate to /inbox?category=CATEGORY_NAME
//   Show count next to each label

// ROW 3 — 3-column bento grid:
//   Column 1 (flex 1.4): Priority Feed
//     - Section label: "Priority feed"
//     - 3 email cards, each with:
//       - border-left: 3px solid #f05050 (high priority)
//       - sender initial avatar (28x28, category color background, 5px radius)
//       - sender name + subject (truncated)
//       - CategoryTag + PriorityBars on the right
//       - Hover: background shifts to #0f1720
//       - onClick: navigate to /emails/:id
//   Column 2 (flex 1): Upcoming Deadlines
//     - DeadlineCard per item: subject truncated + CategoryTag + deadline date in gold monospace
//   Column 3 (flex 1): Pending Actions
//     - ActionRow per item: colored dot (category color) + action description + deadline in gold
//     - Checkbox to mark complete (calls PATCH /api/email-actions/:id/complete)

// Loading state: 4 skeleton rects top + 1 wide bar + 3 tall skeleton blocks
// Auto-refetch: staleTime: 300_000 (5 minutes)
```

---

### A.8 — Inbox Page Redesign

```tsx
// File: src/pages/InboxPage.tsx

// TAB BAR (horizontal scroll, gap 4px, padding 8px 12px):
//   Tabs: All · Senders · Assignments · Hackathons · Placement · Attendance · Meetings · Announcements · Research · Personal
//   Active tab: background rgba(240,192,48,0.15), border 1px solid rgba(240,192,48,0.30), color #f0c030
//   Inactive: color --t3, hover: color --t2
//   Each tab shows count badge

// SPLIT PANEL LAYOUT:
//   - List panel: 280px when detail open, 100% when closed
//   - Detail panel: flex: 1, background #080c12 (slightly darker than list)
//   - Divider: 1px solid var(--border) between panels

// EMAIL LIST ROWS (EmailRow component):
//   Height: ~48px per row
//   Structure: 3px left border (priority color) + avatar (28x28, 6px radius) + sender/subject + CategoryTag + time + PriorityBars
//   Unread state: background #0b1219, subject font-weight 600, color --t1
//   Read state: background transparent, subject color --t2
//   HIGH priority: left border #f05050
//   MEDIUM priority: left border #f0c030
//   LOW priority: left border var(--border) (subtle, almost invisible)
//   Selected: background #0f1720
//   Hover: background #0f1720
//   Count label above list: "N email(s)" — 10px monospace --t3

// EMAIL DETAIL PANEL (right side):
//   - From: avatar + name (13px 600 --t1) + email address (11px --t3)
//   - Subject: 14px 700 --t1 + CategoryTag + PriorityBars in same row
//   - Timestamp: 11px monospace --t3 with "· read-only view"
//   - Body: background #0b1018, border var(--border), border-radius 7px, padding 11px 12px, 12px --t2 line-height 1.7
//   - AI Summary block: background #0f1720, border-left 3px solid #f0c030, border-radius 7px
//     Label: "AI SUMMARY" in gold monospace 9px uppercase
//     Text: 12px #9bb0c4 line-height 1.6
//   - Action items: chips — background rgba(79,158,255,0.08), border rgba(79,158,255,0.20), color #4f9eff
//     Each chip: type icon + description + deadline in gold
//     Include checkbox to mark complete
//   - "Ask Brain" button: teal/blue outlined, navigates to /brain with pre-filled context

// SENDER VIEW (when "Senders" tab active — keep existing SenderView.tsx, restyle):
//   - Ranked list sorted by email count DESC
//   - Top 3: 🥇🥈🥉 medal badges with gold/silver/bronze backgrounds
//   - Each row: rank badge + avatar + name + email + latest subject (italic) + count pill + chevron
//   - Click: drill into that sender's emails via /api/emails/sender/:email
```

---

### A.9 — Brain Page Redesign

```tsx
// File: src/pages/BrainPage.tsx + src/components/brain/BrainChat.tsx

// HEADER BAR (inside brain page, below TopBar):
//   - Brain icon container: 34x34, background rgba(79,158,255,0.10), border rgba(79,158,255,0.20), blue icon
//   - Title: "Nexora Brain" + subtitle: "Natural language Q&A over your entire inbox"
//   - "AI POWERED" badge: blue monospace pill, pulsing animation
//   - Clear button (only visible when messages exist): outlined, --t3 color

// WELCOME STATE (empty messages):
//   - Centered: brain icon (52x52 tinted blue square) + title + subtitle
//   - Suggested queries as pills: background #0f1720, border var(--border), color --t2
//   - Hover: border rgba(240,192,48,0.40), color #f0c030, background rgba(240,192,48,0.05)
//   - Role-aware queries for STUDENT:
//     "What assignments are due this week?"
//     "Any hackathons I should register for?"
//     "What's my attendance status?"
//     "Any placement opportunities?"
//     "Summarize today's important emails"

// MESSAGES:
//   - User bubble: right-aligned, background rgba(79,158,255,0.10), border rgba(79,158,255,0.18)
//     color #c8dffa, border-radius: 10px 10px 3px 10px
//   - AI bubble: left-aligned, background #0f1720, border var(--border)
//     color --t1, border-radius: 10px 10px 10px 3px
//   - Typing indicator: 3 animated dots (tdot animation) inside an AI bubble
//   - Referenced email chips below AI response:
//     background rgba(240,192,48,0.08), border rgba(240,192,48,0.22), color #f0c030
//     Clickable: onClick navigate to /emails/:id

// LOAD HISTORY ON MOUNT (critical fix — see Phase B.1):
//   useEffect → GET /api/brain/history → populate messages array

// INPUT BAR (pinned to bottom, border-top var(--border)):
//   - Input: background #0f1720, border var(--border), border-radius 8px, focus: border #4f9eff60
//   - Send button: 36x36, background #4f9eff, blue icon, disabled when input empty
//   - Keyboard: Enter sends, Shift+Enter newline
```

---

### A.10 — Analytics Page Redesign

```tsx
// File: src/pages/AnalyticsPage.tsx
// Keep existing Recharts integration, restyle to match new design system

// 4 StatCards top row (grid 2x2 or 1x4):
//   Total, Unread, Unique Senders, Categories — each with different accentColor

// Category Distribution (horizontal bar chart — CSS-based OR Recharts):
//   - Each bar: category name (monospace link → navigate to inbox), progress bar (full width), count
//   - Bar fill: linear-gradient from category.color to lighter shade
//   - Category name is CLICKABLE → navigate to /inbox?category=X

// Email Volume (line chart — Recharts LineChart):
//   - Last 7 days
//   - FIX: change from emailApi.getEmails({size:50}) to calling GET /api/analytics/volume?days=7
//     This endpoint counts emails by receivedAt date in DB — accurate for large inboxes
//   - Line color: #f0c030 (gold), dot fill: #f0c030

// Priority Breakdown (bar chart — Recharts BarChart):
//   - HIGH: #f05050, MEDIUM: #f0c030, LOW: #40c070
//   - Highest bar gets a gold label above it

// Top Senders:
//   - Keep medal system (🥇🥈🥉 for top 3)
//   - Progress bars: background var(--border), fill: #f0c030 gradient
//   - "View all →" button navigates to /inbox (Senders tab)

// Charts use dark theme: CartesianGrid stroke=#1d2d3f, axis tick color=#3d5570
// Tooltip: background #0f1720, border var(--border), text --t1
```

---

### A.11 — Notifications Page Redesign

```tsx
// File: src/pages/NotificationsPage.tsx

// Sections: "New (N)" and "Earlier" separated by a divider
// "Mark all read" button top-right
// Each NotificationItem card:
//   - Unread: background #0f1720, border 1px solid var(--border)
//   - Read: background transparent, border 1px solid #131c28
//   - Icon container (32x32, border-radius 7px): type-specific background tint
//     DEADLINE: gold icon, gold tint
//     IMPORTANT: red icon, red tint
//     ACTION: blue icon, blue tint
//   - Title: 12px, 600 weight (unread) or 500 (read), --t1
//   - Message: 11px --t2
//   - Time: 10px monospace --t3
//   - Unread indicator: 7px gold dot on the right
//   - CLICKABLE (see Phase B.2): navigate to /emails/:relatedEmailId
// Empty state: centered bell icon + "All caught up" + role-aware subtext
// Skeleton: 5 placeholder rows while loading
```

---

### A.12 — Settings Page Redesign

```tsx
// File: src/pages/SettingsPage.tsx
// 3 panels, max-width 500px, centered, gap 10px

// Panel 1 — Profile:
//   - 44x44 avatar: gold background (#f0c030) with user initials in #080c12
//   - Name (14px 600 --t1), email (12px --t3)
//   - Role badge: gold pill (monospace, uppercase)

// Panel 2 — Your Role:
//   - 6 role buttons in 3x2 grid
//   - Selected: border #f0c030, gold label, background rgba(240,192,48,0.05)
//   - Unselected: border var(--border), hover: border rgba(240,192,48,0.20)
//   - "Save role" gold button (shows "Saved ✓" for 3s after save)
//   ADD: "Last synced: X minutes ago" line using user.lastSyncedAt field

// Panel 3 — Privacy & Security:
//   - 4 security points with green icon containers
//   - Revoke button: red text, no background, left-aligned, with logout icon
```

---

## PHASE B — Critical Bug & Security Fixes

Work through each fix completely before moving to the next. Do not refactor unrelated code.

---

### B.1 — CRITICAL: Brain history not loaded on mount

```
File: nexora/frontend/src/components/brain/BrainChat.tsx
Problem: GET /api/brain/history is never called. Every page refresh wipes
         conversation history. The backend saves and cleans up conversations
         but BrainChat ignores them entirely.

Fix: Add this useEffect to BrainChat:

const { data: history } = useQuery({
  queryKey: ['brain-history'],
  queryFn: brainApi.getHistory,
  staleTime: 60_000,
});

useEffect(() => {
  if (history?.length && messages.length === 0) {
    const historical = history.flatMap(conv => [
      { type: 'user' as const, text: conv.userQuery, id: conv.id + '_q' },
      { type: 'ai' as const, text: conv.aiResponse,
        refs: conv.referencedEmailIds?.map((id: number) => ({ id })) ?? [],
        id: conv.id + '_a' }
    ]);
    setMessages(historical);
    setHasStarted(true);
  }
}, [history]);

Also add brainApi.getHistory():
  GET /api/brain/history → BrainConversationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0,20))
  Returns: { id, userQuery, aiResponse, referencedEmailIds, createdAt }[]
```

---

### B.2 — CRITICAL: Notifications don't navigate to related email

```
File: nexora/frontend/src/components/notifications/NotificationItem.tsx
                                  (or wherever NotificationItem renders)
Problem: Every notification has a relatedEmailId field set by NotificationService.java.
         Clicking a notification does nothing — it is a dead end.

Fix: Wrap each notification item in a clickable element:

const navigate = useNavigate();

const handleClick = () => {
  if (notification.relatedEmailId) {
    navigate(`/emails/${notification.relatedEmailId}`);
    // if notification panel is open, close it
    closePanel?.();
  }
};

Also add cursor: pointer and a right-arrow chevron icon on each clickable notification.
```

---

### B.3 — SECURITY CRITICAL: Fixed IV in AES encryption

```
File: nexora/backend/src/main/java/com/nexora/security/TokenEncryptor.java
Problem: private static final String IV = "nexora1234567890";
         Static IV in AES-CBC means identical plaintexts produce identical ciphertexts.
         This weakens the encryption and violates AES-CBC security requirements.

Fix — replace the entire encrypt/decrypt implementation:

public String encrypt(String value) throws Exception {
    byte[] iv = new byte[16];
    new SecureRandom().nextBytes(iv);
    IvParameterSpec ivSpec = new IvParameterSpec(iv);
    
    SecretKeySpec keySpec = new SecretKeySpec(encryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
    cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
    
    byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
    
    // Prepend IV to ciphertext: Base64(iv + encrypted)
    byte[] combined = new byte[iv.length + encrypted.length];
    System.arraycopy(iv, 0, combined, 0, iv.length);
    System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);
    
    return Base64.getEncoder().encodeToString(combined);
}

public String decrypt(String encrypted) throws Exception {
    byte[] combined = Base64.getDecoder().decode(encrypted);
    
    // Extract IV from first 16 bytes
    byte[] iv = new byte[16];
    byte[] ciphertext = new byte[combined.length - 16];
    System.arraycopy(combined, 0, iv, 0, 16);
    System.arraycopy(combined, 16, ciphertext, 0, ciphertext.length);
    
    IvParameterSpec ivSpec = new IvParameterSpec(iv);
    SecretKeySpec keySpec = new SecretKeySpec(encryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
    cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
    
    return new String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8);
}

IMPORTANT: After this change, all existing encrypted tokens in the DB are unreadable
with the new format. Run a migration: for each user, clear gmail_access_token and
gmail_refresh_token (set to null), set a re_auth_required flag, redirect users to
reconnect Gmail on next login.
```

---

### B.4 — SECURITY: Remove hardcoded secret fallbacks

```
File: nexora/backend/src/main/resources/application.yml
Problem: jwt.secret and app.encryption-key both have fallback default values.
         If env vars are missing on Render, the app starts with publicly-known secrets.

Fix: Remove ALL defaults — use bare env var references:

jwt:
  secret: ${JWT_SECRET}          # no colon-default
  expiration-ms: 86400000

app:
  encryption-key: ${ENCRYPTION_KEY}   # no colon-default
  cors-allowed-origins: ${CORS_ALLOWED_ORIGINS}

Spring Boot will refuse to start if these env vars are missing.
This is the CORRECT behavior — a missing secret should crash the app, not silently use a weak default.

Also verify Render/Railway has these env vars set:
  JWT_SECRET         (min 64 random characters)
  ENCRYPTION_KEY     (exactly 16, 24, or 32 characters for AES)
  CORS_ALLOWED_ORIGINS  (https://nexora-ten-olive.vercel.app)
```

---

### B.5 — SECURITY: H2 console exposed in SecurityConfig

```
File: nexora/backend/src/main/java/com/nexora/config/SecurityConfig.java
Problem: .requestMatchers("/h2-console/**").permitAll()
         If H2_CONSOLE_ENABLED=true is ever set on the server, the full H2 database
         console is publicly accessible with no authentication.

Fix: Delete these lines entirely:
  - .requestMatchers("/h2-console/**").permitAll()
  - .headers(h -> h.frameOptions(fo -> fo.disable()))  // only needed for H2 console

If you need H2 console in local development only, add a @Profile("dev") condition
or handle it in a separate DevSecurityConfig.
```

---

### B.6 — SECURITY: Gate developer bypass in production

```
File: nexora/frontend/src/pages/LandingPage.tsx
Problem: Two bypass links visible in production:
         1. Navbar bypass link
         2. Hero section bypass link

Fix: Wrap BOTH with environment check:

// Instead of:
<a href={`${API_BASE_URL}/api/auth/bypass`}>Developer Bypass</a>

// Use:
{import.meta.env.DEV && (
  <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/bypass`}>
    🔧 Dev bypass
  </a>
)}

This renders only during `npm run dev`, never in the Vercel production build.
Also remove the bypass link from the hero section (second occurrence).
```

---

### B.7 — SECURITY: Restrict WebSocket CORS

```
File: nexora/backend/src/main/java/com/nexora/config/WebSocketConfig.java
Problem: .setAllowedOriginPatterns("*")  — accepts WebSocket connections from any origin.

Fix:
.setAllowedOriginPatterns(
    "https://nexora-ten-olive.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
)

Or read from the same CORS_ALLOWED_ORIGINS env var:
@Value("${app.cors-allowed-origins}")
private String[] allowedOrigins;
// then: .setAllowedOriginPatterns(allowedOrigins)
```

---

## PHASE C — New Features

Implement these in order. Each has a specific file path and implementation detail.

---

### C.1 — Action Item Completion Toggle

```
Problem: email_actions.is_completed exists in DB but there is no way to mark
         actions as complete in the UI. The Pending Actions list on Dashboard
         never clears.

Backend — add endpoint:
  PATCH /api/email-actions/{id}/complete
  → sets is_completed = true, returns 204
  → in EmailActionRepository: findByUserIdAndIsCompletedFalse() already exists

Frontend:
  In Dashboard PendingActions section and EmailDetail action chips:
  Add a checkbox (or small "✓ Done" button) per action item
  On click: call PATCH /api/email-actions/:id/complete
  Optimistically remove item from list (or fade + strikethrough)
  Invalidate ['dashboard'] query after success

  Style: checkbox uses border: 1px solid var(--border), checked: background #40c070
```

---

### C.2 — Wire Google Calendar Integration

```
Problem: google-api-services-calendar is in pom.xml. The calendar.events OAuth
         scope is already requested. emails.is_deadline_added_to_calendar exists
         in the DB but is always false. No CalendarService.java exists.

Create: nexora/backend/src/main/java/com/nexora/service/CalendarService.java

public class CalendarService {
  @Value("${google.client-id}") private String clientId;
  @Value("${google.client-secret}") private String clientSecret;

  public void createDeadlineEvent(User user, Email email) {
    if (email.getDeadlineDetected() == null) return;
    if (Boolean.TRUE.equals(email.getIsDeadlineAddedToCalendar())) return;

    // 1. Build Google credential from user's stored tokens (decrypt first)
    // 2. Build Calendar event:
    //    title: email.getSubject() or email.getAiActionItems() description
    //    start/end: email.getDeadlineDetected() (use full-day event if time is midnight)
    //    description: "Detected by Nexora Brain from email by " + email.getSenderName()
    // 3. Insert event via Calendar API: calendar.events().insert("primary", event).execute()
    // 4. Set email.setIsDeadlineAddedToCalendar(true) and save

    // Error: if Calendar API returns 401, log warning and skip (don't crash sync)
  }
}

Call site: EmailClassificationService.java — after setting deadlineDetected,
  if deadline is not null: calendarService.createDeadlineEvent(user, email)

Settings: Add toggle in SettingsPage — "Auto-add deadlines to Google Calendar"
  Store preference on User entity: calendarSyncEnabled (boolean, default true)
  Only call calendarService if user.isCalendarSyncEnabled()
```

---

### C.3 — Analytics Volume Chart Fix

```
Problem: AnalyticsPage fetches emailApi.getEmails({size:50}) to build the volume
         chart. This only shows the 50 most recent emails, making the chart wrong
         for users with large inboxes.

Backend — add endpoint:
  GET /api/analytics/volume?days=7
  → Query: SELECT DATE(received_at) as date, COUNT(*) as count
           FROM emails WHERE user_id = ? AND received_at >= NOW() - INTERVAL ? DAY
           GROUP BY DATE(received_at) ORDER BY date ASC
  → Returns: { date: "2024-11-13", count: 8 }[]

Frontend:
  Replace the current emailApi call with:
  const { data: volumeData } = useQuery({
    queryKey: ['analytics-volume', 7],
    queryFn: () => dashboardApi.getEmailVolume(7),
    staleTime: 120_000,
  });
  Then map volumeData directly to the Recharts LineChart data prop.
```

---

### C.4 — Backend: Add /api/analytics/volume Endpoint

```
File: nexora/backend/src/main/java/com/nexora/controller/DashboardController.java

Add:
  @GetMapping("/api/analytics/volume")
  public ResponseEntity<List<VolumeDataPoint>> getEmailVolume(
      @RequestParam(defaultValue = "7") int days,
      @AuthenticationPrincipal Long userId) {
    return ResponseEntity.ok(emailRepository.countByDateRange(userId, days));
  }

EmailRepository — add native query:
  @Query(value = """
    SELECT DATE(received_at) as date, COUNT(*) as count
    FROM emails
    WHERE user_id = :userId AND received_at >= NOW() - INTERVAL :days DAY
    GROUP BY DATE(received_at)
    ORDER BY date ASC
    """, nativeQuery = true)
  List<Object[]> countByDateRange(@Param("userId") Long userId, @Param("days") int days);

Create VolumeDataPoint DTO:
  { String date; Long count; }
```

---

### C.5 — Thread View in EmailDetail

```
Problem: gmailThreadId exists on every email. When an email is part of a thread
         (multiple emails with the same gmailThreadId), they appear as separate
         cards with no connection. SummarizationService already generates thread
         summaries but they are never surfaced.

Backend — add endpoint:
  GET /api/emails/thread/{threadId}
  → EmailRepository.findByUserIdAndGmailThreadIdOrderByReceivedAtAsc(userId, threadId)
  → Returns: EmailResponse[] (without bodyFull — use snippet)

Frontend — add to EmailDetail (or /emails/:id page):
  Below the AI Summary block, add "Thread (N messages)" section (collapsed by default)
  On expand: fetch /api/emails/thread/:gmailThreadId
  Render each sibling email as a compact row:
    - sender avatar, sender name, time, snippet (first 100 chars)
    - Current email highlighted with gold left border
  If aiSummary exists on the latest email in thread, show it at the top as "Thread Summary"
```

---

### C.6 — Brain Conversation History Panel

```
Problem: BrainConversation records are saved and auto-cleaned up but there is no
         UI to browse past conversations. After Phase B.1 loads history into the
         chat, this adds a proper sidebar for navigation.

Frontend — add to BrainPage.tsx:
  Left panel (180px wide, collapsible):
    - Header: "History" label + collapse toggle
    - List of past conversations sorted by createdAt DESC
      Each item: first 40 chars of userQuery + relative time (e.g. "2h ago")
      Active: gold left border
      Click: load that conversation's messages into the chat area
    - "New conversation" button at top: clears messages, starts fresh

  When panel is collapsed: show only the icon + tooltip
  On mobile: hide panel entirely, show as a drawer

State: selectedConversationId (null = new conversation)
When selectedConversationId changes: filter messages to show only that conversation's Q&A pair
```

---

### C.7 — AI Reply Studio

```
This uses the existing Claude API integration to draft email replies.

Backend — add endpoint:
  POST /api/emails/{id}/draft-reply
  Body: { style: 'PROFESSIONAL' | 'FORMAL' | 'FRIENDLY' | 'CONCISE' }

  In EmailService (new method draftReply):
    Fetch email by id (verify user ownership)
    Build Claude prompt:
      System: "Draft a {style} email reply. Return ONLY the reply body text.
               No subject line. No 'Dear...' unless formal. No sign-off unless formal."
      User: "Original email from {senderName}:\n Subject: {subject}\n{bodySnippet}"
    Call Claude API (claude-sonnet-4-6, max_tokens: 500)
    Return: { draft: string }

Frontend — add to EmailDetail:
  "Draft Reply" button below action chips (outlined blue)
  On click: POST /api/emails/:id/draft-reply → show loading state
  On response: show a panel below the button with:
    - Style selector tabs: Professional · Formal · Friendly · Concise
    - Textarea pre-filled with draft (editable by user)
    - "Copy to clipboard" button
    - "Regenerate" button (calls same endpoint again)
  Panel can be dismissed with X button
```

---

### C.8 — Mark Email as Read on Open

```
File: nexora/frontend/src/pages/InboxPage.tsx (or EmailDetailPage.tsx)
Problem: PATCH /api/emails/:id/read endpoint exists in EmailController but
         is never called when a user opens an email. The unread count on
         Dashboard never decreases during a session.

Fix: In the onClick handler that opens an email (setSelectedEmail or navigate to /emails/:id):
  After the email is selected/loaded, call:
    emailApi.markAsRead(email.id)
  Optimistically update the email's isRead state in the local email list
  Invalidate ['dashboard'] query to update the unread count stat card

  emailApi.markAsRead = (id: number) =>
    axiosInstance.patch(`/api/emails/${id}/read`)
```

---

### C.9 — Dashboard Category Pills → Navigate to Inbox

```
File: nexora/frontend/src/pages/DashboardPage.tsx
Problem: Category pills on the dashboard show counts but clicking them does nothing.
         This is the most natural navigation shortcut in the app.

Fix: Each category pill onClick:
  navigate(`/inbox?category=${category}`)

In InboxPage, read the URL param on mount:
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'ALL';
  const [catFilter, setCatFilter] = useState(initialCategory);

  // Also read emailId param for direct email linking:
  const initialEmailId = searchParams.get('emailId');
  useEffect(() => {
    if (initialEmailId && emails?.length) {
      const email = emails.find(e => e.id === Number(initialEmailId));
      if (email) setSelectedEmail(email);
    }
  }, [initialEmailId, emails]);
```

---

### C.10 — PWA Support

```
Files to create/modify:

1. nexora/frontend/public/manifest.json:
{
  "name": "Nexora",
  "short_name": "Nexora",
  "description": "AI email intelligence for students",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#080c12",
  "theme_color": "#f0c030",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

2. Create 192x192 and 512x512 PNG icons (gold Zap icon on #080c12 background)

3. nexora/frontend/index.html — add in <head>:
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#f0c030" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

4. Install vite-plugin-pwa:
npm install -D vite-plugin-pwa

5. nexora/frontend/vite.config.ts — add VitePWA plugin:
import { VitePWA } from 'vite-plugin-pwa';
// in plugins array:
VitePWA({
  registerType: 'autoUpdate',
  manifest: false, // we're using our own manifest.json
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [{
      urlPattern: /^https:\/\/.*\/api\//,
      handler: 'NetworkFirst',
    }]
  }
})
```

---

## Phase D — Polish Checklist

After all phases above are complete, verify each item:

```
[ ] Landing page: no developer bypass links visible in production build
    (verify with: npm run build && npx serve dist — check the built page)

[ ] TokenEncryptor: all existing encrypted tokens migrated or users prompted to reconnect

[ ] application.yml: no ${KEY:default} patterns — grep for ": your-" and ": 123456"

[ ] H2 console: grep for "h2-console" in SecurityConfig.java — should return nothing

[ ] WebSocket CORS: grep for setAllowedOriginPatterns — should not be "*"

[ ] Brain: open Brain page, refresh, verify past conversations load

[ ] Notifications: click a notification — verify it navigates to the related email

[ ] Dashboard category pills: click "HACKATHON 3" — verify navigates to inbox with filter

[ ] Email mark-as-read: open an email in inbox — verify unread count decreases on dashboard

[ ] Action items: check a pending action — verify it disappears from Pending Actions

[ ] Analytics volume chart: verify it shows accurate counts, not just last 50 emails

[ ] Calendar: open an email with a deadline, check Google Calendar — event should appear

[ ] Settings panel: verify "Last synced: X minutes ago" is visible under role panel

[ ] Mobile: check all pages at 375px viewport — no horizontal overflow

[ ] Dark mode: toggle theme — verify all text is readable in both modes

[ ] Brain history panel: switch conversations — verify correct Q&A pair loads

[ ] PWA: open on mobile browser — verify "Add to Home Screen" prompt appears
```

---

## Cursor-Specific Instructions for This Session

When working on Phase A (UI redesign):
- Apply the design system changes globally before touching individual pages
- Replace all `backdrop-filter: blur(...)` occurrences first — grep the whole src directory
- Replace all `#6366f1` (indigo) and `#7c3aed` (violet) colors with the new token system
- Replace all Tailwind glassmorphism classes (`bg-white/10`, `backdrop-blur-*`) with new solid surface colors
- Add the CSS custom properties to `src/index.css` `:root` block before writing any component

When working on Phase B (security fixes):
- Fix ONE issue per prompt to avoid cross-contamination
- After fixing TokenEncryptor (B.3), immediately write the migration logic — do not skip it
- Test each fix with: `./mvnw spring-boot:run` — if startup fails, the env var fix (B.4) is the reason

When working on Phase C (new features):
- Always write the backend endpoint first, verify it returns the right shape, then write the frontend
- For C.2 (Calendar), test with a real deadline email in production — check the user's Google Calendar

General rule: after every Phase, commit with a descriptive message before starting the next Phase.
```
git commit -m "Phase A: UI redesign — new design system, landing, sidebar, dashboard"
git commit -m "Phase B: Security — fixed IV, removed secret defaults, H2 console, bypass gate"
git commit -m "Phase C: Features — Brain history, notifications, Calendar, reply studio, PWA"
git commit -m "Phase D: Polish — mark read, action complete, analytics fix, category nav"
```

---

*Nexora · React 19 + TypeScript + Tailwind · Spring Boot 3.2.5 + Java 17 · MySQL · Gmail API · Claude claude-sonnet-4-6*
