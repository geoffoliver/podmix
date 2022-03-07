#!/bin/sh
yarn install
yarn migrate up
yarn build
yarn start
