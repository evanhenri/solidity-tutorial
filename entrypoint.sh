#!/usr/bin/env bash

set -e

# truffle can't import packages into truffle-config.js unless the node_modules
# directory they are installed in resides in the same directory as truffle-config.js.
# We need to install the truffle hardware wallet package so it can be used in
# our truffle config.
npm install
rm -rf /app/build
truffle migrate --reset
# truffle migrate --reset --network ropsten

echo "Finished migrating contracts"

[[ -x /app/init.sh ]] && /app/init.sh

if [[ -d /app/frontend ]]; then
    cd /app/frontend
    [[ -d client ]] && cd client

    echo "Installing frontend packages"
    npm install

    echo "Starting frontend server"
    npm start
else
    tail -f /dev/null
fi

exec "$@"
