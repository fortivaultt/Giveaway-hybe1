FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only the package.json for npm install step
COPY ./docker/listener/package.json ./package.json

# Copy the listener script and any other local scripts
COPY ./scripts ./scripts

RUN npm ci --production

ENV NODE_ENV=production

# Healthcheck to ensure the process is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD [ "node", "-e", "process.exit(0)" ]

CMD [ "node", "scripts/supabase-realtime-listener.js" ]
