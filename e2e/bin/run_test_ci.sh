#!/bin/sh

export STORE_NUMBER=${1:-9741}

echo "Store Number = ${STORE_NUMBER}"

PROMO_UI_HOST="http://promotionsadmin-ext-qa.apps-np.homedepot.com/#"
ADMIN_API_HOST="http://discount-admin-api-qa.apps-np.homedepot.com"
DATA_SERVICE_HOST="http://stuxsh01.st${STORE_NUMBER}.homedepot.com:12127/DiscountDataService/"
ENGINE_HOST="http://stuxsh01.st${STORE_NUMBER}.homedepot.com:12126/discount-engine/"
ENGINE_PATH='v2/items/priceadjustment'

STORE_USER_ID='mfa0101'
STORE_USER_PASSWORD='TestMe123!'

BROWSER='headless'

export ADMIN_CLIENT_HOST ADMIN_API_HOST DATA_SERVICE_HOST ENGINE_HOST USER_ID USER_PASSWORD BROWSER PROMO_UI_HOST STORE_USER_ID STORE_USER_PASSWORD

# bundle exec rspec --format doc
echo "running run_test_ci..."
bundle exec rspec ./spec/journies/store_user_spec.rb

