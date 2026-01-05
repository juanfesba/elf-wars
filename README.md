# elf-wars
Mostly an excuse for me to practice web development in the cloud, yay.

You run them from elf-wars, not from `./app/`

===

RUNNING

Run Local:
docker compose -p local_project up --build

Run From Git:
docker compose -p git_project -f docker-compose-git.yml up --build

===

DB

$env:PROJ="local_project"
$env:PROJ="git_project"

docker compose -p $env:PROJ restart backend

docker compose -p $env:PROJ exec db psql -U postgres -d myapp
SELECT * FROM ball_dbs;

docker compose -p $env:PROJ down -v