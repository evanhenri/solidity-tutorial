// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract SplitPayment {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier only_owner() {
        require(msg.sender == owner, 'only owner can send transfers');
        _;
    }

    function send(address payable[] memory _to, uint[] memory _amounts) public payable only_owner() {
        require(_to.length == _amounts.length, '_to and _amount arrays must have the same length');

        for(uint i = 0; i < _to.length; i++) {
            _to[i].transfer(_amounts[i]);
        }
    }
}

/*
$ docker exec -it eattheblocks_truffle_1 truffle console
truffle(development)> const c = await SplitPayment.deployed()
truffle(development)> const to = ["0xA0851A8aDA09068df92a54f400C469555EBd643b", "0x23eB4A5710dB9A721f5Df349C688A6cf5fdcA377"];
truffle(development)> const amounts = ["1000000000000000000", "2000000000000000000"];

// fund the contract with 3.5 ETH from accounts0, send account1 1 ETH and account2 2 ETH
truffle(development)> c.send(to, amounts, {from: "0x23dca59DB6A2FA829cD28f1D7b27b9e76791cBBF", value: "3500000000000000000"});

truffle(development)> await web3.eth.getBalance(accounts[0])
'96488225240000000000'
truffle(development)> await web3.eth.getBalance(accounts[1])
'101000000000000000000'
truffle(development)> await web3.eth.getBalance(accounts[2])
'102000000000000000000'
*/
