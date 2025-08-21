# Frontend Dockerfile (for React with Vite using npm)
#FROM node:18
FROM node:23-alpine3.21

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the entire frontend code into the container
COPY . /app/

# Expose port 3001 for the React development server
EXPOSE 3002

# Start the frontend app using npm
# CMD ["npm", "run", "dev"]
CMD ["npm", "run", "dev", "--", "--host"]

