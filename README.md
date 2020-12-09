Tutorial videos - https://eattheblocks-pro.teachable.com/courses/588302/lectures/11376832

Code repos - https://gitlab.com/jklepatch/eattheblocks-pro/-/tree/master/dapp-30

### Development
```
$ cd /home/ehenri/git/ehenri/personal/Solidity/EatTheBlocks

# Make sure the correct volume is mounted into the ganache container at /app
$ docker-compose up --build

# Shouldn't have to run this manually since it's done in entrypoint.sh
$ docker exec -it eattheblocks_truffle_1 truffle migrate

$ docker exec -it eattheblocks_truffle_1 truffle test

$ docker exec -it eattheblocks_truffle_1 truffle develop
truffle(develop)> let contract = await SimpleSmartContract.deployed()
```
