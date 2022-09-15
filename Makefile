define SYNOPSIS

┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Prisma API - GNU make. Available targets:                                                   │
└────────────────────────────────────────────────────────────────────────────────────────────┘

  up         Builds and runs the entire development container network
  down       Stops and removes the Docker network and all containers within
  prune      Stops and removes the Docker network, all containers, volumes and local images
  logs       Follows logs from all services in the Docker network
  sh         Enter a shell environment in the API
  help       Shows this help content
  
endef

export SYNOPSIS

.PHONY: default
default:
	@make help

.PHONY: help
help: 
	@echo "$$SYNOPSIS"


.env:
	@make echo-header contents="Copying default environment contents from .env.dist to .env"
	@cp .env.dist .env


.PHONY: up
up: .env
	@make echo-header contents="Pulling images..."
	@docker compose pull

	@make echo-header contents="Composing container orchestration..."
	@docker compose up --force-recreate --build --detach
	
	@make echo-header contents="Container status:"
	@docker compose ps --all
	
	@make help


.PHONY: logs
logs:
	@make echo-header contents="Real-time logs of all composed services..."
	@docker compose logs --follow


.PHONY: down
down:
	@make echo-header contents="Stopping and removing containers"
	@docker compose down


.PHONY: prune
prune:
	@make echo-header contents="Stopping and removing containers"
	@docker compose down --volumes --rmi local


.PHONY: build
build:
	docker compose up --build


.PHONY: sh
sh:
	docker compose exec -it api sh

# ---------------------------------------------------------------------------------------------
#       Utils.
# ---------------------------------------------------------------------------------------------

.PHONY: echo-header
echo-header: contents=
echo-header:
	@echo
	@echo "┌────────────────────────────────────────────────────────────────────────────────────────────┐"
	@echo "│ ${contents} "
	@echo "└────────────────────────────────────────────────────────────────────────────────────────────┘"
	@echo