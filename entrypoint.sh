#!/usr/bin/env bash

set -e

echo "Installing truffle dependencies"
npm install \
    @truffle/hdwallet-provider \
    @openzeppelin/test-helpers
echo "Finished installing truffle dependencies"

echo "Migrating contracts"
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
