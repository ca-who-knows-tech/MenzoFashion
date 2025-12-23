# Menzo Fashion Ecommerce Store

A modern, mobile-friendly ecommerce website for Menzo Fashion, specializing in men's clothing including t-shirts, shirts, pants, nightwear, wallets, belts, and sunglasses.

## Features

- Mobile-first responsive design
- Product catalog by category
- Product detail pages
- Shopping cart functionality
- Multi-step checkout (address, shipping, payment placeholder) with order persistence
- Orders page to view placed orders
- Admin action matrix and data tables (Products/Offers/Categories) with search, sort, pagination, and bulk delete
- Built with React, TypeScript, Vite, and Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Start the backend (in a separate terminal):
   ```bash
   cd backend
   npm install
   npm run start:custom
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage Notes

- Checkout is available at `/checkout`. After placing an order, you are redirected to `/orders`.
- Admin dashboard is at `/admin`. Use quick actions to add/modify/delete, or the tables for faster edits (search/sort/pagination, bulk deletion).
- Backend runs on `http://localhost:5000` exposing `/products`, `/categories`, `/offers`, `/orders`, `/coupons`.

## Deployment

### Frontend Deployment to GitHub Pages

1. Ensure your repository is pushed to GitHub.

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Update `vite.config.ts` to set the base path:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/MenzoFashion/',
   });
   ```

4. Add deploy script to `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

5. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

Your site will be available at `https://YOUR_USERNAME.github.io/MenzoFashion/`.

### Backend Deployment

The backend uses json-server for development. For production, deploy the backend to a service like Heroku, Vercel, or Railway.

1. In `backend/package.json`, add a start script:
   ```json
   "scripts": {
     "start": "json-server --watch db.json --port 5000"
   }
   ```

2. Deploy the `backend` folder to your chosen platform.

Update the frontend API calls to point to the deployed backend URL.