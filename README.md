# matchamatch 

## User Journey

Emma is a graduate student who recently developed a love for matcha but struggles to find good places beyond the one cafe she knows, wanting to explore more options while avoiding disappointing experiences. She opens matchamatch after a friend's recommendation, creates an account, and sets her basic preferences for sweetness and strength levels that will help with personalized tracking and recommendations. After granting location access, Emma lands on the Home screen showing an interactive map with matcha place markers around her area, including several she's never heard of like "Matcha Cafe Maiko." She can filter by preparation styles like ceremonial or latte and see distances from her location. Tapping on Matcha Cafe Maiko's marker takes her to the Place Detail screen showing photos, hours, price range, and preparation styles offered - she taps "Save" to bookmark it for later, then explores and saves two more promising places the same way. The next week, Emma visits Matcha Cafe Maiko and tries their matcha latte. Impressed by the perfect froth and subtle sweetness, she opens the app and navigates to the Log Entry screen where she rates it 5 stars, adjusts sliders for sweetness and strength, adds notes about the "perfect froth texture and beautiful presentation," and uploads a photo of the aesthetic drink. Over the following weeks, Emma visits 4 more saved places, logging each experience immediately afterward through the same process. Her Collection screen now shows two organized sections: "Saved Places" (her future to-visit list) and "Logs" (her personal rating history with detailed notes). When she filters the logs for 4+ stars, she can quickly see her top discoveries. The "For You" section on the home page learns from her logged experiences and suggests new places matching her preferences. When Emma's parents visit, she opens her Collection, reviews her logged experiences, and confidently takes them to her highest-rated spot, explaining exactly why she chose it based on her logged notes about preparation quality and taste. matchamatch has transformed her from someone who knew one good place into a confident matcha explorer with a curated, searchable personal guide to her city's best options.

## Link to screen recording


[@demo](./demo_frontendcheckin.mov)







# Frontend details 

A Vue.js application for tracking matcha experiences, discovering new places, and getting personalized recommendations.

## Features

- 🍵 Track matcha experiences with ratings, sweetness, and strength levels
- 📍 Discover matcha cafes and shops
- ❤️ Save favorite places
- 📝 View and manage experience logs
- 🤖 AI-powered profile summaries and recommendations
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running at `http://localhost:8000/api`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint and fix files

## Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Reusable Vue components
├── router/          # Vue Router configuration
├── services/        # API service layer (TypeScript)
├── stores/          # Pinia stores (TypeScript)
├── types/           # TypeScript type definitions
├── views/           # Page components
├── App.vue          # Root component
├── main.ts          # Application entry point
└── shims-vue.d.ts   # Vue TypeScript declarations
```

## API Configuration

The application is configured to communicate with the backend at `http://localhost:8000/api`. This is set up in:

- `vite.config.ts` - Proxy configuration for development
- `src/services/api.ts` - API base URL and typed endpoints

To change the backend URL, update the `API_BASE_URL` in `src/services/api.ts`.

All API endpoints are fully typed with TypeScript interfaces defined in `src/types/api.ts`.

## Backend API

The application expects the backend to implement the API specification defined in `API_SPEC.md`. All endpoints use POST requests and return JSON responses.

### Main API Modules:

- **ExperienceLog** - Create, update, and manage matcha experience logs
- **PlaceDirectory** - Manage matcha places and locations
- **UserDirectory** - User registration and preferences
- **RecommendationEngine** - Personalized place recommendations

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add new views in `src/views/`
3. Update routes in `src/router/index.ts`
4. Add API methods in `src/services/api.ts`
5. Define types in `src/types/api.ts`

### State Management

User authentication state is managed using Pinia in `src/stores/user.ts`. The user ID, display name, and email are persisted in localStorage. The store is fully typed with TypeScript.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to a static hosting service.

## License

MIT
