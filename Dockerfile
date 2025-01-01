FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 8000
CMD ["npm", "run", "start"]
