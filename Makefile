build:
	docker-compose \
		-f docker-compose-test.yml \
		build \
		--pull

test-backend:
	docker-compose \
		-f docker-compose-test.yml \
		up \
		--abort-on-container-exit \
		--exit-code-from backend \
		--force-recreate \
		backend

test-frontend:
	docker-compose \
		-f docker-compose-test.yml \
		up \
		--abort-on-container-exit \
		--exit-code-from frontend \
		--force-recreate \
		frontend

test: test-backend test-frontend

docker:
	docker build -t dndmachine .
