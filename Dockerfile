FROM node:18-alpine

WORKDIR /app

COPY . .

ENV SERVER_PORT=3000
ENV ADMIN_USER=vs_tech_challenge
ENV ADMIN_PASSWORD=SuperSecurePassword123@

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run test

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
