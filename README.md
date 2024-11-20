# Wanted Games Backend

Backend service for the Wanted Games web application.

## Prerequisites
- Node.js (v14+)
- npm

## Quick Start

1. **Clone & Install:**
   ```bash
   git clone git@github.com:yaminmomo15/wanted-games-backend.git
   cd wanted-games-backend
   npm install
   ```

2. **Configure:**
   - Copy `.env.example` to `.env`
   - Generate JWT secret at [Auth Secret Generator](https://auth-secret-gen.vercel.app/)
   - Update environment variables

3. **Run:**
   ```bash
   npm run seed    # Initialize database
   npm run dev     # Start server at http://localhost:3000
   ```
