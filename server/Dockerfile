# Using official Node 20 Alpine image
FROM node:20-alpine

# Create and set working directory for backend server
WORKDIR /usr/src/app

# Creating Non root user 
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup


# Copy dependencies 
COPY package*.json ./

###
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "production" ]; then \
      npm ci --only=production; \
    else \
      npm install; \
    fi
###

COPY . .

# Switch user
RUN chown -R nodeuser:nodegroup /usr/src/app

EXPOSE 5000

CMD ["npm", "start"]
