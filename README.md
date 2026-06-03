# Portfolio Application

An advanced, interactive digital portfolio showcasing full-stack engineering expertise, interactive design, and creative micro-applications. Built on **Next.js 15 (App Router)**, **React 19**, and **Tailwind CSS v4**, this platform utilizes fluid animations powered by **Motion (formerly Framer Motion)** and **GSAP**, smooth kinetics via **Lenis**, and a **Supabase** backend integration.

---

## 🚀 Key Features

* **Advanced Micro-Frontend Showcase (The Laboratory)**: A collection of fully interactive canvas-driven visual models and micro-applications:
  * **AppleAnimation**: An interactive mobile mock canvas that dynamically generates responsive physics-based gradient wave simulations utilizing custom `@border-waves/core` libraries upon touch/hover events.
  * **NickRoom**: High-fidelity, canvas-rendered sprite-sheet animations synchronized with contextual layout transitions and audio snippet triggers (`nickRoomSnippet.mp3`).
  * **ScheduledMuter**: A standalone interactive utility layout illustrating automated scheduling logic.
* **Responsive Interactive Timeline**: An engineering-focused career timeline widget equipped with custom tag filters, expandable code inspector modules, and real-time dashboard skeletons.
* **Hardware-Aware Animation Optimization**: Built-in environment utilities (`useHardware`, `useOptimizeAnimations`) that detect and classify device capacity profiles (`high`/`low`), gracefully dropping frame rates or turning off resource-intensive canvas components to guarantee flawless performance across devices.
* **Full Localization (i18n)**: Comprehensive support for multiple locales (English and Russian) implemented via `next-intl` utilizing localized file layouts and paths.
* **Global Sheets & Drag-to-Dismiss Modals**: A rich modal experience with complex drag physics, custom tracking boundaries, and reactive spring physics for a native-mobile app feel on the web.
* **Real-time Configuration Backend**: Seamless data-fetching configuration synchronized using a Supabase schema backend mapped directly into the app state using Zustand and custom hooks.

---

## 🛠 Tech Stack

* **Core Framework**: Next.js 15.3.8 (App Router with Turbopack), React 19, TypeScript
* **Styling & Theme**: Tailwind CSS v4, PostCSS, custom modular utility styles
* **Animation & Interaction**: Motion 12, GSAP (`@gsap/react`), Lenis Smooth Scroll
* **State Management**: Zustand
* **Internationalization**: `next-intl`
* **Database & BaaS**: Supabase Client JS (with automated type generation bindings)
* **Image Optimization**: Sharp

---

## 📁 Repository Architecture

The project adheres to a clean, highly modular component design:

src/
├── app/                  # Localized Next.js App Router layout structure
│   └── [locale]/         # Multilingual directory branches (en/ru)
├── components/           # Core reusable architecture
│   ├── animations/       # Low-level SVG and text keyframe handlers
│   ├── modals/           # Universal multi-gesture sheet modules
│   └── ui/               # Modular primitives (Code highlight, Timeline, Tooltips)
├── constants/            # Cache TTLs and centralized prefixes
├── contexts/             # Hardware configurations, global view state, and analytics providers
├── features/             # Business logic modules (Banner, Job, Laboratory, SocialMedia)
├── hooks/                # Performance tracking, parallax, and custom query hooks
├── i18n/                 # Localization path mapping and creation routing
├── store/                # Zustand navigation and animation action state
├── styles/               # Main entrypoints and core color schemas
└── utils/                # Supabase clients, canvas math, and image loader helper scripts

---

## 🛠 Getting Started

### 1. Clone & Prerequisites

Ensure you have Node.js installed on your development machine.

### 2. Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_API_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_API_DOMAIN=your_project_id

```

### 3. Install Dependencies

```bash
npm install

```

### 4. Database Type Synchronization

Sync your database schema definitions dynamically with TypeScript types by running the built-in type generation helper:

```bash
npm run prepare-db-types

```

### 5. Running the Application

To launch the dev environment utilizing Next.js Turbopack fast compilation over port `4040`:

```bash
npm run dev

```

The application will be accessible at `http://localhost:4040`.

---

## 📦 Build Pipeline

Generate a highly optimized, static, and server-ready production distribution:

```bash
npm run build
npm run start

```