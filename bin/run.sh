#!/usr/bin/env bash

composer install
npm install
yarn install
yarn run encore dev --watch &
gulp
