# Install dependencies
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Run the app
EXPOSE 3000
CMD ["npm", "start"]
