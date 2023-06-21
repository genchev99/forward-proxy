FROM node:16-buster

# Set the working directory
WORKDIR /app

# Copy the dependencies file to the working directory
COPY package-lock.json? package.json ./

# Install dependencies
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Run the application
CMD ["./bin/entrypoint.sh"]
