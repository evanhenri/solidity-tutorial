FROM debian:buster-20201012

WORKDIR /app

RUN apt-get update \
    && apt-get install -y \
        curl \
        git \
        vim \
        wget

# Install solidity compiler
RUN wget -O /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/v0.7.5/solc-static-linux \
    && chmod +x /usr/local/bin/solc

# Install nodejs + npm
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash - \
    && apt-get install -y \
        nodejs

RUN npm install -g \
    eth-gas-reporter \
    static-server \
    truffle

COPY ./entrypoint.sh /
COPY ./17 /app
COPY ./.secrets ./truffle-config.js /app/

ENTRYPOINT ["/entrypoint.sh"]
