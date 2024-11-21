# Step 1: Use an appropriate Node.js base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the server's package.json and install dependencies
COPY package.json ./
RUN npm install

# Step 4: Copy the server's source code into the container
COPY . .

# Step 5: Expose the server's port
EXPOSE 5000

# Step 6: Start the server
CMD ["npm", "start"]
