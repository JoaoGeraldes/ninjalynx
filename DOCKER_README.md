# Stop all running containers

docker kill $(docker ps -aq) && docker rm $(docker ps -aq)

# Free space

docker system prune -af --volumes
