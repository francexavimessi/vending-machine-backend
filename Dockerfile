# Base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# COPY --from=builder /src/public ./public
# Expose the port the app runs on
EXPOSE 3080

# Start the application

# CMD ["npm", "run", "build"]

CMD ["npm", "run", "start"]


