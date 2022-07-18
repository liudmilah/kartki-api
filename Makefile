init: docker-down-clear docker-pull docker-build docker-up install
init-ci: docker-create-traefik-network init

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down --remove-orphans

docker-down-clear:
	docker-compose down -v --remove-orphans

docker-pull:
	docker-compose pull

docker-build:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1 --pull

docker-create-traefik-network:
	docker network create traefik-public

install:
	docker-compose run --rm cli yarn install

lint:
	docker-compose run --rm cli yarn eslint

eslint-fix:
	docker-compose run --rm cli yarn eslint-fix

api-test:
	docker-compose run --rm cli yarn test --watchAll=false

push-dev-cache:
	docker-compose push

push-build-cache:
	docker push ${REGISTRY}/kartki-api:cache-development
	docker push ${REGISTRY}/kartki-api:cache
	docker push ${REGISTRY}/kartki-api-db:cache

push:
	docker push ${REGISTRY}/kartki-api:${IMAGE_TAG}
	docker push ${REGISTRY}/kartki-api-db:${IMAGE_TAG}

yarn-add:
	docker-compose run --rm cli yarn add $(p) $(f)

yarn-rm:
	docker-compose run --rm cli yarn remove $(p)

build:
	DOCKER_BUILDKIT=1 docker --log-level=debug build --pull --build-arg BUILDKIT_INLINE_CACHE=1 \
    --target development \
    --cache-from ${REGISTRY}/kartki-api:cache-development \
    --tag ${REGISTRY}/kartki-api:cache-development \
	--file docker/node/Dockerfile .

	DOCKER_BUILDKIT=1 docker --log-level=debug build --pull --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from ${REGISTRY}/kartki-api:cache-development \
    --cache-from ${REGISTRY}/kartki-api:cache \
    --tag ${REGISTRY}/kartki-api:cache \
    --tag ${REGISTRY}/kartki-api:${IMAGE_TAG} \
	--file docker/node/Dockerfile .

	DOCKER_BUILDKIT=1 docker --log-level=debug build --pull --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from ${REGISTRY}/kartki-api-db:cache \
    --tag ${REGISTRY}/kartki-api-db:cache \
    --tag ${REGISTRY}/kartki-api-db:${IMAGE_TAG} \
	--file docker/mongo/Dockerfile .

deploy:
	ssh -v deploy@${HOST} -p ${PORT} 'rm -rf api_${BUILD_NUMBER}'
	ssh -v deploy@${HOST} -p ${PORT} 'mkdir api_${BUILD_NUMBER}'
	scp -v -P ${PORT} docker-compose-production.yml deploy@${HOST}:api_${BUILD_NUMBER}/docker-compose.yml
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "COMPOSE_PROJECT_NAME=kartki-api" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "REGISTRY=${REGISTRY}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "IMAGE_TAG=${IMAGE_TAG}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "DB_API_USER=${DB_API_USER}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "DB_API_PASSWORD=${DB_API_PASSWORD}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MAILER_HOST=${MAILER_HOST}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MAILER_PORT=${MAILER_PORT}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MAILER_USERNAME=${MAILER_USERNAME}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MAILER_PASSWORD=${MAILER_PASSWORD}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MAILER_ENCRYPTION=${MAILER_ENCRYPTION}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "MAILER_FROM_EMAIL=${MAILER_FROM_EMAIL}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "FB_APP_ID=${FB_APP_ID}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "FB_APP_SECRET=${FB_APP_SECRET}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "GOOGLE_APP_ID=${GOOGLE_APP_ID}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "GOOGLE_APP_SECRET=${GOOGLE_APP_SECRET}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "FRONTEND_URL=${FRONTEND_URL}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && echo "JWT_SECRET=${JWT_SECRET}" >> .env'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && docker-compose pull'
	ssh -v deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && docker-compose up --build --remove-orphans -d'
	ssh -v deploy@${HOST} -p ${PORT} 'rm -f api'
	ssh -v deploy@${HOST} -p ${PORT} 'ln -sr api_${BUILD_NUMBER} api'

rollback:
	ssh deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && docker-compose pull'
	ssh deploy@${HOST} -p ${PORT} 'cd api_${BUILD_NUMBER} && docker-compose up --build --remove-orphans -d'
	ssh deploy@${HOST} -p ${PORT} 'rm -f api'
	ssh deploy@${HOST} -p ${PORT} 'ln -sr api_${BUILD_NUMBER} api'
