#!/bin/bash

yarn run build:prod -- --progress
sudo docker build -t scruffle-map .
