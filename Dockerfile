# Base image for Node.js
FROM node:18-alpine

# Set the working directory for the app
WORKDIR /app

# Copy the client directory and install dependencies
COPY ./client ./client
WORKDIR /app/client
RUN npm install


# Go back to the base app directory
WORKDIR /app

# Copy remaining project files (if any, adjust as needed)
COPY . .

# Expose the port used by the app
EXPOSE 5173

# Command to run your application
CMD ["npm", "run", "dev"]
