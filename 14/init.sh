#!/usr/bin/env bash

set -e

ln -sf /app/build/contracts/Voting.json /app/frontend/client/src/
ln -s /app/frontend/client/node_modules /app/frontend/client/src/
