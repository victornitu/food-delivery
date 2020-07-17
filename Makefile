update:
	docker-compose up -d --build ${SERVICE}
start:
	docker-compose up -d ${SERVICE}
stop:
	docker-compose down ${SERVICE}
status:
	docker-compose ps
inspect:
	docker-compose logs -f ${SERVICE}
init:
	curl -i -d '{"token":"X_CHANGE_THIS_X"}' -H "Content-Type: application/json" http://localhost:8082/admin
clean:
	rm -rf data/*

