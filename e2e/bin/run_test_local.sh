#!/bin/sh

ADMIN_CLIENT_HOST="http://localhost:4201/#"
ADMIN_API_HOST="http://localhost:9999"
DATA_SERVICE_HOST="http://localhost:8082"
ENGINE_HOST="http://localhost:8084"
USER_ID='local'
USER_PASSWORD='sosecure'


export ADMIN_CLIENT_HOST ADMIN_API_HOST DATA_SERVICE_HOST ENGINE_HOST USER_ID USER_PASSWORD

bundle exec rspec --format doc
