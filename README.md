# Fitness Tracker

A comprehensive fitness tracking application built with Next.js, TypeScript, and Supabase. Track your workouts, meals, and get AI-powered exercise recommendations.

## Features

- **Exercise Tracking**: Log and monitor your workouts with details like duration, type, and calories burned
- **Diet Tracking**: Track your meals with nutritional information (calories, protein, carbs, fat)
- **AI Workout Recommendations**: Get personalized workout plans based on your equipment, fitness level, and goals
- **Dashboard**: View your daily progress, including calorie intake, active days, and recent activities
- **Toronto Timezone Support**: All dates and times are handled in Toronto timezone

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Cohere API
- **State Management**: React Context
- **Form Handling**: React Hook Form, Zod

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Cohere API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
COHERE_API_KEY=your_cohere_api_key
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fitness-tracker.git
   cd fitness-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run database migrations:
   ```bash
   npx supabase db push
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses Supabase as the database. The schema includes:

- `profiles`: User profiles with personal information
- `exercises`: Exercise logs
- `meals`: Meal tracking with nutritional information

Database migrations can be found in the `supabase/migrations` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
