# Build with: docker build -t quantum-game-2:latest .
# Run with: docker run -d -p 8080:8080 quantum-game-2:latest
# Pre-built (but possibly out of date) image tagged: spkane/quantum-game-2:latest

FROM node:fermium-alpine3.12
RUN apk add --no-cache git

RUN addgroup -S container && adduser -u 1500 -h /app -S container -G container
USER container

RUN ["chown", "-R", "1500", "/app"]
COPY --chown=container:container package.json /app/package.json
COPY --chown=container:container yarn.lock /app/yarn.lock
WORKDIR /app
COPY --chown=container:container . /app
RUN yarn install && \
    npx browserslist@latest --update-db && \
    yarn build && \
    yarn autoclean --init && \
    yarn autoclean --force && \
    yarn cache clean

EXPOSE 8080

CMD ["yarn", "serve"]

