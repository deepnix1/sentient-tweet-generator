# Overview

This is a full-stack Tweet generation application built with React (Vite frontend) and Express.js (Node.js backend). The application allows users to input text and generate multiple AI-powered tweet variations based on customizable style preferences like tone, length, emoji usage, hashtags, and call-to-action inclusion. The app uses OpenAI's GPT-5 model to generate engaging, platform-optimized tweet content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: React Hook Form for form handling, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark mode ready)
- **Component Structure**: Modular component architecture with reusable UI components in `/components/ui/` and feature-specific components

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API endpoints with structured JSON responses
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Request Processing**: JSON body parsing and URL encoding support
- **Development Features**: Request logging middleware for API calls with response capture

## Data Storage Solutions
- **Database**: PostgreSQL configured for production with Drizzle ORM
- **Development Storage**: In-memory storage implementation for development/testing
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Data Models**: Structured schemas for tweets, user preferences, and generation requests
- **Storage Interface**: Abstract storage interface allowing easy switching between implementations

## Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: CORS handling and request validation using Zod schemas
- **API Protection**: Input validation and sanitization for all endpoints

## External Dependencies
- **AI Service**: OpenAI GPT-5 integration for tweet content generation
- **Database Provider**: Neon Database serverless PostgreSQL
- **Development Tools**: ESBuild for production builds, TSX for development server
- **Styling**: Font Awesome for icons, Google Fonts integration
- **Form Validation**: Hookform resolvers with Zod for type-safe validation
- **Date Handling**: date-fns for date manipulation and formatting

## Development Environment
- **Replit Integration**: Configured for Replit environment with cartographer plugin and runtime error overlay
- **Build Process**: Separate client and server builds with proper asset handling
- **TypeScript Configuration**: Shared TypeScript config across client, server, and shared modules
- **Path Aliases**: Configured import aliases for clean import statements
- **Hot Reload**: Vite HMR for frontend and TSX for backend development