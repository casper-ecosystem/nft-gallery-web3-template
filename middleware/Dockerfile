FROM node:16.14.0-alpine AS base

ENV NODE_ENV "development"

EXPOSE $MIDDLEWARE_PORT

WORKDIR /usr/src/app

RUN npm install -g npm

COPY ./middleware/package*.json ./

RUN npm install

COPY ./middleware ./

RUN npm run build

# prod image
FROM base

ENV NODE_ENV "production"

RUN \
apk --no-cache --update add curl && \
rm -rf /var/cache/apk/*

WORKDIR /app

COPY ./middleware/package*.json ./

RUN npm install --production

COPY --from=base /usr/src/app/dist ./dist

CMD curl https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem --output ./dist/cert.pem && npm run start:prod
