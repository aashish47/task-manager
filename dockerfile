FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm prune --production

COPY . .

CMD [ "npm", "start" ]