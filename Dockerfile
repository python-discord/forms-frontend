FROM node:14-slim
WORKDIR /app

# Copy in lock files
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install

# Copy program in
COPY . .

# Serve the frontend
ENTRYPOINT ["yarn", "run"]
CMD ["start", "--host", "0.0.0.0"]
