# backend/Dockerfile

# Step 1: Start from official Node.js 20 image (tiny Alpine Linux)
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files first (for faster rebuilds)
COPY package*.json ./

# Step 4: Install only production packages
RUN npm install --production

# Step 5: Copy all your source code
COPY . .

# Step 6: Tell Docker this app uses port 3000
EXPOSE 3000

# Step 7: Command to start the app
CMD ["node", "server.js"]