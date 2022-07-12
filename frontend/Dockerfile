FROM node:16.14.0-alpine AS base

ARG PORT=3000
ENV PORT $PORT

ARG REACT_APP_MIDDLEWARE_URL
ENV REACT_APP_MIDDLEWARE_URL "$REACT_APP_MIDDLEWARE_URL"

ARG REACT_APP_MIDDLEWARE_PORT
ENV REACT_APP_MIDDLEWARE_PORT "$REACT_APP_MIDDLEWARE_PORT"

ARG REACT_APP_TOTAL_NFTS_NUM
ENV REACT_APP_TOTAL_NFTS_NUM "$REACT_APP_TOTAL_NFTS_NUM"

WORKDIR /usr/src/app

EXPOSE $PORT

COPY ./frontend/package*.json ./

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

RUN npm install

COPY ./frontend ./

RUN npm run build

### --- Final Image --- ###
FROM base 

ENV NODE_ENV "production"

USER root

RUN \
apk --no-cache --update add dumb-init && \
rm -rf /var/cache/apk/*

RUN npm install -g serve

USER 1000:1000

USER node
WORKDIR /build

COPY --from=base /usr/src/app/build ./

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
CMD ["serve", "-d", "-l", "tcp://0.0.0.0:${PORT}", "-s", "/build"]
