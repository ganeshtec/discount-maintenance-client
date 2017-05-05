#!/bin/sh

ONLINE_USER_ID='gxr2964'
ONLINE_USER_PASSWORD='qa02test!'

STORE_USER_ID='txd4562'
STORE_USER_PASSWORD='qa02test!'

export ONLINE_USER_ID ONLINE_USER_PASSWORD STORE_USER_ID STORE_USER_PASSWORD


bundle exec rspec --format doc
#bundle exec rspec ./spec/journies/store_user_spec.rb
