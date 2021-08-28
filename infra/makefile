.PHONY: down
down:
	docker-compose -p local down

.PHONY: up
up:
	docker-compose -p local run --rm wait-localstack
	awslocal cloudformation create-stack --stack-name local --template-body file://./cf.yml
