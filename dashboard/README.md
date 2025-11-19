# City of London Corporation Demo Dashboard

A lightweight values dashboard built with React, TypeScript, and Vite, showcasing the Verbatim brand identity.

## Features

- **Values Overview**: Browse all identified values with salience and actualization scores
- **Value Details**: Explore stories, enablers, and blockers for each value
- **Transcript Viewer**: Click any quote to view the full interview transcript with highlighted relevant chunks
- **Interview Editing**: Edit interview chunks directly in the transcript viewer to fix transcription errors
  - Editable text fields for each chunk
  - Original text displayed underneath edited versions
  - Restore original button to revert edits
  - Edited versions persist to JSON and display throughout the dashboard
- **Data-Driven**: Fully powered by JSON data from the analysis pipeline
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Verbatim Brand**: Implements the "Modern Depth" color palette and typography system

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **CSS Modules** for scoped styling
- **Google Fonts** (IBM Plex Mono, Spectral, Inter)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

To enable the interview editing feature, you need to run both the frontend and backend servers:

**Terminal 1 - Backend Server (for saving edits):**
```bash
npm run server
```

This starts the data persistence server on `http://localhost:3001`

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Note**: You can run the frontend alone without the backend, but editing functionality will not work without the backend server running.

### Build

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Data Structure

The dashboard reads from `/public/data/values_dashboard.json`, which should contain:

- `values_overview`: Array of values with salience and actualization scores
- `value_details`: Per-value stories, enablers, and blockers
- `interviews_raw`: Full interview transcripts with chunks

## Project Structure

```
dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── AppLayout.tsx
│   │   └── TranscriptViewer.tsx
│   ├── context/          # React context providers
│   │   └── DataContext.tsx
│   ├── pages/            # Page components
│   │   ├── ValuesOverviewPage.tsx
│   │   └── ValueDetailPage.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles with Verbatim brand
├── public/
│   ├── data/             # JSON data files
│   └── verbatim_logo.png # Verbatim logo
└── package.json
```

## Brand Identity

The dashboard implements the Verbatim brand identity:

### Colors (Modern Depth Palette)
- **Forest Ink**: `#1E3A32` (Primary text, depth)
- **Slate**: `#4A5859` (Secondary elements)
- **Cream**: `#FAF8F5` (Backgrounds)
- **Coral**: `#FF6B58` (CTAs, highlights, salience)
- **Sage**: `#8BA888` (Success, actualization)

### Typography
- **IBM Plex Mono**: Logo, pull quotes, data
- **Spectral**: Headings (H1-H3)
- **Inter**: Body copy and UI elements

## License

This project is part of the Verbatim values analysis pipeline.
