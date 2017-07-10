FROM juliocanares/node-base

COPY .docker/dev/entrypoint.sh .docker/dev/builder.sh /tmp/app/
RUN chmod +x /tmp/app/*.sh

WORKDIR /app

ENTRYPOINT ["/tmp/app/entrypoint.sh"]
