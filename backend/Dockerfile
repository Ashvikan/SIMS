# Use the Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the backend runs on
EXPOSE 3000

# Start the backend server
CMD ["node", "index.js"]
