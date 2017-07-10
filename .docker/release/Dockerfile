FROM juliocanares/node-base

RUN mkdir -p /app

COPY dist/release.tar.gz /app

WORKDIR /app

RUN tar -xf release.tar.gz --strip-components=1

CMD ["npm", "run", "start"]
