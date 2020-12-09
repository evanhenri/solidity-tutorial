// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract SimpleStorage {
    string public data;

    function set(string memory _data) public {
        data = _data;
    }

    function get() view public returns(string memory) {
        return data;
    }
}

/*
truffle(development)> let c = await SimpleStorage.deployed()

truffle(development)> c.data()
''

truffle(development)> c.set('this is the new value')
{
  tx: '0xee87468433977b2bbcd2f5b5148cf1bddad3e872d695583a40faf94c125aaf4b',
  receipt: {
    transactionHash: '0xee87468433977b2bbcd2f5b5148cf1bddad3e872d695583a40faf94c125aaf4b',
    transactionIndex: 0,
    blockHash: '0xd15a297452b4f2050405b342673c15ecaeceef5aabb0665d1ce953b747346714',
    blockNumber: 9,
    from: '0xfae3465ba8392ae10eb421ccc93cd80b9fe86bc1',
    to: '0xc2a227572d27a93abae2cafd905e710404956b8c',
    gasUsed: 43404,
    cumulativeGasUsed: 43404,
    contractAddress: null,
    logs: [],
    status: true,
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000$00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000$00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000$00000000000000000000000000',
    rawLogs: []
  },
  logs: []
}

truffle(development)> c.data()
'this is the new value'

truffle(development)> c.get()
'this is the new value'
*/