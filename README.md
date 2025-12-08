# Business Finder

A Next.js website to discover businesses worldwide that don't have a website.

## Features

- 🌍 Search businesses across 25+ countries
- 🏢 Find businesses without websites
- 📊 View statistics and conversion rates
- 📱 Responsive design for all devices
- ⚡ Real-time search powered by Google Places API

## Setup Instructions

### 1. Get Google Places API Key

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Places API" and "Maps JavaScript API"
4. Create an API key (Credentials → API Keys)
5. Restrict it to "Places API"

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

Create a `.env.local` file:

```
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
```

### 4. Run the Project

```bash
npm run dev
```

Open http://localhost:3000

## Building for Production

```bash
npm run build
npm start
```

## License

MIT