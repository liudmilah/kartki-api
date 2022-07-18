FROM mongo:5.0.0

COPY ./docker/mongo/mongo-init.sh /docker-entrypoint-initdb.d
RUN chmod 755 /docker-entrypoint-initdb.d/mongo-init.sh