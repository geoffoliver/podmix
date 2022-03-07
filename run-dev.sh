#!/bin/sh
yarn install
yarn migrate up
yarn dev
