#!/bin/bash

yarn run server:mockapi&
PORT=80 yarn run server:express
