#!/bin/sh

USER_ID='gxr2964'
USER_PASSWORD='qa02test!'

export USER_ID USER_PASSWORD

bundle exec rspec --format doc
