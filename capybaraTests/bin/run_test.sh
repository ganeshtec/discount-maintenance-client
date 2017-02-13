#!/bin/sh

USER_ID='qat010'
USER_PASSWORD='qa02test'

export USER_ID USER_PASSWORD

bundle exec rspec --format doc
