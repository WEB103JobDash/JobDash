# Step 1: Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the client source code
COPY . .

# Expose the client port
EXPOSE 5173

# Start the client (in dev mode)
CMD ["npm", "run", "dev"]
