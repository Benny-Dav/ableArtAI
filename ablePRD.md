🧠 PRODUCT REQUIREMENTS DOCUMENT (PRD)
Product: AfriGen AI
Type: Web App (AI Image Generation Platform)
Author: Raven (Benedicta Davour)
Date: October 2025
1. 📘 Product Overview

AfriGen AI is a generative image creation web app that allows users to:

Upload their photos and generate AI-stylized versions (e.g., artistic, cartoon, fantasy, or Afrofuturism styles).

Optionally generate images from prompts only, without uploading.

Explore suggested style badges to quickly pick creative looks.

Access a special AFRICON Graduation Theme, designed for AI trainees to generate a branded, shareable “graduation portrait.”

Share their generated images on social platforms.

2. 🎯 Objectives
Objective	Description
Democratize AI art	Make AI-generated art accessible, fun, and community-driven.
Promote AFRICON branding	Offer a personalized “Graduation” AI generation for trainees.
Engage users creatively	Encourage content sharing and engagement via social platforms.
Build portfolio value	Showcase African creativity, tech, and innovation through AI art.
3. 🧩 Key Features
3.1 User Features

Authentication

Email/Google login.

Special login for AFRICON trainees with pre-registered credentials.

Credit system (e.g., 3 for normal users, 1 for AFRICON users).

Image Upload

Upload face photos (JPG/PNG, ≤5MB).

Auto-crop suggestions for best results.

Prompt Input

Optional text prompt.

Generate even with empty prompt (pure style-based).

Style/Theme Selection

Scrollable badges for style presets:
e.g. Afrofuturism, Cartoon, Studio Portrait, Fantasy, Graduation.

Clicking badge pre-fills example prompt.

AI Generation

Generate image via OpenAI or Replicate API.

“Generating…” progress animation.

Display before/after preview.

Credits and Limits

Each generation deducts 1 credit.

Credits displayed in dashboard.

AFRICON users: only one “Graduation” generation allowed.

History / Gallery

View past generations.

Option to favorite or delete images.

Social Sharing

Share generated image to LinkedIn, Instagram, X.

Optional watermark: “Made with AfriGen AI”.

3.2 Admin Features

User Management: view users, roles, credits.

Theme Management: add/edit/delete themes and sample images.

Analytics: track total generations, popular themes, user activity.

4. 👥 User Roles
Role	Description	Access
Guest	Can browse homepage, see demo images	No generation access
Registered User	Can upload/generate up to 3 free images	Access to all normal styles
AFRICON Trainee	Special sign-in for branded generation	Access to “Graduation Theme” (1 use)
Admin	Internal team	Manage users, themes, analytics
5. ⚙️ Functional Requirements
Category	Requirement
Auth	Supabase Auth (email/password, Google OAuth, AFRICON custom credential import)
Database	User data, generation logs, credit counts, theme definitions
Storage	User uploads & generated images (Supabase Storage / AWS S3)
AI Engine	Integration with Replicate or OpenAI Image API
UI/UX	Tailwind, Framer Motion for animation, shadcn/ui for components
Backend	Next.js API Routes (server actions for AI calls & credit logic)
Deployment	Vercel (frontend), Supabase backend
Security	Auth-based route protection, API rate limiting, input sanitization
6. 🗄️ Tech Stack
Layer	Technology
Frontend	Next.js 14 (App Router) + TypeScript
UI	Tailwind CSS + Framer Motion + shadcn/ui
Backend	Supabase (Auth, DB, Storage, Edge Functions)
AI Generation	OpenAI Image API / Replicate (Flux or Stable Diffusion)
State Management	Zustand / Context API
Hosting	Vercel + Supabase Cloud
Version Control	GitHub
Analytics	PostHog / Supabase logs
7. 📊 Database Schema (Simplified)

Users

Field	Type	Description
id	UUID	Primary key
name	String	Full name
email	String	User email
role	Enum (‘regular’, ‘africon’, ‘admin’)	User type
credits	Integer	Remaining generation credits
created_at	Timestamp	Registration date

Generations

Field	Type	Description
id	UUID	Primary key
user_id	UUID	Linked user
input_prompt	Text	User’s text prompt
style	String	Selected theme
input_image_url	Text	Uploaded photo
generated_image_url	Text	Final AI output
created_at	Timestamp	Generation time

Themes

Field	Type	Description
id	UUID	Primary key
name	String	Theme name
sample_image	Text	Preview thumbnail
prompt_template	Text	Default prompt text
created_at	Timestamp	Date added
8. 🧭 User Flow Summary

Normal User:

Signs up → Receives 3 credits

Uploads image → Selects style badge → Clicks Generate

Waits for result → Downloads or Shares

Each generation deducts one credit

AFRICON Trainee:

Logs in with special credentials

Auto-directed to “Graduation Theme” page

Uploads photo → Gets branded AI graduation image

Can share on LinkedIn/Instagram

9. 🚀 Implementation Plan (Phased Approach)
Phase 1: Core Foundation (Week 1–2)

Goal: Set up base project and authentication.

 Initialize Next.js 14 project with Tailwind + TypeScript.

 Configure Supabase (Auth, DB, Storage).

 Set up /app structure with layouts and basic pages.

 Implement auth pages (login/register).

 Build user dashboard skeleton.

 Define DB schema and test CRUD.

✅ Deliverable: Working login/signup flow, user stored in Supabase.

Phase 2: Image Upload & AI Integration (Week 3–4)

Goal: Enable AI image generation.

 Create image upload UI (drag & drop or button).

 Add prompt input and theme badges.

 Build /api/generate route for AI calls.

 Integrate OpenAI / Replicate API for image generation.

 Display generated image preview.

 Deduct user credit after successful generation.

✅ Deliverable: Fully functional generation page with upload + prompt.

Phase 3: AFRICON Theme (Week 5)

Goal: Add branded experience for AFRICON trainees.

 Create “Graduation” theme with custom gown overlay or styled prompt.

 Restrict AFRICON users to 1 generation credit.

 Add branded overlay (optional: ControlNet or template compositing).

 Include AFRICON logo watermark.

✅ Deliverable: AFRICON graduation image generation feature.

Phase 4: User Dashboard + Gallery (Week 6–7)

Goal: Add user profile and history management.

 Build gallery page with generated image history.

 Add credit counter & “Buy Credits” placeholder.

 Add “Delete” and “Favorite” image options.

 Enable sharing to social platforms.

✅ Deliverable: Dashboard with full user experience.

Phase 5: Admin & Analytics (Week 8)

Goal: Build basic admin panel.

 Add admin role & login gate.

 Create theme management CRUD.

 Add user overview and credit editor.

 Integrate analytics (e.g., total generations).

✅ Deliverable: Admin dashboard operational.

Phase 6: Polishing & Launch (Week 9–10)

Goal: Prepare MVP for release.

 Refine UI/UX (Framer Motion transitions, responsive layout)

 Add error handling, rate limits, and security rules

 Deploy on Vercel

 Test with AFRICON trainee accounts

 Marketing landing page setup

✅ Deliverable: MVP live and ready for user testing.

10. 🎨 Design Direction (for UI/UX)

Mood: Afro-tech elegance — dark mode with gold and deep red highlights.

Typography: Rounded, friendly yet bold.

Components: Rounded cards, smooth animations, hover glow effects.

Inspiration: Midjourney, Runway, Fotor AI, but with Afrocentric warmth.

11. 🧾 Success Metrics
Metric	Target
AFRICON user completion rate	90% successfully generate graduation image
Average generation time	< 15 seconds
Social shares	200+ in first campaign
Returning users	40%
Bug-free sessions	98% stability