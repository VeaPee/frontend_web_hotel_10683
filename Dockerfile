FROM node:21.6.1-alpine

RUN apk add --no-cache python3 && \
    npm install -g npm@latest

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production

COPY . .

RUN chown -R node /usr/src/app
USER node

RUN npm run test

CMD ["npm", "start"]
