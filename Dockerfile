FROM node:fermium-alpine3.12
RUN apk add --no-cache git

RUN addgroup -S container && adduser -u 1500 -h /app -S container -G container
USER container

RUN ["chown", "-R", "1500", "/app"]
COPY --chown=container:container package.json /app/package.json
COPY --chown=container:container yarn.lock /app/yarn.lock
WORKDIR /app
RUN ["yarn", "install"]
COPY --chown=container:container . /app
RUN ["npx", "browserslist@latest", "--update-db"]
RUN ["yarn", "build"]

EXPOSE 8080

CMD ["yarn", "serve"]
