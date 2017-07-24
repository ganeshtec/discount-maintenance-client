#!/bin/sh

export STORE_NUMBER=${1:-9741}

echo "Store Number = ${STORE_NUMBER}"

ADMIN_CLIENT_HOST="http://discount-admin-client-qa.apps-np.homedepot.com/#"
ADMIN_API_HOST="http://discount-admin-api-qa.apps-np.homedepot.com"
DATA_SERVICE_HOST="http://stuxsh01.st${STORE_NUMBER}.homedepot.com:12127/DiscountDataService/"
ENGINE_HOST="http://stuxsh01.st${STORE_NUMBER}.homedepot.com:12126/discount-engine/"
ENGINE_PATH='v2/items/priceadjustment'
USER_ID='mc62ye'
USER_PASSWORD='qa02test!'

BROWSER='headless'

export ADMIN_CLIENT_HOST ADMIN_API_HOST DATA_SERVICE_HOST ENGINE_HOST USER_ID USER_PASSWORD BROWSER

bundle exec rspec --format doc
