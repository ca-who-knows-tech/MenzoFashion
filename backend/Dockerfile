# Backend Dockerfile for Railway
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend files
COPY backend/db.json ./
COPY backend/server-custom.js ./

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server-custom.js"]
