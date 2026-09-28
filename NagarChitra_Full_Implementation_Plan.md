# NagarChitra (নগরচিত্র)
## Civic Intelligence & Public Issue Resolution Platform for Bangladesh

> **Tagline:** See the Problem. Report the Problem. Track the Change.
>
> **Mission:** Transform scattered civic complaints into a transparent, map-first, evidence-based public issue tracking platform where citizens can report problems, communities can verify them, authorities can manage resolution workflows, and the public can see measurable progress.

---

# 0. Product Positioning

NagarChitra is a **civic-tech platform**, not an official government website.

The first release should be positioned as an **independent public prototype / civic intelligence platform**. It must not imply that DNCC, DSCC, RAJUK, WASA, municipalities, ministries, or any other authority officially operates or endorses NagarChitra unless an actual partnership/integration exists.

### Core promise

A citizen should be able to answer four questions:

1. **What is the problem?**
2. **Where is it?**
3. **What happened after it was reported?**
4. **Was it actually fixed?**

An authority-side user should be able to answer:

1. What issues are waiting?
2. Which issues are critical?
3. Who is responsible?
4. How long has each issue been open?
5. What evidence supports the current status?
6. Which issues are overdue?
7. Which fixes have citizens confirmed?

---

# 1. Product Principles

NagarChitra should follow these principles:

- **Evidence over accusation**
- **Transparency over vague claims**
- **Measurable facts over subjective scores**
- **Citizen participation without mob-style voting**
- **Authority workflow without pretending to be an official authority**
- **Privacy by design**
- **Bangladesh-ready architecture from day one**
- **Mobile-first citizen experience**
- **Accessibility-first interaction**
- **Public data should be useful but privacy-preserving**
- **Every important status change should be auditable**
- **No fabricated government data**
- **No fabricated resolution claims**
- **No unsupported allegations of corruption, negligence, or misconduct**

---

# 2. Primary Users

## 2.1 Citizen

Can:

- Create an account
- Browse public issues
- Search areas
- View the civic map
- Report a problem
- Upload evidence
- Pin a location
- Confirm that they see an existing issue
- Follow an issue
- Comment where permitted
- Provide resolution feedback
- Report abuse or incorrect information
- View personal contribution history

## 2.2 Authority Officer

This is a **prototype authority role** unless officially integrated.

Can:

- Review reports
- Verify or reject reports
- Mark duplicates
- Assign departments
- Assign officers
- Change status
- Add internal notes
- Upload resolution evidence
- Set expected response/resolution dates
- View SLA information
- Respond to citizen feedback
- View operational analytics

## 2.3 Moderator

Can:

- Review suspicious content
- Remove abusive content
- Merge duplicate reports
- Hide inappropriate media
- Suspend problematic accounts
- Escalate sensitive cases
- Maintain moderation logs

## 2.4 Admin

Can:

- Manage categories
- Manage geographic areas
- Manage users
- Manage authority organizations
- Manage departments
- Configure SLA rules
- Manage moderation
- Manage public-data settings
- Review audit logs
- Configure system settings

## 2.5 Super Admin

Only for platform owners.

Can:

- Manage administrators
- Manage platform configuration
- Manage integrations
- Access security/audit controls
- Manage feature flags
- Perform emergency system actions

---

# 3. Core Product Modules

1. Landing Page
2. Explore Map
3. Report Wizard
4. Issue Detail
5. Issue Timeline
6. Citizen Verification
7. Area Intelligence
8. Authority Workspace
9. Admin Console
10. Civic Profile
11. Notifications
12. Search
13. Moderation
14. Public Statistics
15. Open Data
16. Public API
17. Audit System
18. Geographic Intelligence
19. SLA Engine
20. Trust & Safety
21. Accessibility
22. Localization
23. Analytics
24. System Health / Operations

---

# 4. Recommended MVP Scope

The MVP should be focused on one pilot geography, such as selected areas of Dhaka.

### MVP Citizen Features

- Account creation
- Login
- Email verification
- Report issue
- Category selection
- Location picker
- Photo upload
- Description
- Severity
- Duplicate warning
- Issue detail
- Timeline
- "I See This Too"
- Follow issue
- Resolution feedback
- Notifications
- Profile

### MVP Public Features

- Homepage
- Live civic map
- Search
- Category filters
- Status filters
- Area pages
- Public statistics
- Issue detail pages

### MVP Authority Prototype

- Authority login/persona
- Issue queue
- Verification
- Assignment
- Department selection
- Status transitions
- SLA monitoring
- Resolution evidence
- Citizen feedback
- Audit timeline

### MVP Admin

- User management
- Issue moderation
- Category management
- Area management
- Authority/department management
- Basic analytics
- Audit log

### Defer from MVP

- SMS
- WhatsApp
- AI image moderation
- AI duplicate detection
- Nationwide rollout
- Official government integrations
- Complex gamification
- Full public API
- Advanced open-data warehouse
- Native mobile apps

---

# 5. Homepage

## 5.1 Hero

Recommended direction:

> **Your city has problems.**
> **Now you can track what happens next.**

Supporting text:

> Report public issues, verify what you see, and follow their progress from report to resolution.

Primary CTA:

- Report an Issue

Secondary CTA:

- Explore the Map

## 5.2 Live Civic Snapshot

Example:

- Active Issues
- Reported Today
- In Progress
- Resolved This Month
- Citizen Confirmed

Only show values backed by actual application data.

## 5.3 Live Map Preview

Show:

- Status markers
- Category markers
- Clustered locations
- Recent reports
- Small issue previews

## 5.4 Area Explorer

Users can search:

- Division
- District
- City
- Area
- Ward

## 5.5 Civic Pulse

For each area:

- Active issues
- New issues this week
- Resolved this month
- Top issue categories
- Average resolution time, if enough data exists

Do not turn this into an unsupported subjective "livability score".

## 5.6 How It Works

1. Report
2. Verify
3. Track
4. Resolve
5. Confirm

## 5.7 Trust Section

Explain:

- Evidence-based reporting
- Community confirmation
- Resolution evidence
- Audit history
- Privacy controls

---

# 6. Explore Map

The map is a core product surface.

## Filters

### Category

- Road Damage
- Drainage
- Waterlogging
- Waste
- Street Light
- Traffic Signal
- Footpath
- Open Manhole
- Exposed Wire
- Public Safety
- Water Supply
- Environmental
- Other

### Status

- Reported
- Verified
- Assigned
- In Progress
- Resolved
- Citizen Verification
- Closed

### Severity

- Low
- Medium
- High
- Critical

### Time

- Today
- Last 7 days
- Last 30 days
- Custom

### Area

- Division
- District
- City
- Area
- Ward

## Map Behavior

- Marker clustering
- Lazy loading
- Viewport-based issue loading
- Marker selection
- Side drawer
- Mobile bottom sheet
- Keyboard-accessible issue list
- URL state for filters
- Deep links to issue
- Map/list synchronized state

---

# 7. Geographic Architecture

The data model should be Bangladesh-ready even if the first pilot is Dhaka.

Recommended hierarchy:

```text
Division
  ↓
District
  ↓
City / Municipality
  ↓
Zone
  ↓
Ward
  ↓
Neighborhood / Area
  ↓
Issue Location
```

The system should not hard-code Dhaka-specific assumptions into the core database.

---

# 8. Report Problem Wizard

Use a 5-step flow.

## Step 1: Category

Show large visual category cards.

## Step 2: Location

Options:

- Use current location
- Search location
- Pin manually
- Drag marker

Show:

- Approximate address
- Area
- Ward where available

Do not require exact location if the user cannot provide it.

## Step 3: Evidence

Allow:

- Up to 5 images
- Optional video in later phase
- Camera capture on mobile
- Image preview
- Delete/reorder

Validate:

- MIME type
- File size
- Dimensions
- Malicious file signatures

Strip unnecessary EXIF metadata before public display.

## Step 4: Details

Fields:

- Short title
- Description
- Severity
- Optional additional information

Avoid collecting unnecessary personal information.

## Step 5: Review & Submit

Show:

- Category
- Location
- Evidence
- Severity
- Description
- Privacy notice

Then:

> Submit Report

---

# 9. Duplicate Detection

Duplicate detection should be layered.

## MVP

Check:

- Geographic radius
- Same category
- Recent reports
- Similar title

Example:

> We found 2 similar reports nearby.

Show existing reports:

- Distance
- Category
- Status
- Date

Actions:

- View Existing Issue
- This Is a Different Problem

## Later

Add semantic text similarity and image similarity.

AI should recommend possible duplicates, not automatically merge them without safeguards.

---

# 10. Issue Status Architecture

## Internal statuses

```text
SUBMITTED
UNDER_REVIEW
VERIFIED
ASSIGNED
IN_PROGRESS
RESOLVED
CITIZEN_VERIFICATION
CLOSED
REJECTED
DUPLICATE
REOPENED
```

## Public statuses

```text
Reported
Verified
Assigned
In Progress
Resolved
Confirmed
```

Public users should not need to understand every internal workflow state.

---

# 11. Status Transition Rules

```text
SUBMITTED
  ↓
UNDER_REVIEW

UNDER_REVIEW
  ├── REJECTED
  ├── DUPLICATE
  └── VERIFIED

VERIFIED
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
RESOLVED
  ↓
CITIZEN_VERIFICATION
  ├── CLOSED
  └── REOPENED
        ↓
    IN_PROGRESS
```

Every transition must be authorized by role and recorded in the audit log.

---

# 12. Issue Detail Page

## Header

Show:

- Issue title
- Category
- Area
- Public status
- Severity
- Report date
- Confirmation count

## Evidence

- Original citizen evidence
- Resolution evidence
- Before/after comparison

## Location

- Map
- Approximate location when privacy requires it

## Timeline

Example:

```text
28 Sep
Reported

28 Sep
Verified

29 Sep
Assigned

30 Sep
Work Started

04 Oct
Marked Resolved

05 Oct
Citizen Verification
```

## Community Confirmation

> I See This Too

Show:

- Number of independent confirmations
- Confirmation period
- Avoid exposing private identities unnecessarily

---

# 13. Resolution Verification

Replace simple binary voting with:

```text
YES, FULLY FIXED
PARTIALLY FIXED
NO, STILL EXISTS
```

Display aggregated feedback:

```text
7 Fully Fixed
2 Partially Fixed
1 Still Exists
```

Do not automatically reopen based on a tiny number of votes.

Use configurable rules.

Example:

```text
Minimum verified responses: 5
OR
Negative response threshold: 30%
AND
Moderator/authority review
```

The exact threshold should be configurable.

---

# 14. Before / After Evidence

Authority or responsible operator can upload:

### Before

Citizen-submitted evidence.

### After

Resolution evidence.

Show side-by-side:

```text
BEFORE              AFTER
[ image ]           [ image ]
```

Add:

- Upload date
- Uploaded by role
- Resolution note

Never alter original evidence.

---

# 15. Area Intelligence

Route:

```text
/nagar/[area]
```

Example:

```text
/nagar/mirpur
/nagar/dhanmondi
/nagar/uttara
```

Show:

- Active issues
- New issues
- Resolved issues
- Resolution rate
- Top categories
- Recent reports
- Hotspots
- Average response time
- Average resolution time

Only show metrics when sample size is meaningful.

Avoid misleading statistics based on tiny datasets.

---

# 16. Civic Pulse

Each area gets a factual snapshot.

Example:

```text
MIRPUR

184 Active Issues
37 New This Week
92 Resolved This Month

Top Reported Categories

Road Damage     42%
Drainage        26%
Waste           18%
Street Light    14%
```

Use percentages only when calculated from defined datasets.

---

# 17. Authority Workspace

This is an **Authority Prototype** until real integration exists.

## Dashboard

Show:

- New Reports
- Under Review
- Critical
- Assigned
- In Progress
- Overdue
- Resolved
- Reopened

## Priority Queue

Sort by:

- Severity
- Age
- SLA breach
- Number of confirmations
- Geographic clustering

Do not call this an official government priority unless connected to an official authority.

---

# 18. Authority Issue Workflow

```text
New Report
  ↓
Review
  ↓
Verify
  ↓
Assign Department
  ↓
Assign Officer
  ↓
In Progress
  ↓
Upload Resolution Evidence
  ↓
Resolved
  ↓
Citizen Verification
```

Authority users can add:

- Internal notes
- Public update
- Expected completion date
- Department
- Assigned officer
- Resolution description

Internal notes must never leak to public users.

---

# 19. Department Architecture

Authorities should be modeled separately from departments.

Example:

```text
Authority
  ├── Department
  │     ├── Officers
  │     └── SLA Rules
```

Potential departments:

- Roads
- Drainage
- Waste
- Street Lighting
- Water
- Public Safety
- Environment

These are configurable, not hard-coded.

---

# 20. SLA Engine

SLA should be configurable by:

- Category
- Severity
- Authority
- Department
- Geographic area

Track:

- Time to verification
- Time to assignment
- Time to first action
- Time to resolution

Statuses:

```text
ON TRACK
DUE SOON
OVERDUE
PAUSED
```

Do not present an SLA as an official government commitment unless it actually is one.

---

# 21. Notifications

## In-app

Notify when:

- Report submitted
- Report verified
- Report rejected
- Report marked duplicate
- Report assigned
- Work started
- Issue resolved
- Verification window opened
- Issue reopened
- User followed issue receives update

## Email

Use for important account and issue events.

## Future

- Push
- SMS
- WhatsApp

---

# 22. Search

Global search should support:

- Issue ID
- Issue title
- Area
- Category
- Ward
- District
- City

Search result types:

```text
Issues
Areas
Categories
```

Use debounced search and indexed database queries.

---

# 23. Civic Profile

Profile should be civic contribution focused, not social-media focused.

Show:

- Reports submitted
- Reports verified
- Issues followed
- Resolution feedback
- Confirmations
- Account age

Optional badges:

- First Reporter
- Local Observer
- Verified Contributor
- Community Helper

Do not create aggressive competitive leaderboards.

---

# 24. Trust & Reputation

Avoid giving users a simplistic "trust score".

Instead track signals internally:

- Verified reports
- Duplicate rate
- Rejected reports
- Abuse reports
- Confirmation consistency

Use these signals for moderation and rate limiting, not public shaming.

---

# 25. Moderation

Moderators can:

- Review report
- Hide media
- Mark spam
- Mark abusive
- Merge duplicate
- Reject invalid report
- Suspend user
- Restore content

Every moderation action must create an audit record.

---

# 26. Abuse Prevention

Implement:

- Rate limiting
- CAPTCHA when suspicious
- Email verification
- Optional phone verification later
- Duplicate detection
- Upload validation
- Abuse reporting
- Account suspension
- Device/IP abuse signals where legally and technically appropriate

Do not use automated signals as the sole basis for severe account actions.

---

# 27. Privacy

Important fields:

```text
exact_latitude
exact_longitude
public_latitude
public_longitude
```

Public location can be generalized where appropriate.

Consider special privacy handling for:

- Private residences
- Children
- Vulnerable persons
- Sensitive infrastructure
- Personal information visible in photos

Allow users to report without publicly displaying their personal profile identity.

---

# 28. Media Privacy

Before public display:

- Strip EXIF location metadata
- Generate optimized copies
- Generate thumbnails
- Validate content type
- Apply file-size limits
- Prevent direct execution of uploaded files
- Store original privately when necessary
- Store public derivatives separately

---

# 29. Data Model

Recommended core tables:

```text
users
profiles
roles
permissions

authorities
departments
authority_users

divisions
districts
cities
zones
wards
areas
locations

issues
issue_categories
issue_media
issue_status_history
issue_assignments
issue_comments
issue_confirmations
issue_resolution_feedback
issue_followers

notifications

moderation_cases
moderation_actions

sla_rules
issue_sla_events

audit_logs

api_keys
api_logs

feature_flags
system_settings
```

---

# 30. Users

```text
id
email
phone
password_hash / auth_provider
role_id
status
email_verified_at
created_at
updated_at
last_login_at
```

Use managed authentication where possible.

Do not store raw passwords.

---

# 31. Profiles

```text
user_id
display_name
avatar_url
bio
preferred_language
notification_preferences
privacy_preferences
created_at
updated_at
```

---

# 32. Issues

Recommended fields:

```text
id
public_id
title
description
category_id
reported_by
location_id
severity
internal_status
public_status
created_at
updated_at
verified_at
assigned_at
started_at
resolved_at
closed_at
reopened_at
```

Additional fields:

```text
authority_id
department_id
current_assignee_id
expected_resolution_at
duplicate_of_issue_id
reopen_count
confirmation_count
```

---

# 33. Locations

Use PostGIS if available.

```text
id
latitude
longitude
geom
address
division_id
district_id
city_id
zone_id
ward_id
area_id
location_privacy_level
created_at
```

`geom` should use a spatial index.

---

# 34. Issue Media

```text
id
issue_id
uploaded_by
type
storage_key
thumbnail_key
mime_type
file_size
width
height
visibility
created_at
```

---

# 35. Issue Status History

```text
id
issue_id
from_status
to_status
changed_by
reason
public_note
internal_note
created_at
```

This is the source of truth for the timeline.

---

# 36. Issue Confirmation

For "I See This Too":

```text
id
issue_id
user_id
created_at
```

Enforce:

```text
UNIQUE(issue_id, user_id)
```

One user should not confirm the same issue repeatedly.

---

# 37. Resolution Feedback

```text
id
issue_id
user_id
response
comment
created_at
```

Response:

```text
FULLY_FIXED
PARTIALLY_FIXED
STILL_EXISTS
```

Again:

```text
UNIQUE(issue_id, user_id)
```

---

# 38. Issue Assignment

```text
id
issue_id
authority_id
department_id
assigned_to
assigned_by
assigned_at
unassigned_at
```

Keep assignment history instead of overwriting it.

---

# 39. Audit Logs

Audit everything important:

- Login
- Role changes
- Issue status changes
- Assignment
- Moderation
- Media changes
- User suspension
- Admin configuration
- API key creation
- Data exports

Fields:

```text
id
actor_id
action
entity_type
entity_id
metadata
ip_hash / security metadata where appropriate
created_at
```

Audit logs should be append-only from the application's perspective.

---

# 40. Open Civic Data

The open-data layer should be introduced after data quality is established.

Public exports:

- Issue counts
- Category statistics
- Area statistics
- Resolution statistics
- Time trends

Never expose:

- Email
- Phone
- Exact private addresses
- Private notes
- Internal moderation data
- Sensitive personal data

---

# 41. Public API

Future endpoints:

```text
GET /api/public/issues
GET /api/public/issues/:id
GET /api/public/areas
GET /api/public/categories
GET /api/public/statistics
GET /api/public/trends
```

Use:

- API versioning
- Rate limiting
- Caching
- Pagination
- Schema validation
- API keys for higher limits
- Abuse monitoring

---

# 42. AI Roadmap

AI should not be the foundation of the MVP.

## Phase 2

### Category suggestion

Image/text → probable category.

### Duplicate suggestion

Text + location + image → similar existing issues.

### Summary

Generate internal summaries of issue clusters.

### Moderation assistance

Detect potentially:

- Spam
- Explicit content
- Irrelevant media

Human review remains the final authority for consequential moderation.

---

# 43. GIS / Spatial Intelligence

Future features:

### Hotspot detection

Identify geographic clusters of similar issues.

### Time-based heatmaps

Compare:

- This week
- This month
- Previous month

### Category layers

Toggle:

- Roads
- Drainage
- Waste
- Lighting

### Cluster analysis

Show areas with unusually high issue density.

Avoid presenting statistical anomalies as proof of wrongdoing.

---

# 44. Analytics

## Public analytics

- Reports over time
- Resolution count
- Issue categories
- Area distribution
- Citizen-confirmed resolutions

## Authority analytics

- Average verification time
- Average assignment time
- Average resolution time
- Overdue issues
- Reopened issues
- Department workload
- Category workload

## Platform analytics

- Active users
- Reports/day
- Duplicate rate
- Rejection rate
- Confirmation rate
- Resolution feedback rate

---

# 45. Data Quality Rules

Before publishing statistics:

- Define the population
- Define date range
- Define status
- Define geographic boundary
- Handle duplicates
- Exclude rejected reports
- Document missing data
- Avoid misleading percentages

Every public metric should have a tooltip or methodology explanation when ambiguity is possible.

---

# 46. Accessibility

Target WCAG 2.2 AA where practical.

Requirements:

- Keyboard navigation
- Visible focus
- Semantic HTML
- Proper labels
- Screen-reader-friendly status
- Sufficient contrast
- Reduced motion support
- Accessible map alternatives
- Text alternative to map-only information
- Large touch targets
- Error messages
- Form validation

The map must never be the only way to access issue information.

---

# 47. Localization

Support:

```text
English
বাংলা
```

Use a language switcher.

Examples:

```text
Report Problem
সমস্যা রিপোর্ট করুন
```

Do not mix languages inconsistently.

Store translated labels separately from data.

Issue titles/descriptions can remain user-generated.

---

# 48. Mobile Experience

Most citizen reporting will likely happen from mobile devices.

Prioritize:

- Camera capture
- GPS
- Large buttons
- Bottom-sheet UI
- Offline draft
- Low-bandwidth image upload
- Retry failed upload
- Compression
- Touch-friendly map controls

---

# 49. Offline / Poor Connectivity

Future enhancement:

Allow users to create a draft report offline:

```text
Draft
 ↓
Stored locally
 ↓
Connection restored
 ↓
Upload
 ↓
Submit
```

Do not claim that a report has been submitted until the server confirms receipt.

---

# 50. Performance

Targets:

- Fast initial page load
- Server-render public pages where appropriate
- Lazy-load maps
- Dynamic-load Leaflet
- Optimize images
- CDN for static assets
- Database indexes
- Pagination
- Viewport-based map queries
- Cache public statistics
- Avoid rendering hundreds of map markers individually

---

# 51. SEO

Public issue and area pages can be indexable where appropriate.

Examples:

```text
/nagar/mirpur
/nagar/dhanmondi
/issues/[public-id]
```

Use:

- Metadata
- Open Graph
- Sitemap
- Robots
- Canonical URLs
- Structured data where appropriate

Do not expose private or sensitive reports to search engines.

---

# 52. Security Architecture

Required:

- HTTPS
- Secure cookies
- CSRF protection where applicable
- XSS protection
- SQL injection protection
- Input validation
- Output encoding
- RBAC
- Rate limiting
- Upload validation
- Secure storage
- Secret management
- Dependency scanning
- Security headers
- Content Security Policy where practical
- Audit logs

Never put secret API keys in client-side code.

---

# 53. Authentication

Recommended:

- Supabase Auth or another managed authentication system
- Email verification
- Password reset
- OAuth later if useful
- Optional phone verification later

Roles must be enforced server-side.

A client-side role switcher must never grant real authority permissions.

---

# 54. Demo Role Switcher

The original implementation plan includes a role switcher for reviewers.

Keep it only as a **demo mode**.

Example:

```text
DEMO MODE

[ Citizen ]
[ Authority ]
[ Admin ]
```

Add a visible label:

> Demo environment. Actions are simulated.

This prevents confusion between UI demonstration and real authority access.

---

# 55. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion

## Backend

Recommended MVP:

- Next.js server actions / route handlers
- Supabase
- PostgreSQL
- PostGIS

## Authentication

- Supabase Auth

## Storage

- Supabase Storage initially
- Cloudflare R2 as a future option

## Maps

MVP options:

- Leaflet + OpenStreetMap

Alternative:

- Mapbox if advanced map styling and geospatial UX justify it

## Validation

- Zod

## Forms

- React Hook Form

## Charts

- Recharts or another lightweight chart library

## Testing

- Vitest
- React Testing Library
- Playwright

---

# 56. Application Structure

```text
nagar-chitra/
├── app/
│   ├── page.tsx
│   ├── explore/
│   ├── report/
│   ├── issues/
│   │   └── [id]/
│   ├── nagar/
│   │   └── [area]/
│   ├── authority/
│   ├── admin/
│   ├── open-data/
│   ├── profile/
│   ├── notifications/
│   └── api/
│
├── components/
│   ├── map/
│   ├── issue/
│   ├── report/
│   ├── authority/
│   ├── analytics/
│   ├── forms/
│   ├── navigation/
│   └── ui/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── geo/
│   ├── permissions/
│   ├── notifications/
│   ├── moderation/
│   ├── analytics/
│   ├── storage/
│   ├── validation/
│   └── audit/
│
├── types/
├── constants/
├── hooks/
├── services/
├── tests/
├── public/
└── docs/
```

---

# 57. Database Indexing

Important indexes:

```text
issues(status)
issues(category_id)
issues(created_at)
issues(severity)
issues(authority_id)
issues(department_id)
issues(reported_by)
locations(area_id)
locations(ward_id)
issue_status_history(issue_id, created_at)
issue_confirmations(issue_id)
issue_resolution_feedback(issue_id)
```

Spatial:

```text
GIST(location.geom)
```

Use composite indexes based on real query patterns.

---

# 58. Map Query Strategy

Do not fetch every issue on initial map load.

Use:

```text
viewport bounds
+
filters
+
pagination / clustering
```

Example conceptual query:

```text
GET issues
within current map bounds
where status = IN_PROGRESS
and category = DRAINAGE
```

Return only necessary fields for markers.

Fetch full issue data after selection.

---

# 59. Error Handling

Every important action needs:

- Loading state
- Success state
- Error state
- Retry action
- Empty state

Example:

```text
No issues found in this area.

Try:
- Expanding the map
- Removing a filter
- Selecting another date range
```

---

# 60. Empty States

Design dedicated empty states for:

- No issues
- No notifications
- No reports
- No authority tasks
- No analytics
- No search results
- No open-data results

Do not leave blank screens.

---

# 61. Design System

Recommended visual direction:

### Primary

`#0B3D3A`

### Accent

`#F2B84B`

### Background

`#F7F8FA`

### Text

`#111827`

### Muted

`#6B7280`

### Danger

`#DC2626`

### Success

`#059669`

Use semantic tokens rather than hard-coded colors throughout components.

---

# 62. Typography

Use:

- Outfit for English UI
- Hind Siliguri for Bangla UI

Ensure font loading does not block rendering.

Use clear type hierarchy:

```text
Display
H1
H2
H3
Body
Caption
Label
```

---

# 63. Motion

Use motion to communicate state, not as decoration.

Good uses:

- Map drawer
- Report step transition
- Status timeline
- Marker selection
- Filter panel
- Before/after comparison

Avoid:

- excessive scroll animations
- slow page transitions
- animated counters everywhere
- motion that delays reporting

Support:

```text
prefers-reduced-motion
```

---

# 64. Notifications UX

Use notification center:

```text
Notifications

● Your report was verified
● Issue #NC-1024 was assigned
● A resolution update was posted
● Verification window opened
```

Allow:

- Mark as read
- Notification preferences
- Email opt-in/out

---

# 65. Issue IDs

Use a human-friendly public identifier:

```text
NC-2026-000123
```

Do not expose sequential database IDs as the only identifier.

Use internal UUIDs separately.

---

# 66. Public Issue URL

Example:

```text
/issues/NC-2026-000123
```

This is easier to share than opaque database UUIDs.

---

# 67. Reporting Rules

Display simple community guidelines:

- Report real public issues
- Use accurate locations
- Upload relevant evidence
- Do not target individuals
- Do not upload private personal information
- Do not make unsupported accusations
- Do not submit duplicate reports unnecessarily

---

# 68. Sensitive Content

Certain issues may require special handling:

- Domestic/private disputes
- Individual accusations
- Personal data
- Children
- Medical information
- Security-sensitive infrastructure

Such reports should not automatically become public.

Route them to moderation/review.

---

# 69. Legal / Trust Layer

Include:

- Terms of Use
- Privacy Policy
- Community Guidelines
- Data methodology
- Open-data policy
- Contact / report abuse
- Disclaimer that NagarChitra is independent unless an official partnership is explicitly stated

Do not imply government affiliation.

---

# 70. Government Integration Strategy

Do not build fake integrations.

Prepare interfaces for future integrations:

```text
NagarChitra
   ↓
Integration Layer
   ↓
Official Authority API
```

Potential future sync:

```text
NagarChitra Issue
      ↓
Official Case ID
      ↓
Authority Status
      ↓
NagarChitra Public Status
```

All official integrations should be explicitly labeled.

---

# 71. Authority Verification Model

A real authority account should eventually require:

- Organization verification
- Domain verification or manual approval
- Named administrator
- Role assignment
- Audit logs

Never allow a normal user to select:

> "I am DNCC"

and obtain authority privileges.

---

# 72. Public Transparency

For verified authority actions, show:

- Organization
- Department
- Action
- Date
- Public note

Do not expose:

- Private officer information
- Internal notes
- Security information

unless explicitly intended for public release.

---

# 73. Reporting Metrics

The platform should distinguish:

### Report count

How many reports were submitted.

### Unique issues

How many distinct issues remain after duplicate handling.

### Verified issues

Reports confirmed as valid.

### Resolved issues

Marked resolved by the responsible workflow.

### Citizen-confirmed issues

Resolution subsequently confirmed by citizens.

These numbers should never be conflated.

---

# 74. Resolution Rate

Define the formula explicitly.

Example:

```text
Resolution Rate =
Resolved Eligible Issues /
Total Eligible Issues
```

Specify:

- Date range
- Geography
- Status rules

Do not simply divide arbitrary totals.

---

# 75. Reopen Rate

```text
Reopen Rate =
Reopened Issues /
Resolved Issues
```

Again, document the measurement window.

---

# 76. Data Methodology Page

Create:

```text
/about/data-methodology
```

Explain:

- What counts as a report
- What counts as verified
- How duplicates are handled
- How resolution is calculated
- How locations are generalized
- What data is public
- What data is excluded

This is important for credibility.

---

# 77. Open Data Phase 2

Public dataset fields can eventually include:

```text
public_issue_id
category
area
ward
district
city
severity
reported_at
verified_at
assigned_at
resolved_at
closed_at
status
```

Never include private user data.

---

# 78. API Versioning

Use:

```text
/api/v1/public/issues
```

instead of committing to unversioned APIs.

Future:

```text
/api/v2/public/issues
```

---

# 79. Testing Strategy

## Unit Tests

Test:

- Status transitions
- SLA calculations
- Permission rules
- Duplicate logic
- Resolution calculations
- Data validation

## Integration Tests

Test:

- Authentication
- Report creation
- Media upload
- Issue workflow
- Notifications
- Database operations

## E2E Tests

Test:

1. Citizen submits report
2. Duplicate warning appears
3. Issue is created
4. Authority verifies
5. Authority assigns
6. Authority marks in progress
7. Authority uploads resolution evidence
8. Citizen submits feedback
9. Issue closes/reopens correctly

---

# 80. Permission Testing

Every role must be tested.

Example:

```text
Citizen
  ✓ create report
  ✓ follow issue
  ✓ confirm issue
  ✗ change authority status

Authority
  ✓ review assigned issue
  ✓ change allowed status
  ✓ upload resolution evidence
  ✗ manage platform admins

Moderator
  ✓ moderate
  ✗ change authority workflow without permission

Admin
  ✓ manage system
```

---

# 81. Security Testing

Before launch:

- Dependency audit
- Authentication testing
- Authorization testing
- Upload security
- Rate-limit testing
- XSS testing
- Injection testing
- CSRF review
- Security-header review
- Secret exposure scan

---

# 82. Deployment

Recommended:

```text
Frontend / App
      ↓
Vercel

Database / Auth / Storage
      ↓
Supabase

Domain
      ↓
nagarChitra.bd or chosen domain
```

Use separate environments:

```text
development
staging
production
```

---

# 83. Environment Variables

Examples:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
MAP_PROVIDER_KEY
SENTRY_DSN
```

Never expose service-role secrets in browser code.

---

# 84. Monitoring

Use:

- Error monitoring
- Server logs
- Database monitoring
- Uptime monitoring
- Performance monitoring

Track:

- 500 errors
- failed uploads
- failed notifications
- slow queries
- authentication failures
- unusual traffic

---

# 85. Backup Strategy

Database:

- Automated backups
- Point-in-time recovery where supported

Media:

- Redundant storage
- Retention policy

Audit logs:

- Longer retention than ordinary application logs where appropriate

---

# 86. Feature Flags

Use feature flags for:

- AI duplicate detection
- Open data
- Authority integrations
- SMS
- Experimental map layers

This allows controlled rollout.

---

# 87. Admin Configuration

Do not hard-code everything.

Configurable:

- Categories
- Severity labels
- SLA rules
- Geographic areas
- Authority departments
- Notification rules
- Verification thresholds
- Feature flags

---

# 88. Demo Dataset

For the portfolio/demo version:

Use clearly labeled synthetic/demo data.

Example:

> Demonstration data. Not an official government dataset.

Do not present fictional reports as real citizen reports.

If real public data is used, record:

- Source
- Date
- License
- Methodology

---

# 89. Demo Mode

The demo should allow reviewers to experience:

```text
Citizen
Authority
Admin
```

But it must display:

> DEMO MODE

All simulated actions should be visually distinguishable from real production data.

---

# 90. Seed Dataset Structure

Seed records should include:

- Public ID
- Category
- Area
- Coordinates
- Severity
- Status
- Timeline
- Evidence
- Confirmation count
- Resolution state

Use a mix of:

- Open
- Verified
- Assigned
- In Progress
- Resolved
- Reopened

Do not make every issue look successful.

---

# 91. Recommended Routes

```text
/
 /explore
 /report
 /issues/[id]
 /nagar/[area]
 /profile
 /notifications

 /authority
 /authority/issues
 /authority/issues/[id]

 /admin
 /admin/users
 /admin/issues
 /admin/categories
 /admin/areas
 /admin/authorities
 /admin/audit

 /open-data
 /about
 /about/how-it-works
 /about/data-methodology
 /privacy
 /terms
 /community-guidelines
 /report-abuse
```

---

# 92. Component Architecture

Core components:

```text
CivicMap
MapMarker
MapCluster
LocationPicker
IssueCard
IssueDrawer
IssueTimeline
IssueStatus
SeverityBadge
CategorySelector
ReportWizard
EvidenceUploader
DuplicateWarning
ConfirmationButton
ResolutionFeedback
BeforeAfterViewer
AreaPulse
StatsCard
AuthorityQueue
SLAIndicator
AuditTimeline
NotificationCenter
SearchCommand
FilterPanel
```

---

# 93. UX States for Every Core Component

Each component should account for:

- Loading
- Loaded
- Empty
- Error
- Disabled
- Permission denied
- Offline
- Partial data

This should be designed before implementation, not after.

---

# 94. Report Submission Reliability

When user submits:

```text
Client
 ↓
Validation
 ↓
Upload evidence
 ↓
Create issue
 ↓
Create audit event
 ↓
Return public issue ID
```

If any step fails, the user should receive a recoverable state.

Never show:

> Report submitted

before the server confirms successful creation.

---

# 95. Concurrency

Prevent:

- Double submission
- Duplicate confirmation
- Duplicate feedback
- Simultaneous conflicting status transitions

Use:

- Unique constraints
- Transactions
- Optimistic locking/version fields where needed

---

# 96. Data Retention

Define retention policies for:

- User accounts
- Issue media
- Audit logs
- Notifications
- Moderation cases
- Deleted content

Do not keep data indefinitely without a defined reason.

---

# 97. Account Deletion

Users should eventually have:

- Account deletion request
- Personal data removal/anonymization
- Public contribution preservation in anonymized form where appropriate

Do not silently delete audit history that must remain for system integrity.

---

# 98. Accessibility Alternative to Maps

Every map-based page should have a list/table alternative.

Example:

```text
Nearby Issues

NC-2026-0012
Road Damage
Mirpur
High
In Progress

NC-2026-0015
Drainage
Mirpur
Critical
Reported
```

This is essential for accessibility and mobile usability.

---

# 99. Performance Budget

Set practical targets:

- Avoid shipping map libraries to pages that do not need them
- Lazy-load heavy components
- Optimize images
- Minimize client-side JavaScript
- Use server components where appropriate
- Cache public statistics
- Paginate large lists

---

# 100. Launch Phases

## Phase 0 — Product Foundation

- Requirements
- Data model
- UX flows
- Design system
- Architecture
- Security model

## Phase 1 — MVP

- Citizen reporting
- Map
- Issue detail
- Timeline
- Authority prototype
- Resolution verification
- Basic analytics

## Phase 2 — Pilot

- One selected Dhaka area
- Real controlled user testing
- Data quality monitoring
- Moderation
- Performance improvements

## Phase 3 — Civic Intelligence

- Area Pulse
- Hotspots
- Trends
- Open Data
- Public API

## Phase 4 — Institutional Integration

- Authority onboarding
- Organization verification
- Official API integration
- Case ID synchronization

## Phase 5 — Bangladesh Expansion

- Additional cities
- Municipalities
- Districts
- More authority types

---

# 101. Suggested Development Order

```text
1. Product requirements
2. Database schema
3. Authentication
4. RBAC
5. Design system
6. Homepage
7. Map engine
8. Location model
9. Report wizard
10. Media upload
11. Issue detail
12. Status engine
13. Audit logs
14. Duplicate detection
15. Citizen confirmation
16. Resolution verification
17. Authority workspace
18. SLA
19. Admin console
20. Area intelligence
21. Notifications
22. Search
23. Accessibility
24. Security hardening
25. Testing
26. Performance
27. SEO
28. Deployment
29. Pilot
30. Data methodology
31. Open data
```

---

# 102. Acceptance Criteria

The MVP is not complete until:

### Citizen

- User can create account
- User can submit a valid issue
- Location is stored correctly
- Evidence is uploaded securely
- Duplicate warnings work
- Issue receives public ID
- Timeline is generated
- User can confirm an issue
- User can follow an issue
- User can submit resolution feedback

### Authority

- Authority role is protected
- Authority can review assigned issues
- Status transitions are enforced
- Assignment history is preserved
- Resolution evidence can be uploaded
- SLA is calculated correctly

### Admin

- Admin can moderate
- Admin can manage categories
- Admin can manage users
- Admin can inspect audit logs

### Public

- Map works
- Filters work
- Issue detail works
- Area pages work
- Statistics are traceable to database data

### Security

- Unauthorized users cannot access authority/admin actions
- Upload validation works
- Rate limiting exists
- Secrets are protected

### Accessibility

- Core flows work with keyboard
- Form labels are accessible
- Map has list alternative
- Reduced motion works

---

# 103. Manual QA Checklist

## Homepage

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile
- [ ] Slow network
- [ ] Keyboard
- [ ] Reduced motion

## Report

- [ ] Valid submission
- [ ] Invalid submission
- [ ] Large file
- [ ] Wrong file type
- [ ] GPS denied
- [ ] Duplicate
- [ ] Network failure
- [ ] Double click submission

## Map

- [ ] Marker
- [ ] Cluster
- [ ] Filter
- [ ] Search
- [ ] Mobile drawer
- [ ] List fallback

## Authority

- [ ] Role protection
- [ ] Status transition
- [ ] Assignment
- [ ] SLA
- [ ] Resolution upload

## Verification

- [ ] Fully fixed
- [ ] Partially fixed
- [ ] Still exists
- [ ] Reopen rule
- [ ] Duplicate feedback

## Admin

- [ ] User moderation
- [ ] Category
- [ ] Area
- [ ] Authority
- [ ] Audit

---

# 104. Important Product Decisions

The following should remain explicit:

### NagarChitra is not initially a government system.

### NagarChitra does not certify that a reported problem is true until verification.

### NagarChitra does not accuse individuals or organizations of wrongdoing.

### NagarChitra does not fabricate official data.

### Demo data must be labeled.

### Official authority status requires real authority verification/integration.

### Citizen feedback is evidence, not an absolute truth mechanism.

### Public statistics must have defined methodology.

---

# 105. Future Advanced Features

Potential future modules:

## Citizen Alerts

Notify users when a nearby issue changes.

## Ward Dashboard

Aggregate issues by ward.

## District Dashboard

Aggregate city/district trends.

## Infrastructure Layers

Show:

- Roads
- Drains
- Public facilities
- Lighting
- Water infrastructure

Only when reliable datasets are available.

## Historical Civic Archive

Track recurring problems over years.

## Public Planning Dashboard

Show long-term issue trends.

## Community Organizations

Verified NGOs / civic groups can participate as organizations.

## Research Mode

Allow researchers to query anonymized datasets.

## Government Integration

Official workflows can replace the prototype authority workflow when partnerships exist.

---

# 106. Signature Features

NagarChitra should be remembered for these features:

## 1. Civic Map

The city becomes a visual database of public issues.

## 2. Issue Timeline

Everyone can see what happened after a report.

## 3. Before / After

Resolution requires evidence.

## 4. Citizen Verification

Citizens can say whether the reported fix actually worked.

## 5. Area Pulse

Neighborhood-level civic statistics.

## 6. Open Data

Eventually allow researchers and developers to use anonymized civic data.

## 7. Audit Trail

Important system actions remain traceable.

---

# 107. What Makes It Different

The differentiation should not be:

> "Nobody has ever built this."

That claim should not be made without research.

The stronger positioning is:

> **NagarChitra combines citizen reporting, geospatial issue discovery, evidence-based resolution tracking, citizen verification, and civic analytics in one Bangladesh-focused platform.**

That is a defensible product position.

---

# 108. Recommended First Pilot

Do not launch nationwide.

Start with:

```text
Bangladesh
  ↓
Dhaka
  ↓
Selected area / ward
  ↓
Controlled pilot
```

Collect real feedback.

Measure:

- Reports submitted
- Valid reports
- Duplicate reports
- Confirmation rate
- Resolution evidence
- Citizen verification
- Average response time
- Average resolution time

Then expand.

---

# 109. Portfolio / Public Demo Positioning

The portfolio presentation should show:

### Problem

Bangladesh's public issues are often reported through scattered channels.

### Product

NagarChitra creates one map-first workflow.

### Workflow

```text
Report
→ Verify
→ Assign
→ Resolve
→ Citizen Confirm
```

### Technical challenge

- GIS
- RBAC
- Workflow engine
- Audit trail
- Media handling
- Data analytics
- Privacy
- Accessibility

### Outcome

A working civic-tech prototype with a path toward real institutional integration.

---

# 110. Final Product Architecture

```text
                           NAGARCHITRA
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
          CITIZENS           PUBLIC             AUTHORITIES
             │                  │                  │
             │                  │                  │
        Report Issue       Explore Map        Review Queue
        Upload Evidence    Area Pulse         Verify
        Confirm Issue      Statistics         Assign
        Follow             Issue Timeline     Work
        Feedback           Open Data          Resolve
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                        CIVIC DATA ENGINE
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
        POSTGRES              POSTGIS              STORAGE
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                    WORKFLOW / SLA / AUDIT
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
          TRUST & SAFETY     ANALYTICS          NOTIFICATIONS
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                       PUBLIC DATA LAYER
                                │
                    ┌───────────┴───────────┐
                    │                       │
                  API                    EXPORT
                    │                       │
                  JSON                     CSV
```

---

# 111. Final Definition

**NagarChitra is a Bangladesh-focused civic intelligence and public issue resolution platform that connects citizens, geographic data, evidence, workflow management, and measurable resolution tracking.**

The MVP should prove one thing:

> **A public problem can be reported, located, tracked, acted upon, and independently checked for resolution through one transparent digital workflow.**

Everything else should be built around making that workflow reliable, trustworthy, accessible, and scalable.

---

# 112. Build Rule

Before adding a new feature, ask:

1. Does it improve reporting?
2. Does it improve verification?
3. Does it improve resolution tracking?
4. Does it improve transparency?
5. Does it improve data quality?
6. Does it improve accessibility?
7. Does it improve security/privacy?
8. Does it create measurable public value?

If the answer is no to all of these, it probably does not belong in the MVP.
