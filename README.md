# Spiritual Tablets App

A comprehensive React Native/Expo application for spiritual content management with Supabase backend integration.

## Features

- 📱 Cross-platform (iOS, Android, Web)
- 🔐 Authentication with Supabase
- 📚 Books, Videos, and Audio content
- 🎯 Events and Gallery management
- 💰 Donation system with Razorpay
- 👥 User profiles and admin panel
- 🎓 Course enrollment system
- 📧 Newsletters and notifications

## Tech Stack

- **Frontend**: React Native, Expo Router
- **Backend**: Supabase
- **Payment**: Razorpay
- **Styling**: React Native Web
- **Icons**: Lucide React Native

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for web
npm run build
```

### Environment Variables

Create a `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment on Render

### Step 1: Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `https://github.com/powerstackhub/SptabGloball.git`

### Step 2: Configure Build Settings
- **Name**: `spiritual-tablets-app`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Publish Directory**: `dist`

### Step 3: Environment Variables
Add these environment variables in Render:
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NODE_VERSION`: `18`

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

## Project Structure

```
├── app/                    # App routes (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   ├── admin/             # Admin panel
│   ├── auth/              # Authentication
│   └── ...                # Other routes
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utilities and configurations
├── assets/                # Images and static files
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for web production
- `npm start` - Start production server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is private and proprietary.