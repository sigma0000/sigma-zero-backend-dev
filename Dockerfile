FROM node:alpine3.15

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY . ./app 

WORKDIR ./app

RUN npm install && npm run build 

CMD ["node", "build/server.js"]
