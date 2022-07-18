FROM node:18-alpine As development

WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install --production=false && yarn cache clean

COPY . .

RUN yarn build # create dist directory


FROM node:18-alpine as production

WORKDIR /app

RUN apk --no-cache add curl

COPY ./package.json ./yarn.lock ./
RUN yarn install --production=true && yarn cache clean # only the production dependencies are installed

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]

HEALTHCHECK --interval=5s --timeout=5s --start-period=1s CMD curl --fail http://127.0.0.1 || exit 1