// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract EtherWallet {
    address public owner;

    // `owner` will need to be set when this contract is deployed
    constructor(address _owner) {
        owner = _owner;
    }

    function balanceOf() view public returns(uint) {
        return address(this).balance;
    }

    function deposit() payable public {}

    function send(address payable _to, uint _amount) public {
        if(msg.sender == owner) {
            // send `_amount` ETH from this smart contract to the `_to` address
            _to.transfer(_amount);
        }
        else {
            revert('sender is not allowed');
        }
    }
}

/*
$ docker exec -it eattheblocks_truffle_1 truffle console --network ropsten

truffle(ropsten)> const c = await EtherWallet.deployed();

truffle(ropsten)> c.address
'0x97576cAd2D40DFa1a6B6e441523510005455b544'

// deposit 0.1 ETH
truffle(ropsten)> c.deposit({from: '0x23dca59DB6A2FA829cD28f1D7b27b9e76791cBBF', value: 100000000000000000});

truffle(ropsten)> (await c.balanceOf()).toNumber()
1

// send 0.1 ETH from the contract owned by 0x23dc... to 0x72c...
truffle(ropsten)> c.send('0x72cb9E8142Fb7FA3618740B16eE2aE9F6e4815E6', '100000000000000000', {from: '0x23dca59DB6A2FA829cD28f1D7b27b9e76791cBBF'})
*/